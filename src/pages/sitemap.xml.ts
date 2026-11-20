import type { APIRoute } from "astro";
import releasesData from "../data/releases.json";
import { LOCALES, localePath } from "../i18n";

export const prerender = true;

const SUBPATHS = ["", "download", "changelog"] as const;

export const GET: APIRoute = ({ site }) => {
  const origin = (site?.toString() || "https://ruum.jsonlee12138.com").replace(/\/$/, "");
  const lastmod = (releasesData.generatedAt || new Date().toISOString()).slice(0, 10);

  const urlNodes: string[] = [];

  for (const subpath of SUBPATHS) {
    const alternates = LOCALES.map(
      (loc) =>
        `    <xhtml:link rel="alternate" hreflang="${loc}" href="${origin}${localePath(loc, subpath)}" />`,
    ).concat(
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}${localePath("en", subpath)}" />`,
    );

    const priority = subpath === "" ? "1.0" : subpath === "download" ? "0.9" : "0.7";

    for (const loc of LOCALES) {
      const fullUrl = `${origin}${localePath(loc, subpath)}`;
      urlNodes.push(
        `  <url>\n    <loc>${fullUrl}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${subpath === "changelog" ? "weekly" : "monthly"}</changefreq>\n    <priority>${priority}</priority>\n${alternates.join("\n")}\n  </url>`,
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urlNodes.join("\n")}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
