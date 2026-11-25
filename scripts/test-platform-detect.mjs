import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  detectPlatformAsync,
  detectPlatformSync,
  parsePlatformFromSignals,
  pickRecommendedArtifact,
  pickSiblingArtifacts,
} from "../src/lib/platform-detect.ts";

const releases = JSON.parse(
  readFileSync(new URL("../src/data/releases.json", import.meta.url), "utf8"),
);

test("Client Hints resolve Windows ARM64 and x86_64", () => {
  assert.deepEqual(
    parsePlatformFromSignals({
      uaDataPlatform: "Windows",
      uaDataArch: "arm",
      ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    }),
    { os: "windows", arch: "aarch64", source: "client-hints" },
  );

  assert.deepEqual(
    parsePlatformFromSignals({
      uaDataPlatform: "Windows",
      uaDataArch: "x86",
      ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    }),
    { os: "windows", arch: "x86_64", source: "client-hints" },
  );
});

test("Client Hints resolve macOS arm and x86 over frozen MacIntel UA", () => {
  const frozenMacUa =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/130.0.0.0";

  assert.deepEqual(
    parsePlatformFromSignals({
      uaDataPlatform: "macOS",
      uaDataArch: "arm",
      ua: frozenMacUa,
      platform: "MacIntel",
    }),
    { os: "macos", arch: "aarch64", source: "client-hints" },
  );

  assert.deepEqual(
    parsePlatformFromSignals({
      uaDataPlatform: "macOS",
      uaDataArch: "x86",
      ua: frozenMacUa,
      platform: "MacIntel",
    }),
    { os: "macos", arch: "x86_64", source: "client-hints" },
  );
});

test("macOS frozen UA uses WebGL Apple Silicon / ETC hints and never treats MacIntel as x86_64", () => {
  const safariMacUa =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15";

  assert.deepEqual(
    parsePlatformFromSignals({
      ua: safariMacUa,
      platform: "MacIntel",
      webglRenderer: "ANGLE (Apple, Apple M3 Pro, OpenGL 4.1)",
    }),
    { os: "macos", arch: "aarch64", source: "webgl" },
  );

  assert.deepEqual(
    parsePlatformFromSignals({
      ua: safariMacUa,
      platform: "MacIntel",
      webglRenderer: "Apple GPU",
      webglHasEtc: true,
    }),
    { os: "macos", arch: "aarch64", source: "webgl" },
  );

  // Masked "Apple GPU" without ETC falls back to default rather than falsely claiming WebGL match.
  assert.deepEqual(
    parsePlatformFromSignals({
      ua: safariMacUa,
      platform: "MacIntel",
      webglRenderer: "Apple GPU",
      webglHasEtc: false,
    }),
    { os: "macos", arch: "aarch64", source: "default" },
  );

  assert.deepEqual(
    parsePlatformFromSignals({
      ua: safariMacUa,
      platform: "MacIntel",
      webglRenderer: "Intel(R) Iris(TM) Plus Graphics OpenGL Engine",
      webglHasEtc: false,
    }),
    { os: "macos", arch: "x86_64", source: "webgl" },
  );

  assert.deepEqual(
    parsePlatformFromSignals({
      ua: safariMacUa,
      platform: "MacIntel",
      webglRenderer: "AMD Radeon Pro 5500M OpenGL Engine",
    }),
    { os: "macos", arch: "x86_64", source: "webgl" },
  );

  assert.deepEqual(
    parsePlatformFromSignals({
      ua: safariMacUa,
      platform: "MacIntel",
    }),
    { os: "macos", arch: "aarch64", source: "default" },
  );
});

test("Windows and Linux UA tokens and defaults resolve accurately", () => {
  assert.deepEqual(
    parsePlatformFromSignals({
      ua: "Mozilla/5.0 (Windows NT 10.0; WOW64; WOA64)",
      platform: "Win32",
    }),
    { os: "windows", arch: "aarch64", source: "ua" },
  );

  assert.deepEqual(
    parsePlatformFromSignals({
      ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      platform: "Win32",
    }),
    { os: "windows", arch: "x86_64", source: "ua" },
  );

  assert.deepEqual(
    parsePlatformFromSignals({
      ua: "Mozilla/5.0 (X11; Linux aarch64) Gecko/20100101 Firefox/131.0",
      platform: "Linux aarch64",
    }),
    { os: "linux", arch: "aarch64", source: "ua" },
  );

  assert.deepEqual(
    parsePlatformFromSignals({
      ua: "Mozilla/5.0 (X11; Linux) AppleWebKit/537.36",
      platform: "Linux",
    }),
    { os: "linux", arch: "x86_64", source: "default" },
  );
});

test("detectPlatformSync returns safe macOS aarch64 default in Node SSR", () => {
  assert.deepEqual(detectPlatformSync(), { os: "macos", arch: "aarch64", source: "default" });
});

test("detectPlatformAsync probes WebGL on unresolved macOS and cleans up context", async () => {
  const originalNavigatorDesc = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  const originalDocumentDesc = Object.getOwnPropertyDescriptor(globalThis, "document");
  const originalWindowDesc = Object.getOwnPropertyDescriptor(globalThis, "window");

  let loseContextCalled = false;

  const mockGl = {
    getExtension(name) {
      if (name === "WEBGL_debug_renderer_info") {
        return { UNMASKED_RENDERER_WEBGL: 0x9246 };
      }
      if (name === "WEBGL_lose_context") {
        return {
          loseContext() {
            loseContextCalled = true;
          },
        };
      }
      return null;
    },
    getParameter(param) {
      return param === 0x9246 ? "Intel(R) UHD Graphics 630" : null;
    },
    getSupportedExtensions() {
      return ["OES_texture_float"];
    },
  };

  Object.defineProperty(globalThis, "window", {
    value: {},
    configurable: true,
    writable: true,
  });
  Object.defineProperty(globalThis, "navigator", {
    value: {
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15",
      platform: "MacIntel",
    },
    configurable: true,
    writable: true,
  });
  Object.defineProperty(globalThis, "document", {
    value: {
      createElement(tag) {
        assert.equal(tag, "canvas");
        return {
          getContext(kind) {
            return kind === "webgl" ? mockGl : null;
          },
        };
      },
    },
    configurable: true,
    writable: true,
  });

  try {
    const result = await detectPlatformAsync();
    assert.deepEqual(result, { os: "macos", arch: "x86_64", source: "webgl" });
    assert.equal(loseContextCalled, true);
  } finally {
    if (originalNavigatorDesc) {
      Object.defineProperty(globalThis, "navigator", originalNavigatorDesc);
    } else {
      delete globalThis.navigator;
    }
    if (originalDocumentDesc) {
      Object.defineProperty(globalThis, "document", originalDocumentDesc);
    } else {
      delete globalThis.document;
    }
    if (originalWindowDesc) {
      Object.defineProperty(globalThis, "window", originalWindowDesc);
    } else {
      delete globalThis.window;
    }
  }
});

test("pickRecommendedArtifact and pickSiblingArtifacts select primary format and arch-matched siblings", () => {
  const { macos, linux, windows } = releases.stable.downloads;
  const version = releases.stable.tag.replace(/^v/, "");

  // macOS aarch64 -> .dmg primary, [.pkg, .zip] siblings
  const macPrimary = pickRecommendedArtifact(macos, "macos", "aarch64");
  assert.equal(macPrimary?.filename, `ruum-${version}-aarch64-macos.dmg`);
  assert.deepEqual(
    pickSiblingArtifacts(macos, macPrimary, "aarch64").map((a) => a.format),
    [".pkg", ".zip"],
  );

  // macOS x86_64 -> x86_64 .dmg primary, x86_64 [.pkg, .zip] siblings
  const macIntelPrimary = pickRecommendedArtifact(macos, "macos", "x86_64");
  assert.equal(macIntelPrimary?.filename, `ruum-${version}-x86_64-macos.dmg`);
  assert.deepEqual(
    pickSiblingArtifacts(macos, macIntelPrimary, "x86_64").map((a) => a.arch),
    ["x86_64", "x86_64"],
  );

  // Linux aarch64 -> AppImage primary even though .deb comes first in JSON
  const linuxPrimary = pickRecommendedArtifact(linux, "linux", "aarch64");
  assert.equal(linuxPrimary?.format, "AppImage");
  assert.equal(linuxPrimary?.arch, "aarch64");
  assert.deepEqual(
    pickSiblingArtifacts(linux, linuxPrimary, "aarch64").map((a) => a.format),
    [".deb", ".rpm", ".tar.gz"],
  );

  // Windows x86_64 -> -setup.exe primary, [.msi, .zip] siblings
  const winPrimary = pickRecommendedArtifact(windows, "windows", "x86_64");
  assert.equal(winPrimary?.format, "-setup.exe");
  assert.equal(winPrimary?.arch, "x86_64");
  assert.deepEqual(
    pickSiblingArtifacts(windows, winPrimary, "x86_64").map((a) => a.format),
    [".msi", ".zip"],
  );

  // Universal fallback + empty array safety
  const universalOnly = [
    {
      arch: "universal",
      format: ".dmg",
      label: "Universal (.dmg)",
      filename: "ruum-universal.dmg",
      url: "https://example.com/ruum-universal.dmg",
      sha256Url: null,
      size: 1024,
    },
    {
      arch: "universal",
      format: ".zip",
      label: "Universal (.zip)",
      filename: "ruum-universal.zip",
      url: "https://example.com/ruum-universal.zip",
      sha256Url: null,
      size: 1024,
    },
  ];
  const uniPrimary = pickRecommendedArtifact(universalOnly, "macos", "x86_64");
  assert.equal(uniPrimary?.filename, "ruum-universal.dmg");
  assert.deepEqual(
    pickSiblingArtifacts(universalOnly, uniPrimary, "x86_64").map((a) => a.filename),
    ["ruum-universal.zip"],
  );

  assert.equal(pickRecommendedArtifact([], "linux", "x86_64"), null);
  assert.deepEqual(pickSiblingArtifacts([], null, "x86_64"), []);
});
