import fs from "node:fs";
import path from "node:path";

const REPO = "JsonLee12138/Ruum";
const WORKER_ORIGIN = "https://ruum-updates.jsonlee12138.com";
const OUT_PATH = path.resolve(process.cwd(), "src/data/releases.json");

async function fetchWithTimeout(url, headers = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { headers, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function classifyAsset(asset) {
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

  const arch =
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
      size: asset.size,
    };
  }
  return null;
}

function normalizeRelease(rawRelease) {
  if (!rawRelease) return null;
  const assets = Array.isArray(rawRelease.assets) ? rawRelease.assets : [];
  const assetByName = new Map(assets.map((a) => [a.name, a]));
  const downloads = { macos: [], linux: [], windows: [] };

  for (const asset of assets) {
    const classified = classifyAsset(asset);
    if (!classified) continue;
    const shaAsset = assetByName.get(`${asset.name}.sha256`);
    downloads[classified.os].push({
      arch: classified.arch,
      format: classified.format,
      label: classified.label,
      filename: classified.filename,
      url: classified.url,
      sha256Url: shaAsset ? shaAsset.browser_download_url : null,
      size: classified.size,
    });
  }

  const sumsAsset = assetByName.get("SHA256SUMS");
  const caskAsset = assetByName.get("ruum.rb");

  return {
    tag: rawRelease.tag_name,
    name: rawRelease.name || rawRelease.tag_name,
    publishedAt: rawRelease.published_at,
    prerelease: Boolean(rawRelease.prerelease),
    htmlUrl: rawRelease.html_url,
    sha256sumsUrl: sumsAsset ? sumsAsset.browser_download_url : null,
    homebrewCaskUrl: caskAsset ? caskAsset.browser_download_url : null,
    downloads,
  };
}

function parseChangelog(markdown, releaseMap) {
  if (!markdown) return [];
  const lines = markdown.split(/\r?\n/);
  const entries = [];
  let current = null;
  let currentSection = null;

  for (const line of lines) {
    const versionMatch = line.match(/^##\s+\[([^\]]+)\]\s*-\s*(\S+)/);
    if (versionMatch) {
      if (current) entries.push(current);
      const version = versionMatch[1].trim();
      const date = versionMatch[2].trim();
      const tag = version.startsWith("v") ? version : `v${version}`;
      const matchedRelease = releaseMap.get(tag) || releaseMap.get(version);
      current = {
        version,
        tag,
        date,
        prerelease:
          version.includes("-beta") || version.includes("-alpha") || version.includes("-rc"),
        releaseUrl: matchedRelease?.html_url || `https://github.com/${REPO}/releases/tag/${tag}`,
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

async function main() {
  const ghHeaders = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ruum-site-sync/1.0",
  };
  if (process.env.GITHUB_TOKEN) {
    ghHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [repoRes, releasesRes, changelogRes] = await Promise.all([
      fetchWithTimeout(`https://api.github.com/repos/${REPO}`, ghHeaders),
      fetchWithTimeout(`https://api.github.com/repos/${REPO}/releases?per_page=15`, ghHeaders),
      fetchWithTimeout(`https://raw.githubusercontent.com/${REPO}/main/CHANGELOG.md`, {
        "User-Agent": "ruum-site-sync/1.0",
      }),
    ]);

    if (!releasesRes.ok) {
      throw new Error(`GitHub releases API returned ${releasesRes.status}`);
    }

    const repoData = repoRes.ok ? await repoRes.json() : null;
    const releases = await releasesRes.json();
    const changelogText = changelogRes.ok ? await changelogRes.text() : "";

    const releaseMap = new Map();
    for (const rel of releases) {
      if (rel?.tag_name) {
        releaseMap.set(rel.tag_name, rel);
      }
    }

    const stableRaw =
      releases.find((r) => !r.draft && !r.prerelease) || releases.find((r) => !r.draft) || null;
    const betaRaw = releases.find((r) => !r.draft && r.prerelease) || null;

    const payload = {
      generatedAt: new Date().toISOString(),
      repo: REPO,
      workerOrigin: WORKER_ORIGIN,
      stars: typeof repoData?.stargazers_count === "number" ? repoData.stargazers_count : 8,
      stable: normalizeRelease(stableRaw),
      beta: normalizeRelease(betaRaw),
      changelog: parseChangelog(changelogText, releaseMap),
    };

    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    console.log(
      `[sync-releases] Updated ${OUT_PATH} (stable: ${payload.stable?.tag ?? "none"}, beta: ${payload.beta?.tag ?? "none"}, changelog entries: ${payload.changelog.length})`,
    );
  } catch (error) {
    if (fs.existsSync(OUT_PATH)) {
      console.warn(
        `[sync-releases] Network sync skipped (${error.message}); preserving existing ${OUT_PATH}`,
      );
      return;
    }
    throw error;
  }
}

main().catch((err) => {
  console.error("[sync-releases] Fatal error:", err);
  process.exit(1);
});
