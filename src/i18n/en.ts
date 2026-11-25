import type { SiteCopy } from "./types";

export const en: SiteCopy = {
  locale: "en",
  localeLabel: "EN",
  htmlLang: "en",
  meta: {
    homeTitle:
      "Ruum — Free Open-Source Disk Space Analyzer & AI Disk Cleanup (Mac, Windows, Linux)",
    homeDescription:
      "Ruum is a free, open-source treemap disk space analyzer and AI disk cleanup tool for macOS, Windows (fast NTFS MFT), and Linux. Visualize large files, dev caches, Docker, and SSH servers safely with built-in MCP.",
    downloadTitle: "Download Ruum — Free Disk Space Analyzer for macOS, Windows & Linux",
    downloadDescription:
      "Download Ruum desktop installers and headless server CLI for macOS (Apple Silicon & Intel), Windows, and Linux — verified with SHA-256 checksums and Sigstore build provenance.",
    changelogTitle: "Ruum Changelog — Disk Space Analyzer & AI Cleanup Release History",
    changelogDescription:
      "Official release notes, new features, and engineering milestones for Ruum across macOS, Windows, and Linux.",
    keywords:
      "Ruum, ruum, disk space analyzer, AI disk cleanup, disk cleanup tool, mac disk space analyzer, windows disk analyzer, linux disk usage gui, docker disk cleanup, ssh disk space analyzer, MCP disk server, find large files, node_modules cleanup, open source",
    ogImageAlt:
      "Ruum — Free open-source disk space analyzer and AI disk cleanup tool for macOS, Windows, and Linux",
    applicationSubCategory: "Disk Space Analyzer & AI Disk Cleanup Tool",
    alternateNames: ["ruum", "Ruum Disk Space Analyzer", "Ruum AI Disk Cleanup"],
    featureList: [
      "Visual treemap disk space analyzer for macOS, Windows (fast NTFS MFT direct read), and Linux",
      "O(1) AI Watchdog daemon and 8-tool stdio MCP server with human confirmation gates",
      "Docker Space Explorer with core-level Protected Read-only lock for Local Volumes",
      "Zero-sudo remote SSH disk diagnostics using checksum-verified static musl streaming",
      "Instant developer cache detection for node_modules, Xcode, Cargo, and build outputs",
      "Trash-first Rust safety guardrails with OS/mount refusal and hook-free Git checks",
    ],
  },
  nav: {
    home: "Home",
    capabilities: "Capabilities",
    safety: "Safety",
    download: "Download",
    changelog: "Changelog",
    support: "Sponsor",
    installCta: "Install",
    themeToDark: "Switch to Obsidian dark theme",
    themeToLight: "Switch to Warm Paper light theme",
    menu: "Menu",
    logoAlt: "Ruum logo",
  },
  hero: {
    eyebrowPrefix: "Rust + GPUI",
    eyebrowTech: "macOS · Linux · Windows · GPL-3.0",
    headlineLine1: "Make room on",
    headlineLine2: "every drive.",
    subcopy:
      "Ruum is a free, open-source disk space analyzer and AI disk cleanup tool for macOS, Windows, and Linux. Visualize large files, dev caches, Docker, and remote SSH servers in a fast treemap — nothing is removed until you confirm.",
    primaryCta: "Download Ruum",
    secondaryCta: "View on GitHub",
    tourCta: "Quick Start",
    tourHint:
      "Interactive demo + unedited macOS screenshot toggle below — or launch the 5-step Quick Start",
  },
  installBar: {
    tabs: {
      unix: "macOS / Linux",
      homebrew: "Homebrew",
      windows: "Windows",
      cli: "Server CLI",
    },
    detectedTag: "Recommended",
    copy: "Copy",
    copied: "Copied",
    allPackages: "All installers & SHA-256",
    verifiedNote: "Ed25519 + SHA-256 verified",
  },
  sandbox: {
    windowTitle: "Ruum",
    demoModeLabel: "Interactive Demo",
    screenshotModeLabel: "Real Screenshot",
    demoDisclaimer: "Sample data",
    screenshotCaption:
      "Actual macOS desktop screenshot. Switch to Interactive Demo to try tile marking, Docker, Remote SSH, and Watchdog.",
    screenshotAlt: "Unedited macOS GPUI desktop screenshot of Ruum disk space analyzer",
    tourButton: "Quick Start",
    rescanButton: "Rescan",
    resetButton: "Reset",
    rails: {
      explore: "Explore",
      docker: "Docker",
      watchdog: "Watchdog",
      ssh: "Remote",
    },
    explore: {
      breadcrumbRoot: "Ruum / Users / dev",
      summaryItems: "263 GiB · 4,184,346 files · 63.0 s",
      modeSize: "Size",
      modeAge: "Age",
      hatchLegend: "Hatched = Reclaimable",
      selectionHeading: "Selection",
      ofScan: "Of scan",
      filesLabel: "Files",
      lastWriteLabel: "Last write",
      kindLabel: "Kind",
      gitLabel: "Git safety",
      markBtn: "Mark for removal",
      unmarkBtn: "Unmark",
      worthLooking: "Worth a look",
      diskHeading: "Disk · /dev/disk3s5",
      freeSuffix: "GiB free",
      projectedSuffix: "GiB after cleanup",
      reviewBtnPrefix: "Review",
      reviewBtnMid: "marked · frees",
      reviewTitle: "Non-destructive Review",
      reviewTrashBtn: "Move to Trash",
      reviewExportBtn: "Copy Prompt",
      reviewDoneBadge: "Verified",
      reviewDoneText: "Moved to Trash. Volume meter updated from post-cleanup scan.",
      reclaimableBadge: "Reclaimable",
      protectedBadge: "Source Code",
      ageWeek: "This week",
      ageOlder: "Older",
    },
    docker: {
      title: "Docker Space Explorer",
      hostLocal: "This computer · OrbStack",
      hostSsh: "SSH · prod-eu-01 · dockerd",
      overviewTitle: "Disk Allocation Overview",
      safeReclaimable: "Safe reclaimable",
      cards: {
        images: "Images",
        containers: "Containers",
        buildCache: "Build Cache",
        localVolumes: "Local Volumes",
      },
      protectedBadge: "Protected · Read-only",
      protectedNote: "Database & state volumes stay locked and are never pruned by Ruum.",
      sharedNotePrefix: "shared with images",
      candidatesTitle: "Safe cleanup candidates",
      cleanBtn: "Clean selected",
      cleanedNotice: "Pruned selected cache & dangling layers. Volumes remained untouched.",
    },
    watchdog: {
      title: "Disk Space Watchdog & AI Assistant",
      statusHealthy: "O(1) statvfs · 0 dir walks",
      statusLow: "Low space proposal ready",
      daemonLabel: "Daemon: launchd / systemd / Run",
      thresholdLabel: "Threshold < 20 GiB",
      runAnalysisBtn: "Run AI Analysis",
      analyzingLabel: "Evaluating caches & Git worktrees…",
      proposalTitle: "Confirm Cleanup Window (Human-in-the-loop)",
      proposalBadge: "Never unattended",
      gitWarning: "Git: 2 stale worktrees · 16d untouched",
      confirmBtn: "Confirm & Clean",
      confirmedNotice: "Confirmed candidates moved to Trash safely.",
      proposalTab: "AI Proposal",
      mcpTraceTab: "MCP Trace",
      mcpTraceNote: "Headless stdio JSON-RPC (`ruum mcp --read-only`)",
    },
    ssh: {
      title: "Remote SSH Analysis",
      banner: "ruum ssh prod-eu-01 /var",
      readOnlyTag: "Export-only · Zero sudo",
      targetsHeading: "Streamed remote hotspots",
      scriptHeading: "Preview-first delete script (HostIdentity guarded)",
      copyScript: "Copy script",
      copiedScript: "Copied",
      previewNotice:
        "Default run previews targets only. `--delete` verifies hostname + machine-id.",
    },
    tour: {
      nextBtn: "Next",
      prevBtn: "Back",
      doneBtn: "Done",
      progressText: "{{current}} / {{total}}",
      steps: {
        install: {
          title: "1. Install in One Command",
          description:
            "Start by picking your OS tab to copy the SHA-256 verified installer (macOS, Linux, Windows, or --cli-only for headless servers), or open Download for .dmg / .deb / .msi packages.",
        },
        explore: {
          title: "2. Visual Treemap + Hatching",
          description:
            "Hue tells you what data is (Code, Agent scratch, Toolchains, Cache). Diagonal hatching marks what is safely reclaimable. Click any tile to see projected free space update live.",
        },
        docker: {
          title: "3. Docker Cleanup with Volume Lock",
          description:
            "Inspect Images, Containers, Build Cache, and Local Volumes across local or SSH hosts. Local Volumes are locked Read-only so database state is never wiped.",
        },
        ssh: {
          title: "4. Zero-Sudo Remote SSH Export",
          description:
            "Uploads a checksum-verified static musl scanner automatically. Remote GUI sessions stay strictly read-only and export HostIdentity-verified scripts.",
        },
        watchdog: {
          title: "5. O(1) AI Watchdog & MCP",
          description:
            "Monitors free space via zero-walk statvfs checks. When low, AI prepares a cleanup proposal — always paused at an explicit human confirmation window.",
        },
      },
    },
  },
  capabilities: {
    sectionEyebrow: "Four Core Pillars",
    sectionTitle: "Built for AI-era workstations and production servers.",
    sectionSubtitle:
      "Every capability is engineered to make multi-gigabyte storage bottlenecks immediately legible — without risking uncommitted code, Docker volumes, or wrong SSH hosts.",
    aiMcp: {
      eyebrow: "01 · AI Intelligence & MCP",
      title: "Watchdog daemon + 8-tool stdio MCP server.",
      description:
        "An O(1) background watchdog detects low free space without burning disk I/O, asks your configured AI CLI (Agy, Pi, Codex, or Custom) for candidates, and exposes 8 typed MCP tools with hard human approval gates.",
      bullets: [
        "OS-native daemon: launchd (macOS), systemd --user (Linux), zero-UAC Run key (Windows)",
        "AI proposals always open a standalone Confirm Cleanup dialog with Git dirty warnings",
        "Mutating MCP tools fail closed without desktop checkbox approval + OS Touch ID auth",
      ],
      modeStandard: "Standard (GUI-gated)",
      modeReadOnly: "--read-only (Audit)",
      copyJson: "Copy config",
      copiedJson: "Copied",
      toolsHeading: "Exposed MCP Tools",
      toolCol: "Tool",
      scopeCol: "Scope",
      guardCol: "Safety Boundary",
    },
    ssh: {
      eyebrow: "02 · Remote SSH Diagnostics",
      title: "Zero-sudo static musl streaming over SSH.",
      description:
        "Point Ruum at any SSH host alias. Packaged builds upload a checksum-verified static musl binary into ~/.cache/ruum/ssh/ and stream bounded records without storing the tree in remote RAM.",
      bullets: [
        "Stops at nested mount points and terminates cleanly on disconnect",
        "Remote GUI is strictly export-only — no direct remote delete buttons",
        "Generated scripts check actual remote hostname & machine-id before deleting anything",
      ],
      cmdLabel: "One command from any terminal",
      pipelineSteps: [
        {
          step: "01",
          title: "Probe & Upload",
          detail: "Detects OS/arch, uploads verified static musl scanner (~/.cache/ruum/ssh)",
        },
        {
          step: "02",
          title: "Bounded Stream",
          detail: "Single compressed SSH pipe; zero full-tree remote memory footprint",
        },
        {
          step: "03",
          title: "HostIdentity Guard",
          detail: "Preview-first script aborts on hostname or /etc/machine-id mismatch",
        },
      ],
    },
    docker: {
      eyebrow: "03 · Docker Space & Volume Safety",
      title: "Inspect images, containers & build cache — never touch volumes.",
      description:
        "Built-in Docker workspace works identically on local Docker Desktop / OrbStack and remote SSH daemons, separating shared image layers from safe reclaimable build cache.",
      bullets: [
        "Four-state daemon probe: NotInstalled, DaemonStopped, PermissionDenied, Available",
        "Distinguishes unique vs. image-shared Build Cache bytes accurately",
        "Local Volumes remain strictly Protected · Read-only across GUI and cleanup adapters",
      ],
      cardLabels: [
        { name: "Images", status: "Unused & dangling selectable", badge: "Reclaimable" },
        { name: "Containers", status: "Stopped / exited candidates", badge: "Reclaimable" },
        { name: "Build Cache", status: "Unique vs shared layers split", badge: "Reclaimable" },
        {
          name: "Local Volumes",
          status: "Never auto-pruned by Ruum",
          badge: "Protected · Read-only",
        },
      ],
    },
    visual: {
      eyebrow: "04 · Native GPUI Visualization",
      title: "Colour means category. Hatch means reclaimable.",
      description:
        "Rendered natively in Rust with GPUI. Tile area maps to real allocated disk blocks (plus NTFS MFT direct read on Windows), while diagonal hatching lets you spot safe cleanups instantly.",
      bullets: [
        "Memoized widening from ~ to / reuses scanned subtrees without re-walking",
        "Hardlink deduplication counts shared inodes once during bottom-up aggregation",
        "Live free-space projection meter prevents double-counting nested marks",
      ],
      legendTitle: "Category Colour Map",
      hatchCaption:
        "45° Hatch = Reclaimable node_modules, Xcode / Cargo build cache, worktrees, or package stores",
      categories: [
        "Code",
        "Agent scratch",
        "Toolchains",
        "Container",
        "Synced",
        "Git",
        "Media",
        "Cache",
        "Documents",
        "Other",
      ],
    },
  },
  safety: {
    eyebrow: "Engineering Guardrails",
    title: "Safety enforced in Rust, not wishful UI prompts.",
    subtitle:
      "Every removal is validated in Rust before touching disk and aborts automatically if any boundary is violated.",
    items: [
      {
        code: "GUARD · 01",
        title: "OS & Mount-Point Refusal",
        detail:
          "Filesystem root, home directory, /usr, /etc, /nix/store, Homebrew prefixes, and Windows system trees are unconditionally blocked.",
      },
      {
        code: "GUARD · 02",
        title: "Docker Volume Read-Only Lock",
        detail:
          "Local volumes are excluded from cleanup at the core level — database and persistent mounts cannot be selected or pruned.",
      },
      {
        code: "GUARD · 03",
        title: "Cloud-Safe & Hardlink Aware",
        detail:
          "Never triggers iCloud Drive or Dropbox hydration downloads; excludes Time Machine local snapshots; deduplicates hardlinked inodes.",
      },
      {
        code: "GUARD · 04",
        title: "Hook-Free Git Inspection",
        detail:
          "Evaluates dirty trees, stashes, and unpushed commits with hooks, fsmonitor, and custom filter drivers disabled.",
      },
      {
        code: "GUARD · 05",
        title: "Human & Touch ID Gate",
        detail:
          "Trash is default; permanent deletion and mutating MCP calls require GUI checkbox approval plus OS native authentication.",
      },
      {
        code: "GUARD · 06",
        title: "Signed Releases & Attestation",
        detail:
          "Every release ships Ed25519 manifests, SHA256SUMS, and Sigstore provenance verifiable via gh attestation verify.",
      },
    ],
  },
  installBand: {
    eyebrow: "Ready in 15 seconds",
    title: "Reclaim disk space on local drives and remote servers.",
    subtitle:
      "Single binary with desktop GUI, SSH scanner, Watchdog daemon, and stdio MCP server built in.",
    downloadPageBtn: "Browse all installers",
    changelogBtn: "Read changelog",
  },
  support: {
    eyebrow: "OPEN SOURCE · GPL-3.0",
    title: "Buy Me a Coffee",
    description:
      "If Ruum helped you reclaim disk space or saved you time, consider buying me a coffee — your support helps keep the project going.",
    kofiCta: "Buy me a coffee on Ko-fi",
    kofiNote: "One-time tip via Ko-fi · Ruum remains 100% free and open source.",
    wechatTrigger: "",
    wechatModalTitle: "",
    wechatHint: "",
    wechatAlt: "",
    closeLabel: "Close",
  },
  downloadPage: {
    eyebrow: "Distributions & Verification",
    title: "Download Ruum",
    subtitle:
      "Free desktop installers, package managers, and headless server CLI for macOS, Windows, and Linux — verified with SHA-256 and Sigstore.",
    channelStable: "Stable",
    channelBeta: "Beta",
    recommendedForPrefix: "Recommended for",
    archAppleSilicon: "Apple Silicon (aarch64)",
    archIntel: "Intel (x86_64)",
    archArm64: "ARM64 (aarch64)",
    archX64: "x64 (x86_64)",
    otherFormatsLabel: "Other formats",
    matchedCommandHeading: "Quick Install",
    showAllOptions: "Other platforms, architectures & all versions",
    hideAllOptions: "Hide other platforms & all versions",
    otherPlatformsHint: "macOS · Linux · Windows · CLI · SHA256SUMS · Sigstore",
    latestTagLabel: "Release",
    publishedLabel: "Published",
    quickInstallHeading: "One-Line Installers",
    packageManagersHeading: "Package Managers",
    directArtifactsHeading: "Direct Installers & Checksums",
    archLabel: "Architecture",
    formatLabel: "Package",
    sizeLabel: "Size",
    checksumLabel: "Verification",
    downloadBtn: "Download",
    copyBtn: "Copy",
    copiedBtn: "Copied",
    verifyHeading: "Verify Downloads & Provenance",
    verifySubtitle:
      "Every build in GitHub Releases includes SHA256SUMS and Sigstore build attestations.",
    platformNotesHeading: "Platform Setup Notes",
    macosNoteTitle: "macOS · Gatekeeper & Full Disk Access",
    macosNoteBody:
      "For unsigned builds, run `xattr -dr com.apple.quarantine /Applications/ruum.app` once. Grant Full Disk Access in System Settings › Privacy & Security to scan protected app containers and Trash.",
    windowsNoteTitle: "Windows · Fast NTFS MFT Scans",
    windowsNoteBody:
      "When scanning a full NTFS drive such as C:\\, launching or restarting Ruum as Administrator reads the Master File Table directly — multiple times faster than directory traversal.",
    linuxNoteTitle: "Linux · Wayland, X11 & Hyprland",
    linuxNoteBody:
      "Linux GUI builds require Wayland or X11 with a Vulkan-capable GPU (or use `--cli-only` / `ruum ssh --check` headless). On Hyprland, set `windowrule = float, class:^(ruum)$`.",
    allReleasesLink: "All releases on GitHub",
  },
  changelogPage: {
    eyebrow: "Release History",
    title: "Changelog",
    subtitle: "New features, fixes, and stability improvements across every release.",
    filterAll: "All",
    filterStable: "Stable",
    filterBeta: "Beta",
    stableBadge: "Stable",
    betaBadge: "Beta",
    featuresLabel: "Features",
    fixesLabel: "Fixes",
    improvementsLabel: "Improvements",
    viewOnGithub: "Release on GitHub",
  },
  footer: {
    logoAlt: "Ruum mark",
    etymologyTitle: 'Why "Ruum"?',
    etymologyBody:
      "From the Old Norse sense of spaciousness and open room (rúm) — built to clear forgotten caches and artifacts so every drive has open breathing room again.",
    license: "GPL-3.0-only · Built by JsonLee12138",
    groups: {
      product: "Product",
      community: "Open Source",
      contact: "Contact",
    },
    links: {
      github: "GitHub",
      releases: "Releases",
      issues: "Issues",
      download: "Download",
      changelog: "Changelog",
      support: "Sponsor",
      email: "Email (lijunsong2@gmail.com)",
      discord: "Discord Community",
    },
  },
};
