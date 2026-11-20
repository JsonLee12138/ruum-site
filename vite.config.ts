import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: [
      "dist/**",
      ".astro/**",
      ".agents/**",
      "**/*.astro",
      "src/data/releases.json",
      "src/data/lottie/**",
    ],
  },
  lint: {
    ignorePatterns: [
      "dist/**",
      ".astro/**",
      ".agents/**",
      "**/*.astro",
      "src/data/releases.json",
      "src/data/lottie/**",
    ],
  },
});
