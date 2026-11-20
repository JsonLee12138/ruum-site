export interface ReleaseAssetDownload {
  arch: "aarch64" | "x86_64" | "universal";
  format: string;
  label: string;
  filename: string;
  url: string;
  sha256Url: string | null;
  size: number;
}

export interface NormalizedRelease {
  tag: string;
  name: string;
  publishedAt: string;
  prerelease: boolean;
  htmlUrl: string;
  sha256sumsUrl: string | null;
  homebrewCaskUrl: string | null;
  downloads: {
    macos: ReleaseAssetDownload[];
    linux: ReleaseAssetDownload[];
    windows: ReleaseAssetDownload[];
  };
}

export interface ChangelogEntry {
  version: string;
  tag: string;
  date: string;
  prerelease: boolean;
  releaseUrl: string;
  sections: {
    features: string[];
    fixes: string[];
    improvements: string[];
  };
}

export interface ReleasesPayload {
  generatedAt: string;
  repo: string;
  workerOrigin: string;
  stars: number;
  stable: NormalizedRelease | null;
  beta: NormalizedRelease | null;
  changelog: ChangelogEntry[];
}

const CACHE_KEY = "ruum-releases-live-v1";
const CACHE_TTL_MS = 10 * 60 * 1000;

interface GitHubAssetRaw {
  name: string;
  browser_download_url: string;
  size: number;
}

interface GitHubReleaseRaw {
  tag_name: string;
  name: string | null;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
  html_url: string;
  assets: GitHubAssetRaw[];
}

function classifyAsset(
  asset: GitHubAssetRaw,
): (ReleaseAssetDownload & { os: "macos" | "linux" | "windows" }) | null {
  const name = asset.name || "";
  if (
    name.endsWith(".sha256") ||
    name === "SHA256SUMS" ||
    name.endsWith(".sig") ||
    name === "manifest.json" ||
    name.endsWith(".wixpdb") ||
    name === "ruum.rb"
  ) {
    return null;
  }

  const arch: "aarch64" | "x86_64" | "universal" =
    name.includes("aarch64") || name.includes("arm64")
      ? "aarch64"
      : name.includes("x86_64")
        ? "x86_64"
        : "universal";

  if (name.includes("-macos.dmg") || name.endsWith(".dmg")) {
    return {
      os: "macos",
      arch,
      format: ".dmg",
      label: "Disk Image (.dmg)",
      filename: name,
      url: asset.browser_download_url,
      sha256Url: null,
      size: asset.size,
    };
  }
  if (name.includes("-macos.pkg") || name.endsWith(".pkg")) {
    return {
      os: "macos",
      arch,
      format: ".pkg",
      label: "Installer (.pkg)",
      filename: name,
      url: asset.browser_download_url,
      sha256Url: null,
      size: asset.size,
    };
  }
  if (name.includes("-macos.zip")) {
    return {
      os: "macos",
      arch,
      format: ".zip",
      label: "App Archive (.zip)",
      filename: name,
      url: asset.browser_download_url,
      sha256Url: null,
      size: asset.size,
    };
  }
  if (name.endsWith(".deb")) {
    return {
      os: "linux",
      arch,
      format: ".deb",
      label: "Debian / Ubuntu (.deb)",
      filename: name,
      url: asset.browser_download_url,
      sha256Url: null,
      size: asset.size,
    };
  }
  if (name.endsWith(".rpm")) {
    return {
      os: "linux",
      arch,
      format: ".rpm",
      label: "Fedora / RHEL (.rpm)",
      filename: name,
      url: asset.browser_download_url,
      sha256Url: null,
      size: asset.size,
    };
  }
  if (name.endsWith(".AppImage")) {
    return {
      os: "linux",
      arch,
      format: "AppImage",
      label: "AppImage",
      filename: name,
      url: asset.browser_download_url,
      sha256Url: null,
      size: asset.size,
    };
  }
  if (name.includes("-linux.tar.gz")) {
    return {
      os: "linux",
      arch,
      format: ".tar.gz",
      label: "Portable Tarball (.tar.gz)",
      filename: name,
      url: asset.browser_download_url,
      sha256Url: null,
      size: asset.size,
    };
  }
  if (name.includes("-windows-setup.exe")) {
    return {
      os: "windows",
      arch,
      format: "-setup.exe",
      label: "Installer Wizard (.exe)",
      filename: name,
      url: asset.browser_download_url,
      sha256Url: null,
      size: asset.size,
    };
  }
  if (name.endsWith(".msi")) {
    return {
      os: "windows",
      arch,
      format: ".msi",
      label: "MSI Package (.msi)",
      filename: name,
      url: asset.browser_download_url,
      sha256Url: null,
      size: asset.size,
    };
  }
  if (name.includes("-windows.zip")) {
    return {
      os: "windows",
      arch,
      format: ".zip",
      label: "Portable ZIP (.zip)",
      filename: name,
      url: asset.browser_download_url,
      sha256Url: null,
      size: asset.size,
    };
  }
  return null;
}

function normalizeRawRelease(raw: GitHubReleaseRaw | undefined): NormalizedRelease | null {
  if (!raw) return null;
  const assetByName = new Map(raw.assets.map((a) => [a.name, a]));
  const downloads: NormalizedRelease["downloads"] = { macos: [], linux: [], windows: [] };

  for (const asset of raw.assets) {
    const classified = classifyAsset(asset);
    if (!classified) continue;
    const shaAsset = assetByName.get(`${asset.name}.sha256`);
    const { os, ...rest } = classified;
    downloads[os].push({
      ...rest,
      sha256Url: shaAsset ? shaAsset.browser_download_url : null,
    });
  }

  return {
    tag: raw.tag_name,
    name: raw.name || raw.tag_name,
    publishedAt: raw.published_at,
    prerelease: Boolean(raw.prerelease),
    htmlUrl: raw.html_url,
    sha256sumsUrl: assetByName.get("SHA256SUMS")?.browser_download_url ?? null,
    homebrewCaskUrl: assetByName.get("ruum.rb")?.browser_download_url ?? null,
    downloads,
  };
}

export async function refreshLatestReleases(fallback: ReleasesPayload): Promise<ReleasesPayload> {
  if (typeof window === "undefined") return fallback;

  try {
    const cachedRaw = sessionStorage.getItem(CACHE_KEY);
    if (cachedRaw) {
      const parsed = JSON.parse(cachedRaw) as { at: number; data: ReleasesPayload };
      if (Date.now() - parsed.at < CACHE_TTL_MS) {
        return parsed.data;
      }
    }

    const res = await fetch(`https://api.github.com/repos/${fallback.repo}/releases?per_page=8`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return fallback;

    const list = (await res.json()) as GitHubReleaseRaw[];
    const stable =
      normalizeRawRelease(list.find((r) => !r.draft && !r.prerelease)) ?? fallback.stable;
    const beta = normalizeRawRelease(list.find((r) => !r.draft && r.prerelease)) ?? fallback.beta;
    const updated: ReleasesPayload = { ...fallback, stable, beta };

    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: updated }));
    return updated;
  } catch {
    return fallback;
  }
}

export function parseChangelogMarkdown(
  markdown: string,
  repo = "JsonLee12138/Ruum",
): ChangelogEntry[] {
  if (!markdown) return [];
  const lines = markdown.split(/\r?\n/);
  const entries: ChangelogEntry[] = [];
  let current: ChangelogEntry | null = null;
  let currentSection: "features" | "fixes" | "improvements" | null = null;

  for (const line of lines) {
    const versionMatch = line.match(/^##\s+\[([^\]]+)\]\s*-\s*(\S+)/);
    if (versionMatch) {
      if (current) entries.push(current);
      const version = versionMatch[1].trim();
      const date = versionMatch[2].trim();
      const tag = version.startsWith("v") ? version : `v${version}`;
      current = {
        version,
        tag,
        date,
        prerelease:
          version.includes("-beta") || version.includes("-alpha") || version.includes("-rc"),
        releaseUrl: `https://github.com/${repo}/releases/tag/${tag}`,
        sections: {
          features: [],
          fixes: [],
          improvements: [],
        },
      };
      currentSection = null;
      continue;
    }

    if (!current) continue;

    const sectionMatch = line.match(/^###\s+(.+)$/);
    if (sectionMatch) {
      const heading = sectionMatch[1].trim().toLowerCase();
      if (heading.includes("feature")) currentSection = "features";
      else if (heading.includes("fix")) currentSection = "fixes";
      else currentSection = "improvements";
      continue;
    }

    const bulletMatch = line.match(/^\s*[-*]\s+(.+)$/);
    if (bulletMatch && currentSection) {
      current.sections[currentSection].push(bulletMatch[1].trim());
    }
  }

  if (current) entries.push(current);
  return entries;
}

const CHANGELOG_CACHE_KEY = "ruum-changelog-live-v1";

export async function refreshLatestChangelog(
  fallback: ChangelogEntry[],
  repo = "JsonLee12138/Ruum",
): Promise<{ entries: ChangelogEntry[]; live: boolean }> {
  if (typeof window === "undefined") return { entries: fallback, live: false };

  try {
    const cachedRaw = sessionStorage.getItem(CHANGELOG_CACHE_KEY);
    if (cachedRaw) {
      const parsed = JSON.parse(cachedRaw) as { at: number; entries: ChangelogEntry[] };
      if (Date.now() - parsed.at < CACHE_TTL_MS && parsed.entries.length > 0) {
        return { entries: parsed.entries, live: true };
      }
    }

    const res = await fetch(`https://raw.githubusercontent.com/${repo}/main/CHANGELOG.md`);
    if (!res.ok) return { entries: fallback, live: false };

    const markdown = await res.text();
    const parsedEntries = parseChangelogMarkdown(markdown, repo);
    if (parsedEntries.length === 0) return { entries: fallback, live: false };

    sessionStorage.setItem(
      CHANGELOG_CACHE_KEY,
      JSON.stringify({ at: Date.now(), entries: parsedEntries }),
    );
    return { entries: parsedEntries, live: true };
  } catch {
    return { entries: fallback, live: false };
  }
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "—";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}
