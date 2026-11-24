import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { en } from "../src/i18n/en.ts";
import { ja } from "../src/i18n/ja.ts";
import { ko } from "../src/i18n/ko.ts";
import { zh } from "../src/i18n/zh.ts";

const LOCALES = { en, zh, ja, ko };

const ALLOWED_LOWERCASE_RUUM_TOKENS = [
  "~/.cache/ruum/ssh/",
  "~/.cache/ruum/ssh",
  "/Applications/ruum.app",
  "ruum ssh prod-eu-01 /var",
  "ruum ssh --check",
  "ruum mcp --read-only",
  "ruum mcp",
];

function readRepoFile(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

function assertNonEmptyString(value, label) {
  assert.equal(typeof value, "string", `${label} must be a string`);
  assert.ok(value.trim().length > 0, `${label} must be non-empty`);
}

function collectStringLeaves(node, path, skipPaths, out = []) {
  if (skipPaths.has(path)) {
    return out;
  }
  if (typeof node === "string") {
    out.push({ path, value: node });
    return out;
  }
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i += 1) {
      collectStringLeaves(node[i], `${path}[${i}]`, skipPaths, out);
    }
    return out;
  }
  if (node && typeof node === "object") {
    for (const [key, val] of Object.entries(node)) {
      const nextPath = path ? `${path}.${key}` : key;
      collectStringLeaves(val, nextPath, skipPaths, out);
    }
  }
  return out;
}

function stripAllowedLowercaseTokens(text) {
  let sanitized = text.replace(/`[^`]+`/g, " ");
  for (const token of ALLOWED_LOWERCASE_RUUM_TOKENS) {
    sanitized = sanitized.replaceAll(token, " ");
  }
  return sanitized;
}

test("4-locale SEO contract fields are defined and non-empty", () => {
  for (const [locale, copy] of Object.entries(LOCALES)) {
    assertNonEmptyString(copy.meta.homeTitle, `${locale}.meta.homeTitle`);
    assertNonEmptyString(copy.meta.homeDescription, `${locale}.meta.homeDescription`);
    assertNonEmptyString(copy.meta.downloadTitle, `${locale}.meta.downloadTitle`);
    assertNonEmptyString(copy.meta.downloadDescription, `${locale}.meta.downloadDescription`);
    assertNonEmptyString(copy.meta.changelogTitle, `${locale}.meta.changelogTitle`);
    assertNonEmptyString(copy.meta.changelogDescription, `${locale}.meta.changelogDescription`);

    assertNonEmptyString(copy.meta.keywords, `${locale}.meta.keywords`);
    assert.ok(
      copy.meta.keywords.includes("Ruum"),
      `${locale}.meta.keywords must include capitalized "Ruum"`,
    );
    assert.ok(
      copy.meta.keywords.includes("ruum"),
      `${locale}.meta.keywords must include lowercase "ruum"`,
    );

    assertNonEmptyString(copy.meta.ogImageAlt, `${locale}.meta.ogImageAlt`);
    assertNonEmptyString(copy.meta.applicationSubCategory, `${locale}.meta.applicationSubCategory`);

    assert.ok(
      Array.isArray(copy.meta.alternateNames),
      `${locale}.meta.alternateNames must be an array`,
    );
    assert.ok(
      copy.meta.alternateNames.includes("ruum"),
      `${locale}.meta.alternateNames must include "ruum"`,
    );
    for (const [idx, altName] of copy.meta.alternateNames.entries()) {
      assertNonEmptyString(altName, `${locale}.meta.alternateNames[${idx}]`);
    }

    assert.ok(Array.isArray(copy.meta.featureList), `${locale}.meta.featureList must be an array`);
    assert.ok(
      copy.meta.featureList.length >= 4,
      `${locale}.meta.featureList must have at least 4 entries`,
    );
    for (const [idx, feature] of copy.meta.featureList.entries()) {
      assertNonEmptyString(feature, `${locale}.meta.featureList[${idx}]`);
    }

    assertNonEmptyString(copy.nav.logoAlt, `${locale}.nav.logoAlt`);
    assertNonEmptyString(copy.sandbox.screenshotAlt, `${locale}.sandbox.screenshotAlt`);
    assertNonEmptyString(copy.footer.logoAlt, `${locale}.footer.logoAlt`);
  }
});

test("4-locale prose enforces strict Ruum vs ruum casing invariant", () => {
  const skipPaths = new Set(["meta.keywords", "meta.alternateNames"]);

  for (const [locale, copy] of Object.entries(LOCALES)) {
    const leaves = collectStringLeaves(copy, "", skipPaths);
    assert.ok(leaves.length > 0, `${locale} must yield string entries`);

    for (const { path, value } of leaves) {
      const sanitized = stripAllowedLowercaseTokens(value);
      assert.equal(
        /\bruum\b/.test(sanitized),
        false,
        `Unexpected lowercase "ruum" in ${locale}.${path}: ${JSON.stringify(value)}`,
      );
    }
  }
});

test("Source invariants match Ruum branding, alt bindings, JSON-LD, and lazy screenshot", () => {
  const header = readRepoFile("src/components/Header.astro");
  assert.ok(header.includes(">Ruum<"), "Header.astro must render >Ruum<");
  assert.ok(
    header.includes("alt={copy.nav.logoAlt}"),
    "Header.astro must bind alt={copy.nav.logoAlt}",
  );
  assert.equal(header.includes(">ruum<"), false, "Header.astro must not contain >ruum<");
  assert.equal(
    header.includes('alt="ruum logo"'),
    false,
    'Header.astro must not hardcode alt="ruum logo"',
  );

  const footer = readRepoFile("src/components/Footer.astro");
  assert.ok(
    footer.includes("alt={copy.footer.logoAlt}"),
    "Footer.astro must bind alt={copy.footer.logoAlt}",
  );
  assert.equal(
    footer.includes('alt="ruum mark"'),
    false,
    'Footer.astro must not hardcode alt="ruum mark"',
  );

  const heroSandbox = readRepoFile("src/components/HeroSandbox.tsx");
  assert.ok(
    heroSandbox.includes("# Generated by Ruum"),
    "HeroSandbox.tsx must emit # Generated by Ruum in remote export script",
  );
  assert.equal(
    heroSandbox.includes("# Generated by ruum"),
    false,
    "HeroSandbox.tsx must not emit lowercase # Generated by ruum",
  );
  assert.ok(
    heroSandbox.includes("alt={copy.screenshotAlt}"),
    "HeroSandbox.tsx must bind alt={copy.screenshotAlt}",
  );
  assert.ok(heroSandbox.includes('loading="lazy"'), 'HeroSandbox.tsx must set loading="lazy"');
  assert.ok(
    heroSandbox.includes('displayMode === "screenshot" ? "bg-canvas" : "hidden"'),
    "HeroSandbox.tsx must keep screenshot mounted with hidden fallback class",
  );

  const ogSvg = readRepoFile("public/og-image.svg");
  assert.ok(ogSvg.includes(">Ruum<"), "public/og-image.svg must contain >Ruum<");
  assert.equal(ogSvg.includes(">ruum<"), false, "public/og-image.svg must not contain >ruum<");

  const baseLayout = readRepoFile("src/layouts/BaseLayout.astro");
  assert.ok(
    baseLayout.includes('<meta property="og:site_name" content="Ruum" />'),
    'BaseLayout.astro must set og:site_name to "Ruum"',
  );
  assert.ok(
    baseLayout.includes("'@graph': [websiteJsonLd, softwareJsonLd]") &&
      baseLayout.includes("'@type': 'WebSite'") &&
      baseLayout.includes("'@type': 'SoftwareApplication'"),
    "BaseLayout.astro must emit JSON-LD @graph with WebSite and SoftwareApplication",
  );
  assert.ok(
    baseLayout.includes('<meta name="keywords" content={copy.meta.keywords} />'),
    "BaseLayout.astro must bind copy.meta.keywords",
  );
  assert.ok(
    baseLayout.includes('<meta property="og:image:alt" content={copy.meta.ogImageAlt} />') &&
      baseLayout.includes('<meta name="twitter:image:alt" content={copy.meta.ogImageAlt} />'),
    "BaseLayout.astro must bind copy.meta.ogImageAlt for OG and Twitter cards",
  );
  assert.ok(
    baseLayout.includes(
      "/bot|crawl|spider|slurp|bingpreview|mediapartners|lighthouse|headlesschrome/i",
    ),
    "BaseLayout.astro must exempt crawler user agents from locale auto-redirect",
  );
});

test("Built dist/ outputs include llms.txt, JSON-LD @graph, localized metadata, and SSR screenshot", () => {
  if (!existsSync(new URL("../dist/index.html", import.meta.url))) {
    return;
  }

  const llmsPath = new URL("../dist/llms.txt", import.meta.url);
  assert.equal(existsSync(llmsPath), true, "dist/llms.txt must exist");
  const llmsTxt = readFileSync(llmsPath, "utf8");
  assert.ok(llmsTxt.startsWith("# Ruum"), "dist/llms.txt must start with # Ruum");

  const builtPages = [
    { file: "dist/index.html", copy: en },
    { file: "dist/zh/index.html", copy: zh },
    { file: "dist/ja/index.html", copy: ja },
    { file: "dist/ko/index.html", copy: ko },
    { file: "dist/download/index.html", copy: en },
    { file: "dist/zh/download/index.html", copy: zh },
    { file: "dist/changelog/index.html", copy: en },
  ];

  for (const { file, copy } of builtPages) {
    const html = readRepoFile(file);
    assert.ok(html.includes('"@type":"WebSite"'), `${file} must include WebSite JSON-LD`);
    assert.ok(
      html.includes('"@type":"SoftwareApplication"'),
      `${file} must include SoftwareApplication JSON-LD`,
    );
    assert.ok(html.includes('"name":"Ruum"'), `${file} must include "name":"Ruum" in JSON-LD`);
    assert.ok(
      html.includes('<meta property="og:site_name" content="Ruum"'),
      `${file} must set og:site_name content="Ruum"`,
    );
    assert.ok(html.includes(copy.meta.keywords), `${file} must include localized meta.keywords`);
  }

  const builtHomePages = [
    { file: "dist/index.html", copy: en },
    { file: "dist/zh/index.html", copy: zh },
    { file: "dist/ja/index.html", copy: ja },
    { file: "dist/ko/index.html", copy: ko },
  ];

  for (const { file, copy } of builtHomePages) {
    const html = readRepoFile(file);
    assert.ok(
      html.includes(`<img src="/screenshot.png" alt="${copy.sandbox.screenshotAlt}"`),
      `${file} must include SSR <img src="/screenshot.png" with localized screenshotAlt`,
    );
    assert.ok(
      html.includes('<span class="text-[16px] font-bold tracking-[-0.02em]">Ruum</span>'),
      `${file} must include >Ruum< in the header`,
    );
  }
});
