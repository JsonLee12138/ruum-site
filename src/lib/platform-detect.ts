import type { ReleaseAssetDownload } from "./releases-client";

export type DetectedOs = "macos" | "linux" | "windows";
export type DetectedArch = "aarch64" | "x86_64";
export type DetectionSource = "client-hints" | "ua" | "webgl" | "default";

export type DetectedPlatform = {
  os: DetectedOs;
  arch: DetectedArch;
  source: DetectionSource;
};

export type PlatformSignals = {
  ua?: string;
  platform?: string;
  uaDataPlatform?: string;
  uaDataArch?: string;
  webglRenderer?: string;
  webglHasEtc?: boolean;
};

interface NavigatorUADataLike {
  platform?: string;
  getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string; platform?: string }>;
}

type NavigatorWithUAData = Navigator & {
  userAgentData?: NavigatorUADataLike;
};

const PRIMARY_FORMAT: Record<DetectedOs, string> = {
  macos: ".dmg",
  windows: "-setup.exe",
  linux: "AppImage",
};

const SSR_FALLBACK: DetectedPlatform = {
  os: "macos",
  arch: "aarch64",
  source: "default",
};

function isNodeSsrRuntime(): boolean {
  if (typeof navigator === "undefined") return true;
  return typeof window === "undefined" && (navigator.userAgent ?? "").startsWith("Node.js");
}

function resolveOs(signals: PlatformSignals): DetectedOs {
  const uaDataPlatform = signals.uaDataPlatform?.trim();
  const osSource = (
    uaDataPlatform || `${signals.ua ?? ""} ${signals.platform ?? ""}`
  ).toLowerCase();
  if (osSource.includes("win")) return "windows";
  if (osSource.includes("mac")) return "macos";
  return "linux";
}

/** Parse OS and CPU architecture from browser Client Hints, UA/platform tokens, and WebGL hints. */
export function parsePlatformFromSignals(signals: PlatformSignals): DetectedPlatform {
  const os = resolveOs(signals);
  const uaDataArch = signals.uaDataArch?.trim().toLowerCase();

  if (uaDataArch === "arm" || uaDataArch === "arm64" || uaDataArch === "aarch64") {
    return { os, arch: "aarch64", source: "client-hints" };
  }
  if (uaDataArch === "x86" || uaDataArch === "x86_64" || uaDataArch === "x64") {
    return { os, arch: "x86_64", source: "client-hints" };
  }

  const uaAndPlatform = `${signals.ua ?? ""} ${signals.platform ?? ""}`;
  if (/\b(arm64|aarch64)\b/i.test(uaAndPlatform) || /woa64/i.test(uaAndPlatform)) {
    return { os, arch: "aarch64", source: "ua" };
  }
  if (/\b(x86_64|x64|win64|wow64|amd64)\b/i.test(uaAndPlatform)) {
    return { os, arch: "x86_64", source: "ua" };
  }

  if (os === "macos") {
    const renderer = signals.webglRenderer ?? "";
    const isSpecificAppleGpu = /apple/i.test(renderer) && !/apple gpu/i.test(renderer);
    if (isSpecificAppleGpu || signals.webglHasEtc === true) {
      return { os, arch: "aarch64", source: "webgl" };
    }
    if (/intel|amd|radeon/i.test(renderer)) {
      return { os, arch: "x86_64", source: "webgl" };
    }
  }

  return {
    os,
    arch: os === "macos" ? "aarch64" : "x86_64",
    source: "default",
  };
}

/** Synchronous platform detection safe during SSR and initial client mount. */
export function detectPlatformSync(): DetectedPlatform {
  if (isNodeSsrRuntime()) {
    return { ...SSR_FALLBACK };
  }
  const nav = navigator as NavigatorWithUAData;
  return parsePlatformFromSignals({
    ua: navigator.userAgent,
    platform: navigator.platform,
    uaDataPlatform: nav.userAgentData?.platform,
  });
}

function probeMacWebGl(): { webglRenderer?: string; webglHasEtc?: boolean } {
  if (typeof document === "undefined") return {};
  let gl: WebGLRenderingContext | null = null;
  let webglRenderer: string | undefined;
  let webglHasEtc: boolean | undefined;

  try {
    const canvas = document.createElement("canvas");
    gl =
      (canvas.getContext("webgl") as WebGLRenderingContext | null) ??
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const unmasked = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (typeof unmasked === "string") {
          webglRenderer = unmasked;
        }
      }
      const extensions = gl.getSupportedExtensions();
      if (Array.isArray(extensions)) {
        webglHasEtc = extensions.includes("WEBGL_compressed_texture_etc");
      }
    }
  } catch {
    // Ignore blocked or unavailable WebGL contexts.
  } finally {
    try {
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      // Ignore cleanup errors on synthetic or partial WebGL contexts.
    }
  }

  return { webglRenderer, webglHasEtc };
}

/** Asynchronous platform detection combining high-entropy Client Hints and WebGL fallback on macOS. */
export async function detectPlatformAsync(): Promise<DetectedPlatform> {
  if (isNodeSsrRuntime()) {
    return { ...SSR_FALLBACK };
  }

  const nav = navigator as NavigatorWithUAData;
  let uaDataPlatform = nav.userAgentData?.platform;
  let uaDataArch: string | undefined;

  if (typeof nav.userAgentData?.getHighEntropyValues === "function") {
    try {
      const hints = await nav.userAgentData.getHighEntropyValues(["architecture", "platform"]);
      if (hints.platform) uaDataPlatform = hints.platform;
      if (hints.architecture) uaDataArch = hints.architecture;
    } catch {
      // Ignore denied high-entropy hints and fall back cleanly.
    }
  }

  const baseSignals: PlatformSignals = {
    ua: navigator.userAgent,
    platform: navigator.platform,
    uaDataPlatform,
    uaDataArch,
  };
  const initial = parsePlatformFromSignals(baseSignals);

  if (initial.os === "macos" && initial.source === "default" && typeof document !== "undefined") {
    const webgl = probeMacWebGl();
    return parsePlatformFromSignals({
      ...baseSignals,
      ...webgl,
    });
  }

  return initial;
}

function matchesArch(asset: ReleaseAssetDownload, arch: DetectedArch): boolean {
  return asset.arch === arch || asset.arch === "universal";
}

/** Select the primary recommended installer for the detected OS and CPU architecture. */
export function pickRecommendedArtifact(
  artifacts: ReleaseAssetDownload[],
  os: DetectedOs,
  arch: DetectedArch,
): ReleaseAssetDownload | null {
  if (artifacts.length === 0) return null;
  const preferredFormat = PRIMARY_FORMAT[os];
  return (
    artifacts.find((a) => a.arch === arch && a.format === preferredFormat) ??
    artifacts.find((a) => a.arch === "universal" && a.format === preferredFormat) ??
    artifacts.find((a) => a.arch === arch) ??
    artifacts.find((a) => a.arch === "universal") ??
    artifacts.find((a) => a.format === preferredFormat) ??
    artifacts[0] ??
    null
  );
}

/** Return alternative package formats matching the active architecture, excluding the primary artifact. */
export function pickSiblingArtifacts(
  artifacts: ReleaseAssetDownload[],
  primary: ReleaseAssetDownload | null,
  arch: DetectedArch,
): ReleaseAssetDownload[] {
  return artifacts.filter((a) => matchesArch(a, arch) && a.filename !== primary?.filename);
}
