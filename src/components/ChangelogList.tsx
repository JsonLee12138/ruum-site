import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import type { SiteCopy } from "../i18n";
import { renderInlineMarkdown } from "../lib/inline-markdown";
import { refreshLatestChangelog, type ChangelogEntry } from "../lib/releases-client";

interface ChangelogListProps {
  copy: SiteCopy["changelogPage"];
  entries: ChangelogEntry[];
}

export default function ChangelogList({ copy, entries }: ChangelogListProps) {
  const [items, setItems] = useState<ChangelogEntry[]>(entries);
  const [filter, setFilter] = useState<"all" | "stable" | "beta">("all");

  useEffect(() => {
    refreshLatestChangelog(entries).then((result) => {
      setItems(result.entries);
    });
  }, [entries]);

  const filtered = items.filter((entry) => {
    if (filter === "stable") return !entry.prerelease;
    if (filter === "beta") return entry.prerelease;
    return true;
  });

  const renderList = (title: string, sectionItems: string[], accent = false) => {
    if (sectionItems.length === 0) return null;
    return (
      <div className="space-y-1.5">
        <div
          className={`font-mono text-[11px] font-semibold uppercase tracking-wider ${
            accent ? "text-amber" : "text-ink-muted"
          }`}
        >
          {title}
        </div>
        <ul className="m-0 list-none p-0 space-y-1.5 text-[13.5px] leading-relaxed text-ink-secondary">
          {sectionItems.map((text, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 bg-ink-muted" aria-hidden="true" />
              <span>{renderInlineMarkdown(text)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="inline-flex rounded-[2px] border border-hairline bg-surface p-0.5">
        {(
          [
            { key: "all", label: copy.filterAll },
            { key: "stable", label: copy.filterStable },
            { key: "beta", label: copy.filterBeta },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 text-[12.5px] font-medium rounded-[1px] cursor-pointer transition-colors ${
              filter === tab.key
                ? "bg-inset text-ink font-semibold"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filtered.map((entry) => (
          <article key={entry.version} className="slab p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-mono text-[18px] font-bold text-ink m-0 tabular-nums">
                  {entry.tag}
                </h2>
                <span
                  className={`rounded-[2px] px-2 py-0.5 font-mono text-[11px] font-semibold ${
                    entry.prerelease ? "bg-amber-soft text-amber" : "bg-inset text-ink-secondary"
                  }`}
                >
                  {entry.prerelease ? copy.betaBadge : copy.stableBadge}
                </span>
                <span className="font-mono text-[12px] text-ink-muted tabular-nums">
                  {entry.date}
                </span>
              </div>

              <a
                href={entry.releaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[12px] text-ink-secondary hover:text-amber no-underline"
              >
                <span>{copy.viewOnGithub}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="space-y-4">
              {renderList(copy.featuresLabel, entry.sections.features, true)}
              {renderList(copy.fixesLabel, entry.sections.fixes)}
              {renderList(copy.improvementsLabel, entry.sections.improvements)}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
