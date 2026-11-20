import { useEffect, useState } from "react";
import { Check, Copy, Download, ExternalLink, ShieldCheck } from "lucide-react";
import type { SiteCopy } from "../i18n";
import { renderInlineMarkdown } from "../lib/inline-markdown";
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

type OsTab = "macos" | "linux" | "windows";

export default function DownloadCenter({ copy, initialData }: DownloadCenterProps) {
  const [data, setData] = useState<ReleasesPayload>(initialData);
  const [channel, setChannel] = useState<"stable" | "beta">("stable");
  const [osTab, setOsTab] = useState<OsTab>("macos");
  const [detectedOs, setDetectedOs] = useState<OsTab>("macos");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const detected: OsTab = ua.includes("win") ? "windows" : ua.includes("mac") ? "macos" : "linux";
    setDetectedOs(detected);
    setOsTab(detected);

    refreshLatestReleases(initialData).then((fresh) => {
      setData(fresh);
    });
  }, [initialData]);

  const activeRelease: NormalizedRelease | null =
    channel === "beta" && data.beta ? data.beta : (data.stable ?? data.beta);

  const copyCommand = async (id: string, cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCmd(id);
      window.setTimeout(() => setCopiedCmd(null), 1800);
    } catch {
      setCopiedCmd(null);
    }
  };

  const quickUnixCmd =
    channel === "beta"
      ? "curl -fsSL https://ruum-updates.jsonlee12138.com/install.sh | sh -s -- --channel beta"
      : "curl -fsSL https://ruum-updates.jsonlee12138.com/install.sh | sh";
  const quickCliCmd =
    "curl -fsSL https://ruum-updates.jsonlee12138.com/install.sh | sh -s -- --cli-only";
  const quickWinCmd = "irm https://ruum-updates.jsonlee12138.com/install.ps1 | iex";

  const artifacts = activeRelease ? activeRelease.downloads[osTab] : [];
  const publishedDate = activeRelease?.publishedAt ? activeRelease.publishedAt.slice(0, 10) : "—";

  return (
    <div className="space-y-10">
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
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* One-line installers */}
      <section className="space-y-3">
        <h2 className="text-[18px] font-bold tracking-tight text-ink m-0">
          {copy.quickInstallHeading}
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { id: "unix", title: "macOS & Linux (Desktop + CLI)", cmd: quickUnixCmd },
            { id: "cli", title: "Headless Server (--cli-only)", cmd: quickCliCmd },
            { id: "win", title: "Windows (PowerShell)", cmd: quickWinCmd },
          ].map((item) => (
            <div key={item.id} className="slab p-3.5 flex flex-col justify-between gap-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12.5px] font-semibold text-ink">{item.title}</span>
                <button
                  type="button"
                  onClick={() => copyCommand(item.id, item.cmd)}
                  className="inline-flex items-center gap-1 rounded-[2px] border border-hairline bg-inset px-2 py-0.5 font-mono text-[11px] text-ink hover:border-strong cursor-pointer"
                >
                  {copiedCmd === item.id ? (
                    <Check className="h-3 w-3 text-amber" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>{copiedCmd === item.id ? copy.copiedBtn : copy.copyBtn}</span>
                </button>
              </div>
              <code className="block max-w-full rounded-[2px] border border-hairline bg-inset/70 px-2.5 py-2 font-mono text-[11.5px] text-ink overflow-x-auto whitespace-nowrap ruum-scroll">
                {item.cmd}
              </code>
            </div>
          ))}
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
              cmd: "brew tap JsonLee12138/tap && brew install --cask ruum",
            },
            {
              id: "aur",
              label: "Arch / Omarchy Linux · AUR",
              cmd: "yay -S ruum-bin",
            },
          ].map((pm) => (
            <div key={pm.id} className="slab p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-semibold text-ink-secondary mb-1">{pm.label}</div>
                <code className="block max-w-full font-mono text-[12px] text-ink overflow-x-auto whitespace-nowrap ruum-scroll">
                  {pm.cmd}
                </code>
              </div>
              <button
                type="button"
                onClick={() => copyCommand(pm.id, pm.cmd)}
                className="btn-secondary px-2.5 py-1.5 text-[11.5px] shrink-0"
              >
                {copiedCmd === pm.id ? (
                  <Check className="h-3.5 w-3.5 text-amber" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Installers Table */}
      <section id="direct-installers" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[18px] font-bold tracking-tight text-ink m-0">
            {copy.directArtifactsHeading}
          </h2>

          <div className="inline-flex rounded-[2px] border border-hairline bg-surface p-0.5">
            {(["macos", "linux", "windows"] as const).map((os) => (
              <button
                key={os}
                type="button"
                onClick={() => setOsTab(os)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-[12.5px] font-medium rounded-[1px] cursor-pointer transition-colors ${
                  osTab === os ? "bg-inset text-ink font-semibold" : "text-ink-muted hover:text-ink"
                }`}
              >
                <span>{os === "macos" ? "macOS" : os === "linux" ? "Linux" : "Windows"}</span>
                {detectedOs === os && (
                  <span className="hidden sm:inline rounded-[1px] bg-amber-soft px-1 text-[10px] font-mono text-amber">
                    {copy.recommendedBadge}
                  </span>
                )}
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
                  <td className="py-3 px-4 font-mono text-[12px] text-ink-secondary">{art.arch}</td>
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
                      <Download className="h-3.5 w-3.5" />
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
            <ShieldCheck className="h-4 w-4 text-amber" />
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
  );
}
