# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary — AI-era developers (macOS, Linux, Windows):** Engineers running local coding agents, Docker/OrbStack, package stores, and language toolchains whose drives fill up unexpectedly and who need to see what is safe to reclaim without risking uncommitted Git repositories, active worktrees, or container databases.
- **Secondary — DevOps, SRE, and server operators:** Engineers diagnosing disk pressure on remote Linux/SSH hosts and remote Docker daemons who require zero-sudo inspection and auditable, host-verified cleanup steps.

## Product Purpose

`ruum-site` (`https://ruum.jsonlee12138.com`) is the official product, download, and release site for **ruum** — a free, open-source (`GPL-3.0-only`), cross-platform disk space analyzer built in Rust with GPUI (`https://github.com/JsonLee12138/Ruum`).

It exists to let visitors evaluate how `ruum` visualizes and safely reclaims disk space across local drives, Docker storage, and remote SSH hosts before installing, and to guide them to a fast, verifiable installation (one-line installer, package manager, or direct package with SHA-256 and Sigstore provenance). Success means visitors quickly understand the safety model and complete a confident install for their platform.

## Positioning

A neighboring disk-space utility cannot truthfully copy this combination of core mechanisms:

- **Native Rust + GPUI treemap with dual visual encoding:** Proportional tile area maps to real allocated disk blocks (plus Windows NTFS MFT direct read, hardlink inode deduplication, and memoized root widening), while category color and diagonal hatching distinguish active data from safely reclaimable targets.
- **Docker Space Explorer with core-level volume lock:** Inspects Images, Containers, Build Cache (splitting unique vs. image-shared bytes), and Local Volumes across local and SSH daemons, while keeping Local Volumes strictly `Protected · Read-only` at the core level so database and persistent state cannot be selected or pruned.
- **Zero-sudo remote SSH streaming and export-only cleanup:** Uploads a checksum-verified static musl scanner (`~/.cache/ruum/ssh/`) and streams bounded records without holding the tree in remote RAM. Remote GUI sessions stay export-only and generate preview-first delete scripts guarded by `HostIdentity` (`hostname` + `/etc/machine-id`) checks.
- **O(1) AI Watchdog + 8-tool headless stdio MCP server:** Monitors free space via zero-walk `statvfs` checks and connects AI agents (`ruum mcp` / `ruum mcp --read-only`), while all mutating operations fail closed without explicit human confirmation (desktop GUI checkbox approval + OS native Touch ID auth).
- **Rust-enforced guardrails & signed supply chain:** Unconditionally blocks OS/system/mount-point roots, avoids iCloud Drive/Dropbox hydration and Time Machine local snapshots, performs hook-free Git safety checks, defaults to Trash, and ships Ed25519 manifests, `SHA256SUMS`, and Sigstore attestations.

## Operating Context

- Visitors evaluate `ruum` across desktop (macOS, Linux, Windows) and mobile browsers, interacting with the 4-workspace landing sandbox (Explore, Docker, Watchdog, Remote SSH), toggling the unedited macOS screenshot, copying an OS-detected install command, inspecting checksums/platform setup notes on `/download`, and reviewing releases on `/changelog`.
- Release artifacts and changelog entries sync from `JsonLee12138/Ruum` at build time via `scripts/sync-releases.mjs` into `src/data/releases.json` and refresh client-side via `src/lib/releases-client.ts`; shell/PowerShell install scripts are served from `https://ruum-updates.jsonlee12138.com`.
- Current site surfaces are `/` (Landing), `/download` (Download & Verification Center), and `/changelog` (Release History), mirrored across `/`, `/zh/`, `/ja/`, and `/ko/`.

## Capabilities and Constraints

- **Static, zero-backend architecture:** Built as a static Astro site (`output: "static"`) with no backend service, user accounts, or server-side database (`public/_headers` targets static hosting).
- **Strict 4-locale parity:** Every surface, route, metadata block, `hreflang` link, and interactive control must stay synchronized across `en` (default, unprefixed), `zh`, `ja`, and `ko` (`src/i18n/`).
- **Licensing & distribution:** The `ruum` application is free and open-source under `GPL-3.0-only` (built by `JsonLee12138`); the `ruum-site` repository is MIT-licensed (`LICENSE`).
- **Platform support documented on-site:** Desktop GUI + CLI for macOS (`aarch64`/`x86_64`), Linux (`aarch64`/`x86_64`, Wayland/X11 + Vulkan), Windows (`aarch64`/`x86_64`, optional Admin NTFS MFT direct read), plus headless server `--cli-only`.
- **Canonical terminology:** `ruum` (lowercase), GPUI treemap, Reclaimable / Hatched, Watchdog (`statvfs`), stdio MCP (`ruum mcp`, `--read-only`), `HostIdentity` guard, Local Volumes (`Protected · Read-only`), Ed25519 + SHA-256 + Sigstore provenance.
- **Explicitly undecided:**
  - Whether dedicated on-site documentation/guide pages (e.g., `/docs` for MCP, SSH, and Watchdog configuration) will be added later or remain on GitHub.
  - Whether a formal accessibility compliance standard beyond standard semantic web controls will be targeted later.

## Brand Commitments

- **Name & etymology:** Always written lowercase as `ruum`, derived from the Old Norse _rúm_ (spaciousness, open room) — giving drives open breathing room again.
- **Voice:** Grounded, precise, engineering-first; explains concrete Rust/OS mechanisms and verification commands plainly without hype.
- **Existing brand assets:** `public/ruum.svg` (logo mark), `public/favicon.svg`, `public/og-image.svg`, `public/og-image.png`.
- **Canonical links:** `https://ruum.jsonlee12138.com`, `https://github.com/JsonLee12138/Ruum`, `https://ruum-updates.jsonlee12138.com`.

## Evidence on Hand

- **Real desktop capture:** `public/screenshot.png` (unedited macOS desktop screenshot).
- **Brand & social graphics:** `public/ruum.svg`, `public/favicon.svg`, `public/og-image.png`, `public/og-image.svg`.
- **Motion assets:** `src/data/lottie/scan-monolith.json`, `src/data/lottie/watchdog-pulse.json`.
- **Verified release & changelog data:** `src/data/releases.json` (real GitHub Releases tags, binary sizes, `.sha256` & `SHA256SUMS` links, Homebrew cask, parsed `CHANGELOG.md`, GitHub star count).
- **Interactive sandbox:** `src/components/HeroSandbox.tsx` demonstrates core workflows with clearly labeled sample data ("Sample data").
- **Absences (do not fabricate):** No customer testimonials, user/company logos, third-party case studies, press coverage, formal cross-tool speed benchmarks, Linux/Windows desktop screenshots, or commercial/paid tiers.

## Product Principles

1. **Verifiable safety over vague reassurance** — Pair every cleanup capability with the concrete Rust, OS, or cryptographic boundary that makes it safe.
2. **Fast path to a trusted install** — Make platform-matched install commands, checksums, and provenance verification effortless to reach without sacrificing clarity.
3. **Show real mechanics, label simulations honestly** — Let visitors inspect real behavior via the interactive demo and unedited screenshot while keeping simulated data explicitly marked and never inventing proof.
4. **Four-locale parity on a static footprint** — Maintain complete feature and copy alignment across `en`, `zh`, `ja`, and `ko` while preserving the static, zero-backend architecture.
