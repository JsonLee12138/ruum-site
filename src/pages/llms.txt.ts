import type { APIRoute } from "astro";
import releasesData from "../data/releases.json";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const origin = (site?.toString() || "https://ruum.jsonlee12138.com").replace(/\/$/, "");
  const latestVersion = releasesData.stable?.tag ?? "v0.2.3";

  const body = `# Ruum

> Free, open-source (GPL-3.0-only) cross-platform disk space analyzer and AI disk cleanup tool built in Rust with GPUI. CLI binary: \`ruum\`. Latest stable release: ${latestVersion}.

Ruum helps developers, SREs, and workstation users visualize what fills local drives, Docker storage, and remote SSH servers in a proportional treemap, identify safe reclaimable developer caches, and collaborate safely with AI coding agents via a built-in stdio MCP server.

## Supported Platforms

- **macOS** (Apple Silicon \`aarch64\` & Intel \`x86_64\`): Native GPUI desktop app (\`/Applications/ruum.app\`) and CLI (\`.dmg\`, \`.pkg\`, \`.zip\`, Homebrew).
- **Windows** (\`x64\` & \`ARM64\`): Native desktop app and CLI (\`.msi\`, \`.exe\`, \`.zip\`), with Administrator NTFS Master File Table (MFT) direct read for fast full-drive scans such as \`C:\\\`.
- **Linux** (\`x86_64\` & \`aarch64\`): Wayland / X11 + Vulkan desktop GUI (\`.deb\`, \`.AppImage\`, \`.tar.gz\`) plus headless \`--cli-only\` server CLI.

## Core Capabilities

- **GPUI Treemap & Reclaimable Hatching**: Tile area maps to real allocated disk blocks with hardlink inode deduplication and memoized root widening (from \`~\` to \`/\` without re-walking). Colour encodes data category while 45° diagonal hatching marks safely reclaimable targets such as \`node_modules\`, Xcode DerivedData, Cargo \`target/\` build caches, stale Git worktrees, and package stores.
- **O(1) AI Watchdog & 8-Tool Stdio MCP Server**: Background daemon (\`launchd\`, \`systemd --user\`, or zero-UAC Windows Run key) monitors free space via zero-walk \`statvfs\` checks. Exposes 8 typed tools over stdio JSON-RPC (\`ruum mcp\` or audit-only \`ruum mcp --read-only\`):
  - Read-only / planning tools: \`list_volumes\`, \`scan_directory\`, \`inspect_subtree\`, \`find_reclaimable\`, \`check_git_safety\`, \`plan_removal\`
  - Human-gated mutating tools: \`trash_paths\` (GUI Confirm Cleanup checkbox required), \`delete_permanently\` (GUI approval + OS native Touch ID / auth required)
- **Docker Space Explorer & Local Volume Lock**: Inspects Images, Containers, Build Cache (splitting unique vs. image-shared bytes), and Local Volumes across local Docker Desktop / OrbStack and remote SSH \`dockerd\`. Local Volumes are locked \`Protected · Read-only\` at the core level and are never pruned by Ruum.
- **Zero-Sudo Remote SSH Streaming**: \`ruum ssh <host> <path>\` (and headless \`ruum ssh --check\`) detects remote OS/arch, uploads a checksum-verified static musl scanner to \`~/.cache/ruum/ssh/\`, and streams bounded records over a single compressed SSH pipe without storing the tree in remote RAM. Remote GUI sessions stay strictly export-only and generate preview-first cleanup scripts guarded by \`HostIdentity\` (\`hostname\` + \`/etc/machine-id\`).

## Safety Guardrails

- **OS & Mount-Point Refusal**: Unconditionally blocks filesystem roots, home directories, \`/usr\`, \`/etc\`, \`/nix/store\`, Homebrew prefixes, and Windows system trees.
- **Cloud-Safe & Snapshot-Aware**: Never triggers iCloud Drive or Dropbox hydration downloads; excludes Time Machine local snapshots.
- **Hook-Free Git Safety Checks**: Inspects dirty working trees, stashes, and unpushed commits with hooks, \`fsmonitor\`, and custom filters disabled.
- **Trash-First & Fail-Closed AI Gates**: Defaults to moving items to OS Trash; permanent deletions and mutating MCP calls fail closed without explicit desktop confirmation and OS native authentication.
- **Verified Supply Chain**: Every release ships Ed25519 manifests, \`SHA256SUMS\`, and Sigstore build provenance (\`gh attestation verify\`).

## Canonical Links

- Home (English): ${origin}/
- Download & Verification: ${origin}/download/
- Changelog: ${origin}/changelog/
- Chinese (简体中文): ${origin}/zh/
- Japanese (日本語): ${origin}/ja/
- Korean (한국어): ${origin}/ko/
- GitHub Repository & Releases: https://github.com/JsonLee12138/Ruum
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
