import { useEffect, useState } from "react";
import { Check, Copy, Terminal, ArrowRight } from "lucide-react";
import type { SiteCopy } from "../i18n";

export type InstallTabKey = "unix" | "homebrew" | "windows" | "cli";

interface InstallBarProps {
  copy: SiteCopy["installBar"];
  downloadHref: string;
}

const COMMANDS: Record<InstallTabKey, string> = {
  unix: "curl -fsSL https://ruum-updates.jsonlee12138.com/install.sh | sh",
  homebrew: "brew tap JsonLee12138/tap && brew install --cask ruum",
  windows: "irm https://ruum-updates.jsonlee12138.com/install.ps1 | iex",
  cli: "curl -fsSL https://ruum-updates.jsonlee12138.com/install.sh | sh -s -- --cli-only",
};

export default function InstallBar({ copy, downloadHref }: InstallBarProps) {
  const [activeTab, setActiveTab] = useState<InstallTabKey>("unix");
  const [detectedTab, setDetectedTab] = useState<InstallTabKey>("unix");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("win")) {
      setActiveTab("windows");
      setDetectedTab("windows");
    } else {
      setActiveTab("unix");
      setDetectedTab("unix");
    }
  }, []);

  const cmd = COMMANDS[activeTab];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const tabs: { key: InstallTabKey; label: string }[] = [
    { key: "unix", label: copy.tabs.unix },
    { key: "homebrew", label: copy.tabs.homebrew },
    { key: "windows", label: copy.tabs.windows },
    { key: "cli", label: copy.tabs.cli },
  ];

  return (
    <div className="slab overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline bg-inset/60 px-3 py-2">
        <div
          className="flex flex-wrap items-center gap-1"
          role="tablist"
          aria-label="Install method"
        >
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveTab(tab.key);
                  setCopied(false);
                }}
                className={`inline-flex items-center gap-1.5 rounded-[2px] px-2.5 py-1 text-[12px] font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-surface text-ink border border-strong"
                    : "text-ink-secondary hover:text-ink border border-transparent"
                }`}
              >
                <span>{tab.label}</span>
                {tab.key === detectedTab && (
                  <span className="hidden sm:inline rounded-[1px] bg-amber-soft px-1 py-[1px] font-mono text-[10px] text-amber">
                    {copy.detectedTag}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <span className="hidden md:inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-amber" aria-hidden="true" />
          {copy.verifiedNote}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface px-3.5 py-3 min-w-0">
        <div className="flex items-center gap-2.5 overflow-x-auto ruum-scroll min-w-0 w-full">
          <Terminal className="h-4 w-4 shrink-0 text-amber" aria-hidden="true" />
          <code className="font-mono text-[12.5px] sm:text-[13px] text-ink whitespace-nowrap select-all">
            {cmd}
          </code>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <a
            href={downloadHref}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-ink-secondary no-underline hover:text-amber transition-colors px-2 py-1"
          >
            <span>{copy.allPackages}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="btn-primary px-3 py-1.5 text-[12px]"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{copy.copied}</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{copy.copy}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
