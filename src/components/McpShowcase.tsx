import { useState } from "react";
import { Check, Copy, ShieldCheck, Lock } from "lucide-react";
import type { SiteCopy } from "../i18n";

interface McpShowcaseProps {
  copy: SiteCopy["capabilities"]["aiMcp"];
}

interface McpToolRow {
  name: string;
  scope: string;
  guard: string;
  mutating?: boolean;
}

const MCP_TOOLS: McpToolRow[] = [
  { name: "list_volumes", scope: "Local / SSH", guard: "Read-only mount probe; zero file walk" },
  { name: "scan_directory", scope: "Local / SSH", guard: "Read-only scan; cached in session" },
  {
    name: "inspect_subtree",
    scope: "Local / SSH",
    guard: "Read-only tree lookup & substring search",
  },
  {
    name: "find_reclaimable",
    scope: "Local / SSH",
    guard: "Heuristics: caches, build dirs, stale worktrees",
  },
  {
    name: "check_git_safety",
    scope: "Local only",
    guard: "Hook-free Git status; rejects ssh_host",
  },
  {
    name: "plan_removal",
    scope: "Local / SSH",
    guard: "Dry-run against safety guards; never deletes",
  },
  {
    name: "trash_paths",
    scope: "Local / SSH",
    guard: "GUI Confirm Cleanup checkbox approval required",
    mutating: true,
  },
  {
    name: "delete_permanently",
    scope: "Local only",
    guard: "GUI approval + OS native auth (Touch ID)",
    mutating: true,
  },
];

const STANDARD_JSON = `{
  "mcpServers": {
    "ruum": {
      "command": "ruum",
      "args": ["mcp"]
    }
  }
}`;

const READONLY_JSON = `{
  "mcpServers": {
    "ruum": {
      "command": "ruum",
      "args": ["mcp", "--read-only"]
    }
  }
}`;

export default function McpShowcase({ copy }: McpShowcaseProps) {
  const [readOnly, setReadOnly] = useState(false);
  const [copied, setCopied] = useState(false);

  const snippet = readOnly ? READONLY_JSON : STANDARD_JSON;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.25fr]">
      {/* JSON Config Card */}
      <div className="border border-hairline bg-inset/70 rounded-[2px] flex flex-col min-w-0 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline px-3 py-2">
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={() => setReadOnly(false)}
              className={`px-2 py-1 text-[11px] font-mono rounded-[2px] cursor-pointer transition-colors ${
                !readOnly
                  ? "bg-surface text-ink border border-strong font-medium"
                  : "text-ink-muted hover:text-ink border border-transparent"
              }`}
            >
              {copy.modeStandard}
            </button>
            <button
              type="button"
              onClick={() => setReadOnly(true)}
              className={`px-2 py-1 text-[11px] font-mono rounded-[2px] cursor-pointer transition-colors ${
                readOnly
                  ? "bg-surface text-ink border border-strong font-medium"
                  : "text-ink-muted hover:text-ink border border-transparent"
              }`}
            >
              {copy.modeReadOnly}
            </button>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono text-ink-secondary hover:text-amber bg-surface border border-hairline rounded-[2px] cursor-pointer transition-colors"
          >
            {copied ? <Check className="h-3 w-3 text-amber" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? copy.copiedJson : copy.copyJson}</span>
          </button>
        </div>

        <pre className="p-3.5 font-mono text-[12px] leading-relaxed text-ink overflow-x-auto ruum-scroll m-0 flex-1">
          <code>{snippet}</code>
        </pre>

        <div className="border-t border-hairline px-3 py-2 flex items-center justify-between text-[11px] font-mono text-ink-muted bg-surface/60">
          <span>Headless stdio MCP · zero GUI startup</span>
          <span className="inline-flex items-center gap-1 text-amber">
            <ShieldCheck className="h-3.5 w-3.5" />
            Human-gated
          </span>
        </div>
      </div>

      {/* 8-tool Matrix */}
      <div className="border border-hairline bg-surface rounded-[2px] overflow-hidden min-w-0">
        <div className="flex items-center justify-between border-b border-hairline bg-inset/50 px-3 py-2">
          <span className="font-mono text-[11px] font-medium text-ink-secondary uppercase tracking-wider">
            {copy.toolsHeading} (8)
          </span>
          <span className="font-mono text-[11px] text-ink-muted">ruum mcp</span>
        </div>

        <div className="overflow-x-auto ruum-scroll">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-hairline text-[11px] font-mono text-ink-muted bg-inset/30">
                <th className="py-1.5 px-3 font-medium">{copy.toolCol}</th>
                <th className="py-1.5 px-2.5 font-medium">{copy.scopeCol}</th>
                <th className="py-1.5 px-3 font-medium">{copy.guardCol}</th>
              </tr>
            </thead>
            <tbody>
              {MCP_TOOLS.map((tool) => {
                const disabledInReadOnly = readOnly && tool.mutating;
                return (
                  <tr
                    key={tool.name}
                    className={`border-b border-hairline last:border-b-0 transition-opacity ${
                      disabledInReadOnly ? "opacity-40 line-through" : ""
                    }`}
                  >
                    <td className="py-1.5 px-3 font-mono text-[11.5px] font-medium text-ink whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        {tool.mutating ? (
                          <Lock className="h-3 w-3 text-amber shrink-0" aria-hidden="true" />
                        ) : (
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-ink-muted/60 shrink-0"
                            aria-hidden="true"
                          />
                        )}
                        {tool.name}
                      </span>
                    </td>
                    <td className="py-1.5 px-2.5 font-mono text-[11px] text-ink-secondary whitespace-nowrap">
                      {tool.scope}
                    </td>
                    <td className="py-1.5 px-3 text-[11.5px] text-ink-secondary">{tool.guard}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
