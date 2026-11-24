import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import type { SiteCopy } from "../i18n";
import { renderInlineMarkdown } from "../lib/inline-markdown";
import {
  detectPlatformAsync,
  detectPlatformSync,
  pickRecommendedArtifact,
  pickSiblingArtifacts,
  type DetectedArch,
  type DetectedOs,
} from "../lib/platform-detect";
import {
  formatBytes,
  refreshLatestReleases,
  type NormalizedRelease,
  type ReleasesPayload,
} from "../lib/releases-client";

interface DownloadCenterProps {
  copy: SiteCopy["downloadPage"];
  initialData: ReleasesPayload;
}

const OS_LABELS: Record<DetectedOs, string> = {
  macos: "macOS",
  linux: "Linux",
  windows: "Windows",
};

const BREW_CMD = "brew tap JsonLee12138/tap && brew install --cask ruum";
const AUR_CMD = "yay -S ruum-bin";
const QUICK_CLI_CMD =
  "curl -fsSL https://ruum-updates.jsonlee12138.com/install.sh | sh -s -- --cli-only";
const QUICK_WIN_CMD = "irm https://ruum-updates.jsonlee12138.com/install.ps1 | iex";

export default function DownloadCenter({ copy, initialData }: DownloadCenterProps) {
  const [data, setData] = useState<ReleasesPayload>(initialData);
  const [channel, setChannel] = useState<"stable" | "beta">("stable");
  const [osTab, setOsTab] = useState<DetectedOs>("macos");
  const [selectedArch, setSelectedArch] = useState<DetectedArch>("aarch64");
  const [showAll, setShowAll] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const userOverrodeSelectionRef = useRef(false);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const syncPlatform = detectPlatformSync();
    setOsTab(syncPlatform.os);
    setSelectedArch(syncPlatform.arch);

    detectPlatformAsync().then((asyncPlatform) => {
      if (cancelled) return;
      if (!userOverrodeSelectionRef.current) {
        setOsTab(asyncPlatform.os);
        setSelectedArch(asyncPlatform.arch);
      }
    });

    const syncFromHash = () => {
      const hash = window.location.hash;
      if (hash === "#direct-installers" || hash === "#all-downloads") {
        setShowAll(true);
        const targetId =
          hash === "#direct-installers" ? "direct-installers" : "all-download-options";
        window.requestAnimationFrame(() => {
          document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);

    refreshLatestReleases(initialData).then((fresh) => {
      if (!cancelled) {
        setData(fresh);
      }
    });

    return () => {
      cancelled = true;
      window.removeEventListener("hashchange", syncFromHash);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, [initialData]);

  const activeRelease: NormalizedRelease | null =
    channel === "beta" && data.beta ? data.beta : (data.stable ?? data.beta);

  const copyCommand = async (id: string, cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCmd(id);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        setCopiedCmd(null);
        copyTimerRef.current = null;
      }, 1800);
    } catch {
      setCopiedCmd(null);
    }
  };

  const quickUnixCmd =
    channel === "beta"
      ? "curl -fsSL https://ruum-updates.jsonlee12138.com/install.sh | sh -s -- --channel beta"
      : "curl -fsSL https://ruum-updates.jsonlee12138.com/install.sh | sh";

  const artifacts = activeRelease ? activeRelease.downloads[osTab] : [];
  const primaryArtifact = pickRecommendedArtifact(artifacts, osTab, selectedArch);
  const siblingArtifacts = pickSiblingArtifacts(artifacts, primaryArtifact, selectedArch);
  const publishedDate = activeRelease?.publishedAt ? activeRelease.publishedAt.slice(0, 10) : "—";
  const osLabel = OS_LABELS[osTab];

  const archOptions: { arch: DetectedArch; label: string }[] =
    osTab === "macos"
      ? [
          { arch: "aarch64", label: copy.archAppleSilicon },
          { arch: "x86_64", label: copy.archIntel },
        ]
      : [
          { arch: "x86_64", label: copy.archX64 },
          { arch: "aarch64", label: copy.archArm64 },
        ];

  const activeArchLabel =
    archOptions.find((opt) => opt.arch === selectedArch)?.label ?? selectedArch;

  const matchedCommands: { id: string; title: string; cmd: string }[] =
    osTab === "macos"
      ? [
          { id: "hero-unix", title: "macOS · Desktop + CLI (curl)", cmd: quickUnixCmd },
          { id: "hero-brew", title: "macOS · Homebrew Cask", cmd: BREW_CMD },
        ]
      : osTab === "windows"
        ? [{ id: "hero-win", title: "Windows (PowerShell)", cmd: QUICK_WIN_CMD }]
        : [
            { id: "hero-unix", title: "Linux · Desktop + CLI (curl)", cmd: quickUnixCmd },
            { id: "hero-aur", title: "Arch / Omarchy Linux · AUR", cmd: AUR_CMD },
            { id: "hero-cli", title: "Headless Server (--cli-only)", cmd: QUICK_CLI_CMD },
          ];

  const activeNote =
    osTab === "macos"
      ? { title: copy.macosNoteTitle, body: copy.macosNoteBody }
      : osTab === "windows"
        ? { title: copy.windowsNoteTitle, body: copy.windowsNoteBody }
        : { title: copy.linuxNoteTitle, body: copy.linuxNoteBody };

  const renderCommandCard = (item: { id: string; title: string; cmd: string }) => (
    <div key={item.id} className="slab p-3.5 flex flex-col justify-between gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12.5px] font-semibold text-ink">{item.title}</span>
        <button
          type="button"
          onClick={() => copyCommand(item.id, item.cmd)}
          className="inline-flex items-center gap-1 rounded-[2px] border border-hairline bg-inset px-2 py-0.5 font-mono text-[11px] text-ink hover:border-strong cursor-pointer shrink-0"
        >
          {copiedCmd === item.id ? (
            <Check className="h-3 w-3 text-amber" aria-hidden="true" />
          ) : (
            <Copy className="h-3 w-3" aria-hidden="true" />
          )}
          <span>{copiedCmd === item.id ? copy.copiedBtn : copy.copyBtn}</span>
        </button>
      </div>
      <code className="block max-w-full rounded-[2px] border border-hairline bg-inset/70 px-2.5 py-2 font-mono text-[11.5px] text-ink overflow-x-auto whitespace-nowrap ruum-scroll">
        {item.cmd}
      </code>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Top Release Selector Bar */}
      <div className="slab p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="inline-flex rounded-[2px] border border-hairline bg-inset p-0.5">
            <button
              type="button"
              onClick={() => setChannel("stable")}
              className={`px-3 py-1.5 text-[12.5px] font-medium rounded-[1px] cursor-pointer transition-colors ${
                channel === "stable"
                  ? "bg-surface text-ink border border-strong"
                  : "text-ink-muted border border-transparent"
              }`}
            >
              {copy.channelStable}
            </button>
            {data.beta && (
              <button
                type="button"
                onClick={() => setChannel("beta")}
                className={`px-3 py-1.5 text-[12.5px] font-medium rounded-[1px] cursor-pointer transition-colors ${
                  channel === "beta"
                    ? "bg-surface text-amber border border-strong"
                    : "text-ink-muted border border-transparent"
                }`}
              >
                {copy.channelBeta}
              </button>
            )}
          </div>

          {activeRelease && (
            <div className="flex flex-wrap items-center gap-3 text-[12.5px] font-mono">
              <span className="text-ink-muted">
                {copy.latestTagLabel}: <strong className="text-ink">{activeRelease.tag}</strong>
              </span>
              <span className="text-ink-muted">·</span>
              <span className="text-ink-muted tabular-nums">
                {copy.publishedLabel}: {publishedDate}
              </span>
            </div>
          )}
        </div>

        {activeRelease && (
          <a
            href={activeRelease.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[12px] text-amber no-underline hover:underline"
          >
            <span>{copy.allReleasesLink}</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
      </div>

      {/* Hero Recommended Download Slab */}
      <section
        className="slab overflow-hidden"
        aria-label={`${copy.recommendedForPrefix} ${osLabel}`}
      >
        <div className="border-b border-hairline bg-inset/60 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[13px] font-semibold text-ink">{osLabel}</span>
            {activeRelease && (
              <>
                <span className="text-ink-muted">·</span>
                <span className="font-mono text-[11.5px] text-ink-muted">{activeRelease.tag}</span>
              </>
            )}
          </div>

          <div
            role="group"
            aria-label={copy.archLabel}
            className="inline-flex flex-wrap rounded-[2px] border border-hairline bg-surface p-0.5"
          >
            {archOptions.map((opt) => {
              const isSelected = selectedArch === opt.arch;
              return (
                <button
                  key={opt.arch}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    userOverrodeSelectionRef.current = true;
                    setSelectedArch(opt.arch);
                  }}
                  className={`inline-flex items-center px-2.5 py-1 text-[12px] font-medium rounded-[1px] cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-inset text-ink font-semibold border border-strong"
                      : "text-ink-muted hover:text-ink border border-transparent"
                  }`}
                >
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 sm:p-6 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          {/* Left column: Primary Direct Download & Sibling Formats */}
          <div className="space-y-4 min-w-0">
            <div className="space-y-1">
              <h2 className="text-[20px] sm:text-[22px] font-bold tracking-tight text-ink m-0">
                {copy.recommendedForPrefix} {osLabel}
              </h2>
              <p className="font-mono text-[12px] text-ink-secondary m-0">{activeArchLabel}</p>
            </div>

            {primaryArtifact && (
              <div className="space-y-2.5">
                <a
                  href={primaryArtifact.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-5 py-3 text-[14px] no-underline w-full sm:w-auto justify-between sm:justify-start"
                >
                  <span className="inline-flex items-center gap-2">
                    <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>
                      {copy.downloadBtn} · {primaryArtifact.label}
                    </span>
                  </span>
                  <span className="font-mono text-[12px] opacity-85 tabular-nums">
                    {formatBytes(primaryArtifact.size)}
                  </span>
                </a>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11.5px] text-ink-muted">
                  <span className="break-all">{primaryArtifact.filename}</span>
                  {primaryArtifact.sha256Url && (
                    <a
                      href={primaryArtifact.sha256Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink-secondary hover:text-amber no-underline shrink-0"
                    >
                      .sha256 ↗
                    </a>
                  )}
                </div>
              </div>
            )}

            {siblingArtifacts.length > 0 && (
              <div className="pt-1 space-y-2">
                <div className="text-[12px] font-medium text-ink-secondary">
                  {copy.otherFormatsLabel}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {siblingArtifacts.map((art) => (
                    <a
                      key={art.filename}
                      href={art.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary px-2.5 py-1 text-[12px] no-underline"
                    >
                      <Download className="h-3 w-3 text-ink-muted shrink-0" aria-hidden="true" />
                      <span>{art.format}</span>
                      <span className="font-mono text-[11px] text-ink-muted tabular-nums">
                        {formatBytes(art.size)}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column: Matched Quick Install Commands */}
          <div className="space-y-2.5 min-w-0">
            <h3 className="text-[14px] font-bold tracking-tight text-ink m-0">
              {copy.matchedCommandHeading}
            </h3>
            <div className="space-y-2.5">{matchedCommands.map(renderCommandCard)}</div>
          </div>
        </div>

        {/* Footer strip: Single Matched OS Setup Note */}
        <div className="border-t border-hairline bg-inset/40 px-5 py-3.5 text-[12.5px] leading-relaxed text-ink-secondary">
          <div className="font-semibold text-ink mb-0.5">{activeNote.title}</div>
          <p className="m-0">{renderInlineMarkdown(activeNote.body)}</p>
        </div>
      </section>

      {/* Progressive Disclosure Toggle Bar */}
      <button
        type="button"
        aria-expanded={showAll}
        aria-controls="all-download-options"
        onClick={() => setShowAll((v) => !v)}
        className="slab w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:border-strong hover:bg-inset/40 transition-colors cursor-pointer"
      >
        <div className="min-w-0 space-y-0.5">
          <div className="text-[14px] font-semibold text-ink">
            {showAll ? copy.hideAllOptions : copy.showAllOptions}
          </div>
          <div className="font-mono text-[11.5px] text-ink-muted">{copy.otherPlatformsHint}</div>
        </div>
        {showAll ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-ink-secondary" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-ink-secondary" aria-hidden="true" />
        )}
      </button>

      {/* Expanded Full Matrix */}
      {showAll && (
        <div id="all-download-options" className="scroll-mt-16 space-y-10">
          {/* One-line installers */}
          <section className="space-y-3">
            <h2 className="text-[18px] font-bold tracking-tight text-ink m-0">
              {copy.quickInstallHeading}
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { id: "unix", title: "macOS & Linux (Desktop + CLI)", cmd: quickUnixCmd },
                { id: "cli", title: "Headless Server (--cli-only)", cmd: QUICK_CLI_CMD },
                { id: "win", title: "Windows (PowerShell)", cmd: QUICK_WIN_CMD },
              ].map(renderCommandCard)}
            </div>
          </section>

          {/* Package managers */}
          <section className="space-y-3">
            <h2 className="text-[18px] font-bold tracking-tight text-ink m-0">
              {copy.packageManagersHeading}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                {
                  id: "brew",
                  label: "macOS · Homebrew Cask",
                  cmd: BREW_CMD,
                },
                {
                  id: "aur",
                  label: "Arch / Omarchy Linux · AUR",
                  cmd: AUR_CMD,
                },
              ].map((pm) => (
                <div key={pm.id} className="slab p-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-semibold text-ink-secondary mb-1">
                      {pm.label}
                    </div>
                    <code className="block max-w-full font-mono text-[12px] text-ink overflow-x-auto whitespace-nowrap ruum-scroll">
                      {pm.cmd}
                    </code>
                  </div>
                  <button
                    type="button"
                    aria-label={copiedCmd === pm.id ? copy.copiedBtn : copy.copyBtn}
                    onClick={() => copyCommand(pm.id, pm.cmd)}
                    className="btn-secondary px-2.5 py-1.5 text-[11.5px] shrink-0"
                  >
                    {copiedCmd === pm.id ? (
                      <Check className="h-3.5 w-3.5 text-amber" aria-hidden="true" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Direct Installers Table */}
          <section id="direct-installers" className="scroll-mt-16 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[18px] font-bold tracking-tight text-ink m-0">
                {copy.directArtifactsHeading}
              </h2>

              <div className="inline-flex rounded-[2px] border border-hairline bg-surface p-0.5">
                {(["macos", "linux", "windows"] as const).map((os) => (
                  <button
                    key={os}
                    type="button"
                    onClick={() => {
                      userOverrodeSelectionRef.current = true;
                      setOsTab(os);
                    }}
                    className={`inline-flex items-center px-3 py-1 text-[12.5px] font-medium rounded-[1px] cursor-pointer transition-colors ${
                      osTab === os
                        ? "bg-inset text-ink font-semibold"
                        : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    <span>{OS_LABELS[os]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="slab overflow-x-auto ruum-scroll">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-hairline bg-inset/60 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                    <th className="py-2.5 px-4 font-medium">{copy.formatLabel}</th>
                    <th className="py-2.5 px-4 font-medium">{copy.archLabel}</th>
                    <th className="py-2.5 px-4 font-medium">{copy.sizeLabel}</th>
                    <th className="py-2.5 px-4 font-medium">{copy.checksumLabel}</th>
                    <th className="py-2.5 px-4 font-medium text-right">{copy.downloadBtn}</th>
                  </tr>
                </thead>
                <tbody>
                  {artifacts.map((art) => (
                    <tr
                      key={art.filename}
                      className="border-b border-hairline last:border-b-0 hover:bg-inset/30"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-ink">{art.label}</div>
                        <div className="font-mono text-[11.5px] text-ink-muted">{art.filename}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[12px] text-ink-secondary">
                        {art.arch}
                      </td>
                      <td className="py-3 px-4 font-mono text-[12px] text-ink-secondary tabular-nums">
                        {formatBytes(art.size)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[12px]">
                        {art.sha256Url ? (
                          <a
                            href={art.sha256Url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ink-secondary hover:text-amber no-underline"
                          >
                            .sha256 ↗
                          </a>
                        ) : (
                          <span className="text-ink-muted">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={art.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary px-3 py-1.5 text-[12px] no-underline"
                        >
                          <Download className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{copy.downloadBtn}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Verification & Platform Notes */}
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="slab p-5 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber" aria-hidden="true" />
                <h3 className="text-[15px] font-bold text-ink m-0">{copy.verifyHeading}</h3>
              </div>
              <p className="text-[13px] text-ink-secondary m-0">{copy.verifySubtitle}</p>
              <pre className="m-0 rounded-[2px] border border-hairline bg-inset/75 p-3 font-mono text-[11.5px] leading-relaxed text-ink overflow-x-auto ruum-scroll">
                {`sha256sum -c SHA256SUMS --ignore-missing
gh attestation verify <downloaded-artifact> --repo JsonLee12138/Ruum`}
              </pre>
              {activeRelease?.sha256sumsUrl && (
                <a
                  href={activeRelease.sha256sumsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-mono text-[12px] text-amber no-underline hover:underline"
                >
                  Download SHA256SUMS ({activeRelease.tag}) ↗
                </a>
              )}
            </section>

            <section className="slab p-5 space-y-3">
              <h3 className="text-[15px] font-bold text-ink m-0">{copy.platformNotesHeading}</h3>
              <div className="space-y-2.5 text-[12.5px] leading-relaxed text-ink-secondary">
                <div>
                  <div className="font-semibold text-ink">{copy.macosNoteTitle}</div>
                  <p className="m-0">{renderInlineMarkdown(copy.macosNoteBody)}</p>
                </div>
                <div>
                  <div className="font-semibold text-ink">{copy.windowsNoteTitle}</div>
                  <p className="m-0">{renderInlineMarkdown(copy.windowsNoteBody)}</p>
                </div>
                <div>
                  <div className="font-semibold text-ink">{copy.linuxNoteTitle}</div>
                  <p className="m-0">{renderInlineMarkdown(copy.linuxNoteBody)}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
