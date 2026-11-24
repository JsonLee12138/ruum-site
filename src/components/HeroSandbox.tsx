import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  Camera,
  Check,
  CheckCircle2,
  Container,
  Copy,
  Eye,
  HardDrive,
  LayoutGrid,
  Lock,
  Network,
  Play,
  RefreshCw,
  RotateCcw,
  ScanSearch,
  ShieldAlert,
  Sparkles,
  Trash2,
} from "lucide-react";
import scanMonolithAnim from "../data/lottie/scan-monolith.json";
import watchdogPulseAnim from "../data/lottie/watchdog-pulse.json";
import type { SiteCopy } from "../i18n";
import LottiePulse from "./LottiePulse";

type WorkspaceView = "explore" | "docker" | "ssh" | "watchdog";
type ExploreMode = "size" | "age";
type DisplayMode = "demo" | "screenshot";

interface TileItem {
  id: string;
  name: string;
  path: string;
  sizeGiB: number;
  pct: string;
  files: string;
  lastWrite: string;
  ageIndex: 0 | 1 | 2 | 3 | 4;
  kindKey: string;
  categoryVar: string;
  accentVar: string;
  reclaimable: boolean;
  gitStatus: string;
  worthNote?: string;
}

const TILES: TileItem[] = [
  {
    id: "orbstack",
    name: "OrbStack / Docker",
    path: "~/Library/Group Containers/dev.orbstack",
    sizeGiB: 19.0,
    pct: "7.2%",
    files: "12,480",
    lastWrite: "2h ago",
    ageIndex: 0,
    kindKey: "Container",
    categoryVar: "var(--cat-container)",
    accentVar: "var(--cat-container-accent)",
    reclaimable: true,
    gitStatus: "Not a repository",
    worthNote: "VM images & build cache",
  },
  {
    id: "caches",
    name: "Library/Caches",
    path: "~/Library/Caches",
    sizeGiB: 15.0,
    pct: "5.7%",
    files: "184,920",
    lastWrite: "11m ago",
    ageIndex: 0,
    kindKey: "Cache",
    categoryVar: "var(--cat-cache)",
    accentVar: "var(--cat-cache-accent)",
    reclaimable: true,
    gitStatus: "Not a repository",
    worthNote: "Rebuildable caches",
  },
  {
    id: "pnpm",
    name: "Library/pnpm",
    path: "~/Library/pnpm/store",
    sizeGiB: 13.0,
    pct: "4.9%",
    files: "412,110",
    lastWrite: "3d ago",
    ageIndex: 1,
    kindKey: "Toolchain",
    categoryVar: "var(--cat-toolchain)",
    accentVar: "var(--cat-toolchain-accent)",
    reclaimable: true,
    gitStatus: "Not a repository",
    worthNote: "Package store",
  },
  {
    id: "app-support",
    name: "Application Support",
    path: "~/Library/Application Support",
    sizeGiB: 36.0,
    pct: "13.7%",
    files: "502,310",
    lastWrite: "1d ago",
    ageIndex: 1,
    kindKey: "Cache",
    categoryVar: "var(--cat-cache)",
    accentVar: "var(--cat-cache-accent)",
    reclaimable: false,
    gitStatus: "Not a repository",
  },
  {
    id: "projects-src",
    name: "Projects / src",
    path: "~/Projects",
    sizeGiB: 37.8,
    pct: "14.4%",
    files: "98,420",
    lastWrite: "15m ago",
    ageIndex: 0,
    kindKey: "Code",
    categoryVar: "var(--cat-code)",
    accentVar: "var(--cat-code-accent)",
    reclaimable: false,
    gitStatus: "Clean · 12 repos tracked",
  },
  {
    id: "ruum-target",
    name: "Ruum/target",
    path: "~/Projects/Ruum/target",
    sizeGiB: 8.4,
    pct: "3.2%",
    files: "64,210",
    lastWrite: "40m ago",
    ageIndex: 0,
    kindKey: "Code",
    categoryVar: "var(--cat-code)",
    accentVar: "var(--cat-code-accent)",
    reclaimable: true,
    gitStatus: "Ignored by .gitignore",
    worthNote: "Rust build artifacts",
  },
  {
    id: "worktrees",
    name: "routeyard/worktrees",
    path: "~/Projects/routeyard/worktrees",
    sizeGiB: 6.2,
    pct: "2.4%",
    files: "39,140",
    lastWrite: "16d ago",
    ageIndex: 2,
    kindKey: "Agent scratch",
    categoryVar: "var(--cat-agent)",
    accentVar: "var(--cat-agent-accent)",
    reclaimable: true,
    gitStatus: "2 stale worktrees · clean",
    worthNote: "16d untouched",
  },
  {
    id: "node-modules",
    name: "xai/node_modules",
    path: "~/Projects/xai/node_modules",
    sizeGiB: 1.6,
    pct: "0.6%",
    files: "82,600",
    lastWrite: "24d ago",
    ageIndex: 2,
    kindKey: "Code",
    categoryVar: "var(--cat-code)",
    accentVar: "var(--cat-code-accent)",
    reclaimable: true,
    gitStatus: "Ignored by .gitignore",
    worthNote: "Reinstallable deps",
  },
  {
    id: "gemini",
    name: ".gemini / .codex",
    path: "~/.gemini/antigravity",
    sizeGiB: 18.9,
    pct: "7.2%",
    files: "24,800",
    lastWrite: "5m ago",
    ageIndex: 0,
    kindKey: "Agent scratch",
    categoryVar: "var(--cat-agent)",
    accentVar: "var(--cat-agent-accent)",
    reclaimable: true,
    gitStatus: "Not a repository",
    worthNote: "Agent scratch & logs",
  },
  {
    id: "go-rustup",
    name: "go / .rustup / .nvm",
    path: "~/go/pkg/mod",
    sizeGiB: 15.5,
    pct: "5.9%",
    files: "310,900",
    lastWrite: "90d ago",
    ageIndex: 3,
    kindKey: "Toolchain",
    categoryVar: "var(--cat-toolchain)",
    accentVar: "var(--cat-toolchain-accent)",
    reclaimable: true,
    gitStatus: "Not a repository",
  },
  {
    id: "documents",
    name: "Documents & Media",
    path: "~/Documents",
    sizeGiB: 21.0,
    pct: "8.0%",
    files: "18,220",
    lastWrite: "190d ago",
    ageIndex: 4,
    kindKey: "Documents",
    categoryVar: "var(--cat-docs)",
    accentVar: "var(--cat-docs-accent)",
    reclaimable: false,
    gitStatus: "Not a repository",
  },
];

interface DockerCandidate {
  id: string;
  kind: "image" | "container" | "cache";
  name: string;
  meta: string;
  sizeGiB: number;
}

const DOCKER_DATA: Record<
  "local" | "ssh",
  {
    imagesTotal: number;
    imagesActive: number;
    imagesReclaim: number;
    containersTotal: number;
    containersActive: number;
    containersReclaim: number;
    cacheTotal: number;
    cacheReclaim: number;
    cacheShared: number;
    volumesTotal: number;
    volumesActive: number;
    volumesSize: number;
    candidates: DockerCandidate[];
  }
> = {
  local: {
    imagesTotal: 18,
    imagesActive: 5,
    imagesReclaim: 9.4,
    containersTotal: 7,
    containersActive: 3,
    containersReclaim: 1.8,
    cacheTotal: 14.2,
    cacheReclaim: 8.6,
    cacheShared: 5.6,
    volumesTotal: 11,
    volumesActive: 6,
    volumesSize: 16.4,
    candidates: [
      {
        id: "dc-cache",
        kind: "cache",
        name: "BuildKit cache layers",
        meta: "8.6 GiB reclaimable · 5.6 GiB shared",
        sizeGiB: 8.6,
      },
      {
        id: "dc-img-1",
        kind: "image",
        name: "ghcr.io/rust-musl:builder (dangling)",
        meta: "Unused · created 3 weeks ago",
        sizeGiB: 5.8,
      },
      {
        id: "dc-img-2",
        kind: "image",
        name: "node:22-bookworm-old",
        meta: "Unused · 0 active containers",
        sizeGiB: 3.6,
      },
      {
        id: "dc-ctr-1",
        kind: "container",
        name: "pg-migration-tmp (exited 14d)",
        meta: "Stopped container layer",
        sizeGiB: 1.8,
      },
    ],
  },
  ssh: {
    imagesTotal: 42,
    imagesActive: 11,
    imagesReclaim: 24.5,
    containersTotal: 19,
    containersActive: 9,
    containersReclaim: 4.1,
    cacheTotal: 31.0,
    cacheReclaim: 21.8,
    cacheShared: 9.2,
    volumesTotal: 16,
    volumesActive: 12,
    volumesSize: 88.0,
    candidates: [
      {
        id: "ssh-dc-cache",
        kind: "cache",
        name: "Remote BuildKit cache (prod-eu-01)",
        meta: "21.8 GiB reclaimable · 9.2 GiB shared",
        sizeGiB: 21.8,
      },
      {
        id: "ssh-dc-img",
        kind: "image",
        name: "api-gateway:2026.10.2 (unused)",
        meta: "Superseded release tag",
        sizeGiB: 16.4,
      },
      {
        id: "ssh-dc-ctr",
        kind: "container",
        name: "ci-runner-ephemeral-09 (exited)",
        meta: "Stopped container writable layer",
        sizeGiB: 4.1,
      },
    ],
  },
};

interface SshTarget {
  id: string;
  path: string;
  sizeGiB: number;
  kind: string;
}

const SSH_TARGETS: SshTarget[] = [
  { id: "ssh-1", path: "/var/lib/docker/buildkit/cache", sizeGiB: 21.8, kind: "Build Cache" },
  { id: "ssh-2", path: "/srv/builds/stale-artifacts", sizeGiB: 14.3, kind: "Build Artifacts" },
  { id: "ssh-3", path: "/var/log/journal/archived", sizeGiB: 8.6, kind: "Rotated Logs" },
];

interface AiProposalItem {
  id: string;
  path: string;
  sizeGiB: number;
  reason: string;
  gitFlag?: boolean;
}

const AI_PROPOSALS: AiProposalItem[] = [
  {
    id: "ai-1",
    path: "~/Library/Caches/Homebrew",
    sizeGiB: 4.3,
    reason: "Cached bottle archives; safe to rebuild",
  },
  {
    id: "ai-2",
    path: "~/Projects/Ruum/target",
    sizeGiB: 8.4,
    reason: "Cargo incremental & debug artifacts",
  },
  {
    id: "ai-3",
    path: "~/Projects/routeyard/worktrees",
    sizeGiB: 6.2,
    reason: "Stale worktrees untouched 16 days",
    gitFlag: true,
  },
  {
    id: "ai-4",
    path: "~/Library/pnpm/store/v10",
    sizeGiB: 11.2,
    reason: "Hardlink-safe orphaned store tarballs",
  },
];

interface HeroSandboxProps {
  copy: SiteCopy["sandbox"];
}

export default function HeroSandbox({ copy }: HeroSandboxProps) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("demo");
  const [view, setView] = useState<WorkspaceView>("explore");
  const [exploreMode, setExploreMode] = useState<ExploreMode>("size");
  const [selectedTileId, setSelectedTileId] = useState<string>("caches");
  const [markedIds, setMarkedIds] = useState<string[]>(["caches", "ruum-target"]);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);
  const [scanningPulse, setScanningPulse] = useState(false);

  // Docker state
  const [dockerHost, setDockerHost] = useState<"local" | "ssh">("local");
  const [dockerSelected, setDockerSelected] = useState<string[]>(["dc-cache", "dc-img-1"]);
  const [dockerCleaned, setDockerCleaned] = useState<string[]>([]);

  // Watchdog / AI state
  const [watchdogTab, setWatchdogTab] = useState<"proposal" | "mcp">("proposal");
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiChecked, setAiChecked] = useState<string[]>(["ai-1", "ai-2", "ai-4"]);
  const [aiConfirmed, setAiConfirmed] = useState(false);

  // SSH state
  const [sshSelected, setSshSelected] = useState<string[]>(["ssh-1", "ssh-2"]);
  const [sshCopied, setSshCopied] = useState(false);

  const tourActiveRef = useRef(false);

  const selectedTile = useMemo(
    () => TILES.find((t) => t.id === selectedTileId) ?? TILES[0],
    [selectedTileId],
  );

  const markedTotalGiB = useMemo(
    () =>
      TILES.filter((t) => markedIds.includes(t.id) && !removedIds.includes(t.id)).reduce(
        (sum, t) => sum + t.sizeGiB,
        0,
      ),
    [markedIds, removedIds],
  );

  const removedTotalGiB = useMemo(
    () => TILES.filter((t) => removedIds.includes(t.id)).reduce((sum, t) => sum + t.sizeGiB, 0),
    [removedIds],
  );

  const baseFreeGiB = 54.0 + removedTotalGiB;
  const projectedFreeGiB = baseFreeGiB + markedTotalGiB;
  const totalDiskGiB = 460.0;

  const toggleMark = (id: string) => {
    setReviewDone(false);
    setMarkedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleCommitTrash = () => {
    setRemovedIds((prev) => [...new Set([...prev, ...markedIds])]);
    setMarkedIds([]);
    setReviewOpen(false);
    setReviewDone(true);
  };

  const handleResetDemo = () => {
    setRemovedIds([]);
    setMarkedIds(["caches", "ruum-target"]);
    setSelectedTileId("caches");
    setReviewOpen(false);
    setReviewDone(false);
    setDockerCleaned([]);
    setDockerSelected(dockerHost === "local" ? ["dc-cache", "dc-img-1"] : ["ssh-dc-cache"]);
    setAiChecked(["ai-1", "ai-2", "ai-4"]);
    setAiConfirmed(false);
  };

  const triggerRescan = () => {
    setScanningPulse(true);
    window.setTimeout(() => setScanningPulse(false), 1100);
  };

  const dockerDataset = DOCKER_DATA[dockerHost];
  const dockerSelectedGiB = dockerDataset.candidates
    .filter((c) => dockerSelected.includes(c.id) && !dockerCleaned.includes(c.id))
    .reduce((sum, c) => sum + c.sizeGiB, 0);

  const sshChosenTargets = SSH_TARGETS.filter((t) => sshSelected.includes(t.id));
  const generatedSshScript = useMemo(() => {
    const targets = sshChosenTargets.length > 0 ? sshChosenTargets : [SSH_TARGETS[0]];
    const lines = targets.map((t) => `  "${t.path}" \\`).join("\n");
    return `#!/usr/bin/env sh
# Generated by Ruum (read-only remote export)
EXPECTED_HOST="prod-eu-01"
EXPECTED_ID="9f4c82d1a04e..."
[ "$(hostname)" = "$EXPECTED_HOST" ] || exit 1
[ "$(cat /etc/machine-id)" = "$EXPECTED_ID" ] || exit 1
# Dry-run by default; pass --delete to execute
ruum-verify-clean "\${1:-preview}" \\
${lines}
  --guard-mounts`;
  }, [sshChosenTargets]);

  const handleCopySshScript = async () => {
    try {
      await navigator.clipboard.writeText(generatedSshScript);
      setSshCopied(true);
      window.setTimeout(() => setSshCopied(false), 1800);
    } catch {
      setSshCopied(false);
    }
  };

  const startGuidedTour = async () => {
    if (tourActiveRef.current) return;
    tourActiveRef.current = true;

    const { driver } = await import("driver.js");
    window.__lenis?.stop();

    flushSync(() => {
      setDisplayMode("demo");
      setView("explore");
    });

    const switchViewSync = (targetView: WorkspaceView) => {
      flushSync(() => {
        setDisplayMode("demo");
        setView(targetView);
      });
    };

    const tour = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      popoverClass: "ruum-driver-popover",
      stagePadding: 6,
      stageRadius: 3,
      nextBtnText: copy.tour.nextBtn,
      prevBtnText: copy.tour.prevBtn,
      doneBtnText: copy.tour.doneBtn,
      progressText: copy.tour.progressText,
      onDestroyed: () => {
        tourActiveRef.current = false;
        window.__lenis?.start();
      },
      steps: [
        {
          element: "#hero-install-bar",
          waitForElement: 600,
          popover: {
            title: copy.tour.steps.install.title,
            description: copy.tour.steps.install.description,
            side: "bottom",
            align: "start",
            onNextClick: () => {
              switchViewSync("explore");
              tour.moveNext();
            },
          },
        },
        {
          element: "#sandbox-treemap",
          waitForElement: 600,
          popover: {
            title: copy.tour.steps.explore.title,
            description: copy.tour.steps.explore.description,
            side: "bottom",
            align: "start",
            onNextClick: () => {
              switchViewSync("docker");
              tour.moveNext();
            },
          },
        },
        {
          element: "#sandbox-docker-volumes",
          waitForElement: 600,
          popover: {
            title: copy.tour.steps.docker.title,
            description: copy.tour.steps.docker.description,
            side: "top",
            align: "center",
            onPrevClick: () => {
              switchViewSync("explore");
              tour.movePrevious();
            },
            onNextClick: () => {
              switchViewSync("ssh");
              tour.moveNext();
            },
          },
        },
        {
          element: "#sandbox-ssh-script",
          waitForElement: 600,
          popover: {
            title: copy.tour.steps.ssh.title,
            description: copy.tour.steps.ssh.description,
            side: "top",
            align: "center",
            onPrevClick: () => {
              switchViewSync("docker");
              tour.movePrevious();
            },
            onNextClick: () => {
              switchViewSync("watchdog");
              tour.moveNext();
            },
          },
        },
        {
          element: "#sandbox-ai-proposal",
          waitForElement: 600,
          popover: {
            title: copy.tour.steps.watchdog.title,
            description: copy.tour.steps.watchdog.description,
            side: "top",
            align: "center",
            onPrevClick: () => {
              switchViewSync("ssh");
              tour.movePrevious();
            },
          },
        },
      ],
    });

    tour.drive(0);
  };

  const tourTriggerRef = useRef(startGuidedTour);
  tourTriggerRef.current = startGuidedTour;

  useEffect(() => {
    const handleExternalTour = () => {
      void tourTriggerRef.current();
    };
    window.addEventListener("ruum:start-tour", handleExternalTour);
    return () => window.removeEventListener("ruum:start-tour", handleExternalTour);
  }, []);

  const renderTileBlock = (tile: TileItem, compact = false) => {
    const isRemoved = removedIds.includes(tile.id);
    const isMarked = markedIds.includes(tile.id) && !isRemoved;
    const isSelected = selectedTileId === tile.id;
    const fill = exploreMode === "age" ? `var(--age-${tile.ageIndex})` : tile.categoryVar;

    return (
      <button
        key={tile.id}
        type="button"
        onClick={() => setSelectedTileId(tile.id)}
        style={{
          backgroundColor: isRemoved ? "var(--bg-inset)" : fill,
          borderColor: isSelected || isMarked ? "var(--accent-amber)" : "var(--border-hairline)",
          borderWidth: isSelected || isMarked ? "2px" : "1px",
        }}
        className={`group relative flex flex-col justify-between overflow-hidden rounded-[1px] border p-2 text-left transition-all cursor-pointer select-none ${
          isRemoved ? "opacity-45" : "hover:brightness-[0.98]"
        }`}
      >
        {tile.reclaimable && !isRemoved && (
          <span
            className="reclaim-hatch pointer-events-none absolute inset-0 opacity-90"
            aria-hidden="true"
          />
        )}

        <div className="relative z-10 flex items-start justify-between gap-1.5 w-full">
          <span
            className={`font-medium text-ink leading-tight truncate ${compact ? "text-[11px]" : "text-[12px]"}`}
          >
            {tile.name}
          </span>
          {isMarked && (
            <span className="shrink-0 rounded-[1px] bg-amber-fill px-1 py-[1px] font-mono text-[9px] font-semibold text-amber-on">
              ✓
            </span>
          )}
        </div>

        <div className="relative z-10 mt-1 flex items-baseline justify-between gap-1 w-full">
          <span
            className={`font-mono font-semibold text-ink tabular-nums ${compact ? "text-[10.5px]" : "text-[11.5px]"}`}
          >
            {isRemoved ? "0.0" : tile.sizeGiB.toFixed(1)} GiB
          </span>
          {!compact && tile.reclaimable && !isRemoved && (
            <span className="hidden sm:inline font-mono text-[9.5px] text-ink-secondary">
              {copy.explore.reclaimableBadge}
            </span>
          )}
        </div>
      </button>
    );
  };

  const worthList = TILES.filter((t) => t.worthNote);

  return (
    <div
      className="slab relative overflow-hidden"
      style={{ boxShadow: "var(--shadow-window)" }}
      aria-label={copy.windowTitle}
    >
      {/* Window Titlebar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline bg-rail px-3 py-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-strong/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-strong/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-strong/60" />
          </div>
          <span className="font-mono text-[11.5px] font-semibold text-ink">{copy.windowTitle}</span>
          {displayMode === "demo" && (
            <span className="badge-mono text-[10px]">{copy.demoDisclaimer}</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex rounded-[2px] border border-hairline bg-inset p-0.5"
            role="tablist"
            aria-label="Preview mode"
          >
            <button
              type="button"
              role="tab"
              aria-selected={displayMode === "demo"}
              onClick={() => setDisplayMode("demo")}
              className={`px-2 py-0.5 text-[11px] font-medium rounded-[1px] cursor-pointer transition-colors ${
                displayMode === "demo"
                  ? "bg-surface text-ink font-semibold"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {copy.demoModeLabel}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={displayMode === "screenshot"}
              onClick={() => setDisplayMode("screenshot")}
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-[1px] cursor-pointer transition-colors ${
                displayMode === "screenshot"
                  ? "bg-surface text-amber font-semibold"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <Camera className="h-3 w-3" aria-hidden="true" />
              <span>{copy.screenshotModeLabel}</span>
            </button>
          </div>

          {displayMode === "demo" && (
            <>
              <button
                type="button"
                onClick={triggerRescan}
                className="inline-flex items-center gap-1.5 rounded-[2px] border border-hairline bg-surface px-2 py-1 text-[11.5px] font-medium text-ink-secondary hover:border-strong hover:text-ink transition-colors cursor-pointer"
              >
                {scanningPulse ? (
                  <LottiePulse animationData={scanMonolithAnim} size={14} loop playing />
                ) : (
                  <RefreshCw className="h-3 w-3" aria-hidden="true" />
                )}
                <span>{copy.rescanButton}</span>
              </button>

              <button
                type="button"
                onClick={handleResetDemo}
                className="inline-flex items-center gap-1 rounded-[2px] border border-hairline bg-surface px-2 py-1 text-[11.5px] font-medium text-ink-secondary hover:border-strong hover:text-ink transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                <span className="hidden sm:inline">{copy.resetButton}</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => void startGuidedTour()}
            className="btn-primary px-2.5 py-1 text-[11.5px]"
          >
            <Play className="h-3 w-3 fill-current" aria-hidden="true" />
            <span>{copy.tourButton}</span>
          </button>
        </div>
      </div>

      <div
        className={displayMode === "screenshot" ? "bg-canvas" : "hidden"}
        aria-hidden={displayMode !== "screenshot" ? "true" : undefined}
      >
        <div className="border-b border-hairline bg-inset/40">
          <img
            src="/screenshot.png"
            alt={copy.screenshotAlt}
            width={1024}
            height={642}
            className="block w-full h-auto"
            loading="lazy"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 bg-surface px-4 py-2.5 text-[12px] text-ink-secondary">
          <span>{copy.screenshotCaption}</span>
          <button
            type="button"
            onClick={() => setDisplayMode("demo")}
            className="btn-secondary px-2.5 py-1 text-[11.5px] shrink-0"
          >
            {copy.demoModeLabel}
          </button>
        </div>
      </div>

      {displayMode === "demo" && (
        <div className="grid grid-cols-1 md:grid-cols-[88px_1fr] min-h-[470px] bg-canvas">
          {/* Rail (matches Ruum's Left Icon Rail: Explore, Docker, Remote, Watchdog) */}
          <aside
            className="flex md:flex-col items-center justify-around md:justify-start gap-1 border-b md:border-b-0 md:border-r border-hairline bg-rail p-1.5 md:py-3"
            aria-label="Workspace views"
          >
            {(
              [
                { key: "explore", icon: LayoutGrid, label: copy.rails.explore },
                { key: "docker", icon: Container, label: copy.rails.docker },
                { key: "ssh", icon: Network, label: copy.rails.ssh },
                { key: "watchdog", icon: Eye, label: copy.rails.watchdog },
              ] as const
            ).map(({ key, icon: Icon, label }) => {
              const active = view === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setView(key)}
                  title={label}
                  className={`flex md:w-full flex-row md:flex-col items-center justify-center gap-1 rounded-[2px] px-2 py-1.5 md:py-2 text-[10.5px] font-medium transition-colors cursor-pointer ${
                    active
                      ? "bg-surface text-amber border border-strong"
                      : "text-ink-muted hover:text-ink border border-transparent"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="leading-tight text-center truncate max-w-[78px]">{label}</span>
                </button>
              );
            })}
          </aside>

          {/* WORKSPACE 1: EXPLORE TREEMAP */}
          {view === "explore" && (
            <div className="flex flex-col justify-between bg-canvas">
              {/* Sub-header controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline bg-surface/70 px-3.5 py-2">
                <div className="flex flex-wrap items-center gap-2 text-[12px]">
                  <span className="font-mono font-semibold text-ink">
                    {copy.explore.breadcrumbRoot}
                  </span>
                  <span className="text-ink-muted font-mono text-[11px] tabular-nums">
                    {copy.explore.summaryItems}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-secondary">
                    <span
                      className="reclaim-hatch inline-block h-3 w-4 border border-strong bg-inset"
                      aria-hidden="true"
                    />
                    {copy.explore.hatchLegend}
                  </span>

                  <div className="inline-flex rounded-[2px] border border-hairline bg-inset p-0.5">
                    <button
                      type="button"
                      onClick={() => setExploreMode("size")}
                      className={`px-2 py-0.5 text-[11px] rounded-[1px] cursor-pointer transition-colors ${
                        exploreMode === "size"
                          ? "bg-surface text-ink font-semibold"
                          : "text-ink-muted"
                      }`}
                    >
                      {copy.explore.modeSize}
                    </button>
                    <button
                      type="button"
                      onClick={() => setExploreMode("age")}
                      className={`px-2 py-0.5 text-[11px] rounded-[1px] cursor-pointer transition-colors ${
                        exploreMode === "age"
                          ? "bg-surface text-ink font-semibold"
                          : "text-ink-muted"
                      }`}
                    >
                      {copy.explore.modeAge}
                    </button>
                  </div>
                </div>
              </div>

              {/* Treemap Canvas + Right Inspector */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_0.95fr] flex-1">
                {/* Treemap Mosaic */}
                <div
                  id="sandbox-treemap"
                  className="relative p-2.5 bg-inset/45 border-b lg:border-b-0 lg:border-r border-hairline grid grid-cols-12 gap-1.5 min-h-[320px]"
                >
                  {/* Left Column: Library (~43%) */}
                  <div className="col-span-12 sm:col-span-5 grid grid-rows-6 gap-1.5">
                    <div className="row-span-2 grid grid-cols-1">{renderTileBlock(TILES[3])}</div>
                    <div className="row-span-2 grid grid-cols-2 gap-1.5">
                      {renderTileBlock(TILES[0], true)}
                      {renderTileBlock(TILES[1], true)}
                    </div>
                    <div className="row-span-2 grid grid-cols-1">{renderTileBlock(TILES[2])}</div>
                  </div>

                  {/* Right Column: Projects, Agent scratch, Toolchains, Docs */}
                  <div className="col-span-12 sm:col-span-7 grid grid-rows-6 gap-1.5">
                    {/* Top Projects strip */}
                    <div className="row-span-3 grid grid-cols-12 gap-1.5">
                      <div className="col-span-7 grid">{renderTileBlock(TILES[4])}</div>
                      <div className="col-span-5 grid grid-rows-3 gap-1.5">
                        <div className="row-span-1 grid">{renderTileBlock(TILES[5], true)}</div>
                        <div className="row-span-1 grid">{renderTileBlock(TILES[6], true)}</div>
                        <div className="row-span-1 grid">{renderTileBlock(TILES[7], true)}</div>
                      </div>
                    </div>
                    {/* Bottom cluster */}
                    <div className="row-span-3 grid grid-cols-12 gap-1.5">
                      <div className="col-span-6 grid">{renderTileBlock(TILES[8])}</div>
                      <div className="col-span-6 grid grid-rows-2 gap-1.5">
                        {renderTileBlock(TILES[9], true)}
                        {renderTileBlock(TILES[10], true)}
                      </div>
                    </div>
                  </div>

                  {scanningPulse && (
                    <div className="pointer-events-none absolute inset-0 bg-canvas/55 backdrop-blur-[1px] flex items-center justify-center z-20">
                      <div className="slab px-4 py-2.5 flex items-center gap-2.5">
                        <LottiePulse animationData={scanMonolithAnim} size={22} loop playing />
                        <span className="font-mono text-[12px] text-ink">
                          Scanning allocated blocks…
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Selection & Worth-a-look Inspector */}
                <div className="flex flex-col justify-between bg-surface p-3.5 gap-3">
                  <div className="space-y-3">
                    {/* Selection card */}
                    <div className="border-b border-hairline pb-3">
                      <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted uppercase tracking-wider">
                        <span>{copy.explore.selectionHeading}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded-[1px] ${
                            selectedTile.reclaimable
                              ? "bg-amber-soft text-amber"
                              : "bg-inset text-ink-secondary"
                          }`}
                        >
                          {selectedTile.reclaimable
                            ? copy.explore.reclaimableBadge
                            : copy.explore.protectedBadge}
                        </span>
                      </div>

                      <div className="mt-1.5 flex items-baseline justify-between gap-2">
                        <h3 className="text-[14px] font-semibold text-ink truncate m-0">
                          {selectedTile.name}
                        </h3>
                        <span className="font-mono text-[20px] font-bold text-ink tabular-nums shrink-0">
                          {removedIds.includes(selectedTile.id)
                            ? "0.0"
                            : selectedTile.sizeGiB.toFixed(1)}{" "}
                          GiB
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-ink-muted truncate mt-0.5 mb-2.5">
                        {selectedTile.path}
                      </p>

                      <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-[11.5px] border-t border-hairline pt-2">
                        <div className="flex justify-between">
                          <span className="text-ink-muted">{copy.explore.ofScan}</span>
                          <span className="font-mono text-ink tabular-nums">
                            {selectedTile.pct}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ink-muted">{copy.explore.filesLabel}</span>
                          <span className="font-mono text-ink tabular-nums">
                            {selectedTile.files}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ink-muted">{copy.explore.lastWriteLabel}</span>
                          <span className="font-mono text-ink tabular-nums">
                            {selectedTile.lastWrite}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ink-muted">{copy.explore.kindLabel}</span>
                          <span className="font-mono text-ink">{selectedTile.kindKey}</span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2 text-[11px] font-mono text-ink-secondary bg-inset/60 px-2 py-1 rounded-[2px]">
                        <span>{copy.explore.gitLabel}:</span>
                        <span className="truncate text-ink">{selectedTile.gitStatus}</span>
                      </div>

                      {selectedTile.reclaimable && !removedIds.includes(selectedTile.id) && (
                        <button
                          type="button"
                          onClick={() => toggleMark(selectedTile.id)}
                          className={`mt-2.5 w-full py-1.5 text-[12px] font-medium rounded-[2px] border transition-colors cursor-pointer ${
                            markedIds.includes(selectedTile.id)
                              ? "bg-inset text-ink border-strong hover:bg-canvas"
                              : "bg-amber-fill text-amber-on border-amber-fill hover:bg-amber-hover"
                          }`}
                        >
                          {markedIds.includes(selectedTile.id)
                            ? copy.explore.unmarkBtn
                            : copy.explore.markBtn}
                        </button>
                      )}
                    </div>

                    {/* Worth a look */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted uppercase tracking-wider mb-1.5">
                        <span>{copy.explore.worthLooking}</span>
                        <span className="tabular-nums text-amber">
                          {worthList
                            .filter((w) => !removedIds.includes(w.id))
                            .reduce((s, w) => s + w.sizeGiB, 0)
                            .toFixed(1)}{" "}
                          GiB
                        </span>
                      </div>
                      <div className="space-y-1 max-h-[126px] overflow-y-auto ruum-scroll pr-1">
                        {worthList.map((item) => {
                          const isRemoved = removedIds.includes(item.id);
                          const isMarked = markedIds.includes(item.id) && !isRemoved;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              disabled={isRemoved}
                              onClick={() => {
                                setSelectedTileId(item.id);
                                toggleMark(item.id);
                              }}
                              className={`w-full flex items-center justify-between gap-2 px-2 py-1 rounded-[2px] border text-left text-[11.5px] transition-colors cursor-pointer ${
                                isMarked
                                  ? "border-amber bg-amber-soft/70"
                                  : "border-hairline bg-canvas/50 hover:border-strong"
                              } ${isRemoved ? "opacity-40 cursor-default" : ""}`}
                            >
                              <span className="flex items-center gap-1.5 truncate">
                                <span
                                  className="h-2 w-2 rounded-[1px] shrink-0"
                                  style={{ backgroundColor: item.accentVar }}
                                />
                                <span className="truncate font-medium text-ink">{item.name}</span>
                              </span>
                              <span className="font-mono text-[11px] text-ink-secondary tabular-nums shrink-0">
                                {item.sizeGiB.toFixed(1)} GiB
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Disk Meter & Review */}
                  <div className="border-t border-hairline pt-2.5 space-y-2">
                    <div className="flex flex-col gap-0.5 text-[11.5px]">
                      <span className="font-mono text-ink-muted whitespace-nowrap">
                        {copy.explore.diskHeading}
                      </span>
                      <span className="font-mono tabular-nums font-semibold text-ink">
                        {baseFreeGiB.toFixed(1)} {copy.explore.freeSuffix}
                        {markedTotalGiB > 0 && (
                          <span className="text-amber">
                            {" "}
                            → {projectedFreeGiB.toFixed(1)} {copy.explore.projectedSuffix}
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Proportional bar */}
                    <div className="h-2.5 w-full overflow-hidden rounded-[1px] bg-inset border border-hairline flex">
                      <div
                        className="h-full bg-ink-muted/35 transition-all duration-300"
                        style={{
                          width: `${Math.max(10, ((totalDiskGiB - projectedFreeGiB) / totalDiskGiB) * 100)}%`,
                        }}
                      />
                      {markedTotalGiB > 0 && (
                        <div
                          className="h-full bg-amber-fill transition-all duration-300"
                          style={{
                            width: `${Math.min(40, (markedTotalGiB / totalDiskGiB) * 100)}%`,
                          }}
                        />
                      )}
                    </div>

                    {reviewDone && markedIds.length === 0 ? (
                      <div className="flex items-center gap-2 rounded-[2px] border border-hairline bg-inset/70 px-2.5 py-2 text-[11.5px] text-ink">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-amber" />
                        <span>{copy.explore.reviewDoneText}</span>
                      </div>
                    ) : reviewOpen && markedIds.length > 0 ? (
                      <div className="rounded-[2px] border border-strong bg-inset/70 p-2.5 space-y-2">
                        <div className="flex items-center justify-between text-[11.5px] font-semibold text-ink">
                          <span>{copy.explore.reviewTitle}</span>
                          <span className="font-mono text-amber tabular-nums">
                            +{markedTotalGiB.toFixed(1)} GiB
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleCommitTrash}
                            className="btn-primary flex-1 py-1.5 text-[11.5px]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {copy.explore.reviewTrashBtn}
                          </button>
                          <button
                            type="button"
                            onClick={() => setReviewOpen(false)}
                            className="btn-secondary px-2.5 py-1.5 text-[11.5px]"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={markedIds.length === 0}
                        onClick={() => setReviewOpen(true)}
                        className="btn-primary w-full py-1.5 text-[12px] disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {copy.explore.reviewBtnPrefix} {markedIds.length}{" "}
                        {copy.explore.reviewBtnMid} {markedTotalGiB.toFixed(1)} GiB
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WORKSPACE 2: DOCKER SPACE & VOLUME LOCK */}
          {view === "docker" && (
            <div className="p-4 sm:p-5 bg-canvas flex flex-col justify-between gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
                <div>
                  <h3 className="text-[15px] font-semibold text-ink m-0">{copy.docker.title}</h3>
                  <p className="text-[12px] text-ink-secondary mt-0.5 mb-0">
                    {copy.docker.overviewTitle}
                  </p>
                </div>

                <div className="inline-flex rounded-[2px] border border-hairline bg-surface p-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setDockerHost("local");
                      setDockerSelected(["dc-cache", "dc-img-1"]);
                    }}
                    className={`px-2.5 py-1 text-[11.5px] font-mono rounded-[1px] cursor-pointer transition-colors ${
                      dockerHost === "local" ? "bg-inset text-ink font-semibold" : "text-ink-muted"
                    }`}
                  >
                    {copy.docker.hostLocal}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDockerHost("ssh");
                      setDockerSelected(["ssh-dc-cache"]);
                    }}
                    className={`px-2.5 py-1 text-[11.5px] font-mono rounded-[1px] cursor-pointer transition-colors ${
                      dockerHost === "ssh" ? "bg-inset text-ink font-semibold" : "text-ink-muted"
                    }`}
                  >
                    {copy.docker.hostSsh}
                  </button>
                </div>
              </div>

              {/* 4 Allocation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="slab p-3 space-y-1">
                  <div className="text-[11.5px] font-medium text-ink-secondary">
                    {copy.docker.cards.images}
                  </div>
                  <div className="font-mono text-[18px] font-bold text-ink tabular-nums">
                    {dockerDataset.imagesReclaim.toFixed(1)} GiB
                  </div>
                  <div className="font-mono text-[11px] text-ink-muted">
                    {dockerDataset.imagesTotal} total · {dockerDataset.imagesActive} active
                  </div>
                </div>

                <div className="slab p-3 space-y-1">
                  <div className="text-[11.5px] font-medium text-ink-secondary">
                    {copy.docker.cards.containers}
                  </div>
                  <div className="font-mono text-[18px] font-bold text-ink tabular-nums">
                    {dockerDataset.containersReclaim.toFixed(1)} GiB
                  </div>
                  <div className="font-mono text-[11px] text-ink-muted">
                    {dockerDataset.containersTotal} total · {dockerDataset.containersActive} active
                  </div>
                </div>

                <div className="slab p-3 space-y-1">
                  <div className="text-[11.5px] font-medium text-ink-secondary">
                    {copy.docker.cards.buildCache}
                  </div>
                  <div className="font-mono text-[18px] font-bold text-amber tabular-nums">
                    {dockerDataset.cacheReclaim.toFixed(1)} GiB
                  </div>
                  <div className="font-mono text-[11px] text-ink-muted">
                    {dockerDataset.cacheShared.toFixed(1)} GiB {copy.docker.sharedNotePrefix}
                  </div>
                </div>

                {/* Protected Local Volumes Card */}
                <div
                  id="sandbox-docker-volumes"
                  className="rounded-[2px] border border-strong bg-inset/80 p-3 space-y-1.5 relative"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11.5px] font-semibold text-ink">
                      {copy.docker.cards.localVolumes}
                    </span>
                    <Lock className="h-3.5 w-3.5 text-amber shrink-0" aria-hidden="true" />
                  </div>
                  <div className="font-mono text-[18px] font-bold text-ink tabular-nums">
                    {dockerDataset.volumesSize.toFixed(1)} GiB
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-[1px] bg-amber-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber">
                    {copy.docker.protectedBadge}
                  </span>
                  <p className="text-[11px] leading-snug text-ink-secondary m-0">
                    {copy.docker.protectedNote}
                  </p>
                </div>
              </div>

              {/* Candidate list + Safe clean */}
              <div className="slab p-3.5 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[11.5px] font-semibold text-ink uppercase tracking-wider">
                    {copy.docker.candidatesTitle}
                  </span>
                  <span className="font-mono text-[12px] text-amber tabular-nums">
                    {copy.docker.safeReclaimable}: {dockerSelectedGiB.toFixed(1)} GiB
                  </span>
                </div>

                <div className="space-y-1.5">
                  {dockerDataset.candidates.map((cand) => {
                    const isCleaned = dockerCleaned.includes(cand.id);
                    const checked = dockerSelected.includes(cand.id) && !isCleaned;
                    return (
                      <label
                        key={cand.id}
                        className={`flex items-center justify-between gap-3 rounded-[2px] border px-3 py-2 text-[12px] cursor-pointer transition-colors ${
                          checked ? "border-amber bg-amber-soft/50" : "border-hairline bg-canvas/50"
                        } ${isCleaned ? "opacity-45" : ""}`}
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            disabled={isCleaned}
                            checked={checked}
                            onChange={() =>
                              setDockerSelected((prev) =>
                                prev.includes(cand.id)
                                  ? prev.filter((x) => x !== cand.id)
                                  : [...prev, cand.id],
                              )
                            }
                            className="accent-[var(--accent-amber)]"
                          />
                          <span className="min-w-0">
                            <span className="block font-mono font-medium text-ink truncate">
                              {cand.name}
                            </span>
                            <span className="block text-[11px] text-ink-muted truncate">
                              {cand.meta}
                            </span>
                          </span>
                        </span>
                        <span className="font-mono text-[12px] font-semibold text-ink tabular-nums shrink-0">
                          {isCleaned ? "0.0" : cand.sizeGiB.toFixed(1)} GiB
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  {dockerCleaned.length > 0 ? (
                    <span className="text-[12px] font-medium text-ink-secondary">
                      {copy.docker.cleanedNotice}
                    </span>
                  ) : (
                    <span />
                  )}
                  <button
                    type="button"
                    disabled={dockerSelectedGiB === 0}
                    onClick={() => {
                      setDockerCleaned((prev) => [...new Set([...prev, ...dockerSelected])]);
                      setDockerSelected([]);
                    }}
                    className="btn-primary px-3.5 py-1.5 text-[12px] disabled:opacity-40"
                  >
                    {copy.docker.cleanBtn} ({dockerSelectedGiB.toFixed(1)} GiB)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* WORKSPACE 3: AI WATCHDOG & MCP */}
          {view === "watchdog" && (
            <div className="p-4 sm:p-5 bg-canvas flex flex-col justify-between gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
                <div className="flex items-center gap-2.5">
                  <LottiePulse animationData={watchdogPulseAnim} size={24} loop playing />
                  <div>
                    <h3 className="text-[15px] font-semibold text-ink m-0">
                      {copy.watchdog.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-[11.5px] font-mono text-ink-muted mt-0.5">
                      <span>{copy.watchdog.statusHealthy}</span>
                      <span>·</span>
                      <span>{copy.watchdog.thresholdLabel}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex rounded-[2px] border border-hairline bg-surface p-0.5">
                    <button
                      type="button"
                      onClick={() => setWatchdogTab("proposal")}
                      className={`px-2.5 py-1 text-[11.5px] rounded-[1px] cursor-pointer ${
                        watchdogTab === "proposal"
                          ? "bg-inset text-ink font-semibold"
                          : "text-ink-muted"
                      }`}
                    >
                      {copy.watchdog.proposalTab}
                    </button>
                    <button
                      type="button"
                      onClick={() => setWatchdogTab("mcp")}
                      className={`px-2.5 py-1 text-[11.5px] rounded-[1px] cursor-pointer ${
                        watchdogTab === "mcp" ? "bg-inset text-ink font-semibold" : "text-ink-muted"
                      }`}
                    >
                      {copy.watchdog.mcpTraceTab}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAiAnalyzing(true);
                      setAiConfirmed(false);
                      window.setTimeout(() => setAiAnalyzing(false), 750);
                    }}
                    className="btn-secondary px-2.5 py-1 text-[11.5px]"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber" />
                    <span>{copy.watchdog.runAnalysisBtn}</span>
                  </button>
                </div>
              </div>

              {watchdogTab === "proposal" ? (
                <div
                  id="sandbox-ai-proposal"
                  className="slab p-4 space-y-3 flex-1 flex flex-col justify-between"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-amber" />
                      <span className="text-[13px] font-semibold text-ink">
                        {copy.watchdog.proposalTitle}
                      </span>
                    </div>
                    <span className="badge-mono text-amber">{copy.watchdog.proposalBadge}</span>
                  </div>

                  {aiAnalyzing ? (
                    <div className="py-10 flex flex-col items-center justify-center gap-2 text-[12px] font-mono text-ink-secondary">
                      <LottiePulse animationData={scanMonolithAnim} size={32} loop playing />
                      <span>{copy.watchdog.analyzingLabel}</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {AI_PROPOSALS.map((item) => {
                        const checked = aiChecked.includes(item.id);
                        return (
                          <label
                            key={item.id}
                            className={`flex flex-wrap items-center justify-between gap-2 rounded-[2px] border px-3 py-2 text-[12px] cursor-pointer ${
                              checked
                                ? "border-amber bg-amber-soft/50"
                                : "border-hairline bg-canvas/40"
                            }`}
                          >
                            <span className="flex items-start gap-2.5 min-w-0">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {
                                  setAiConfirmed(false);
                                  setAiChecked((prev) =>
                                    prev.includes(item.id)
                                      ? prev.filter((x) => x !== item.id)
                                      : [...prev, item.id],
                                  );
                                }}
                                className="mt-0.5 accent-[var(--accent-amber)]"
                              />
                              <span className="min-w-0">
                                <span className="block font-mono font-medium text-ink truncate">
                                  {item.path}
                                </span>
                                <span className="block text-[11px] text-ink-secondary">
                                  {item.reason}
                                  {item.gitFlag && (
                                    <span className="ml-2 inline-flex items-center gap-1 font-mono text-amber">
                                      <ShieldAlert className="h-3 w-3" />
                                      {copy.watchdog.gitWarning}
                                    </span>
                                  )}
                                </span>
                              </span>
                            </span>
                            <span className="flex items-center gap-2 shrink-0">
                              <span className="badge-mono">Trash</span>
                              <span className="font-mono font-semibold text-ink tabular-nums">
                                {item.sizeGiB.toFixed(1)} GiB
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-hairline pt-2.5">
                    <span className="font-mono text-[11px] text-ink-muted">
                      {copy.watchdog.daemonLabel}
                    </span>
                    {aiConfirmed ? (
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-amber">
                        <CheckCircle2 className="h-4 w-4" />
                        {copy.watchdog.confirmedNotice}
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={aiChecked.length === 0 || aiAnalyzing}
                        onClick={() => setAiConfirmed(true)}
                        className="btn-primary px-3.5 py-1.5 text-[12px] disabled:opacity-40"
                      >
                        {copy.watchdog.confirmBtn} (
                        {AI_PROPOSALS.filter((p) => aiChecked.includes(p.id))
                          .reduce((s, p) => s + p.sizeGiB, 0)
                          .toFixed(1)}{" "}
                        GiB)
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div id="sandbox-ai-proposal" className="slab p-4 space-y-2.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[12px] font-semibold text-ink">
                      {copy.watchdog.mcpTraceNote}
                    </span>
                    <span className="badge-mono text-amber">stdio JSON-RPC 2.0</span>
                  </div>
                  <pre className="m-0 rounded-[2px] border border-hairline bg-inset/80 p-3 font-mono text-[11.5px] leading-relaxed text-ink overflow-x-auto ruum-scroll">
                    {`-> {"method":"tools/call","params":{"name":"find_reclaimable","arguments":{"root":"~"}}}
<- 4 candidates (30.1 GiB) · Rust target, pnpm store, Homebrew, stale worktrees

-> {"method":"tools/call","params":{"name":"check_git_safety","arguments":{"paths":["~/Projects/routeyard/worktrees"]}}}
<- { "dirty": false, "stale_days": 16, "hooks_executed": false }

-> {"method":"tools/call","params":{"name":"plan_removal","arguments":{"targets":[...]}}}
<- { "valid": true, "removal_guards": "passed", "protected_paths_touched": 0 }

-> {"method":"tools/call","params":{"name":"trash_paths","arguments":{"targets":[...]}}}
<- [BLOCKED until Confirm Cleanup GUI checkbox + OS auth]`}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* WORKSPACE 4: REMOTE SSH EXPORT */}
          {view === "ssh" && (
            <div className="p-4 sm:p-5 bg-canvas flex flex-col justify-between gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
                <div className="flex items-center gap-2">
                  <ScanSearch className="h-4 w-4 text-amber" />
                  <code className="font-mono text-[13px] font-semibold text-ink">
                    {copy.ssh.banner}
                  </code>
                </div>
                <span className="badge-mono text-amber">{copy.ssh.readOnlyTag}</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.15fr] gap-4 flex-1">
                <div className="slab p-3.5 space-y-2.5">
                  <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                    {copy.ssh.targetsHeading}
                  </div>
                  <div className="space-y-1.5">
                    {SSH_TARGETS.map((target) => {
                      const selected = sshSelected.includes(target.id);
                      return (
                        <label
                          key={target.id}
                          className={`flex items-center justify-between gap-2 rounded-[2px] border px-2.5 py-2 text-[12px] cursor-pointer ${
                            selected
                              ? "border-amber bg-amber-soft/50"
                              : "border-hairline bg-canvas/50"
                          }`}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() =>
                                setSshSelected((prev) =>
                                  prev.includes(target.id)
                                    ? prev.filter((x) => x !== target.id)
                                    : [...prev, target.id],
                                )
                              }
                              className="accent-[var(--accent-amber)]"
                            />
                            <span className="min-w-0">
                              <span className="block font-mono font-medium text-ink truncate">
                                {target.path}
                              </span>
                              <span className="block text-[11px] text-ink-muted">
                                {target.kind}
                              </span>
                            </span>
                          </span>
                          <span className="font-mono font-semibold text-ink tabular-nums shrink-0">
                            {target.sizeGiB.toFixed(1)} GiB
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div
                  id="sandbox-ssh-script"
                  className="slab p-3.5 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-semibold text-ink-secondary">
                      {copy.ssh.scriptHeading}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopySshScript}
                      className="inline-flex items-center gap-1 rounded-[2px] border border-hairline bg-inset px-2 py-1 font-mono text-[11px] text-ink hover:border-strong cursor-pointer"
                    >
                      {sshCopied ? (
                        <Check className="h-3 w-3 text-amber" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>{sshCopied ? copy.ssh.copiedScript : copy.ssh.copyScript}</span>
                    </button>
                  </div>

                  <pre className="m-0 rounded-[2px] border border-hairline bg-inset/80 p-3 font-mono text-[11px] leading-relaxed text-ink overflow-x-auto ruum-scroll">
                    <code>{generatedSshScript}</code>
                  </pre>

                  <p className="m-0 font-mono text-[11px] text-ink-muted">
                    {copy.ssh.previewNotice}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
