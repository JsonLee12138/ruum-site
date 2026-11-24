import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { HOME_NAV_SECTIONS, parseHomeNavHash, resolveHomeNavKey } from "../src/lib/nav-active.ts";

test("HOME_NAV_SECTIONS exposes capabilities and safety in document order", () => {
  assert.deepEqual(HOME_NAV_SECTIONS, ["capabilities", "safety"]);
});

test("parseHomeNavHash resolves #capabilities and #safety and ignores other hashes", () => {
  assert.equal(parseHomeNavHash("#capabilities"), "capabilities");
  assert.equal(parseHomeNavHash("#SAFETY"), "safety");
  assert.equal(parseHomeNavHash("capabilities"), "capabilities");
  assert.equal(parseHomeNavHash("#support"), null);
  assert.equal(parseHomeNavHash(""), null);
  assert.equal(parseHomeNavHash("#unknown"), null);
});

test("resolveHomeNavKey highlights home at top and switches across anchor sections", () => {
  const sections = [
    { key: "capabilities", top: 960 },
    { key: "safety", top: 2400 },
  ];

  assert.equal(
    resolveHomeNavKey({ scrollY: 0, viewportHeight: 900, docHeight: 3600, sections }),
    "home",
  );
  assert.equal(
    resolveHomeNavKey({ scrollY: 400, viewportHeight: 900, docHeight: 3600, sections }),
    "home",
  );
  // Landing via Lenis offset (-64px) on #capabilities
  assert.equal(
    resolveHomeNavKey({ scrollY: 960 - 64, viewportHeight: 900, docHeight: 3600, sections }),
    "capabilities",
  );
  // Scrolling inside #capabilities
  assert.equal(
    resolveHomeNavKey({ scrollY: 1600, viewportHeight: 900, docHeight: 3600, sections }),
    "capabilities",
  );
  // Landing via Lenis offset (-64px) on #safety
  assert.equal(
    resolveHomeNavKey({ scrollY: 2400 - 64, viewportHeight: 900, docHeight: 3600, sections }),
    "safety",
  );
  // Near bottom of document activates last section
  assert.equal(
    resolveHomeNavKey({ scrollY: 2685, viewportHeight: 900, docHeight: 3600, sections }),
    "safety",
  );
  // Empty sections list falls back safely to home
  assert.equal(
    resolveHomeNavKey({ scrollY: 1200, viewportHeight: 900, docHeight: 3600, sections: [] }),
    "home",
  );
});

test("Header.astro wires desktop & drawer anchor nav keys and mobile page active states", () => {
  const headerSrc = readFileSync(
    new URL("../src/components/Header.astro", import.meta.url),
    "utf8",
  );

  assert.match(headerSrc, /data-nav-subpath=\{subpath\}/);
  assert.match(headerSrc, /data-nav-key="home"/);
  assert.match(headerSrc, /data-nav-key="capabilities"/);
  assert.match(headerSrc, /data-nav-key="safety"/);
  assert.match(headerSrc, /data-nav-variant="desktop"/);
  assert.match(headerSrc, /data-nav-variant="drawer"/);
  assert.match(headerSrc, /subpath === 'download' \? 'text-amber font-semibold' : 'text-ink'/);
  assert.match(headerSrc, /subpath === 'changelog' \? 'text-amber font-semibold' : 'text-ink'/);
  assert.match(headerSrc, /resolveHomeNavKey/);
  assert.match(headerSrc, /parseHomeNavHash/);
});
