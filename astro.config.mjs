import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import UnoCSS from "@unocss/astro";

export default defineConfig({
  site: process.env.SITE_URL || "https://ruum.jsonlee12138.com",
  output: "static",
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    react(),
  ],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh", "ja", "ko"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
