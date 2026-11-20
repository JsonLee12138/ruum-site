import { defineConfig, presetWebFonts, presetWind4, transformerDirectives } from "unocss";

export default defineConfig({
  presets: [
    presetWind4(),
    presetWebFonts({
      timeouts: {
        warning: 2000,
        failure: 10000,
      },
      fonts: {
        sans: [
          {
            name: "Maple Mono",
            provider: "fontsource",
            weights: ["400", "500", "600", "700"],
          },
          {
            name: "Maple Mono NF CN@442",
            provider: "zeoseven",
          },
          {
            name: '"PingFang SC"',
            provider: "none",
          },
          {
            name: '"Hiragino Sans"',
            provider: "none",
          },
          {
            name: '"Noto Sans KR"',
            provider: "none",
          },
        ],
        mono: [
          {
            name: '"Maple Mono"',
            provider: "none",
          },
          {
            name: '"Maple Mono NF CN"',
            provider: "none",
          },
        ],
      },
    }),
  ],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      canvas: "var(--bg-canvas)",
      surface: "var(--bg-surface)",
      elevated: "var(--bg-elevated)",
      inset: "var(--bg-inset)",
      rail: "var(--bg-rail)",
      hairline: "var(--border-hairline)",
      strong: "var(--border-strong)",
      ink: {
        DEFAULT: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted: "var(--text-muted)",
      },
      amber: {
        DEFAULT: "var(--accent-amber)",
        fill: "var(--accent-amber-fill)",
        hover: "var(--accent-amber-hover)",
        soft: "var(--accent-amber-soft)",
        on: "var(--accent-on-amber)",
      },
    },
  },
  shortcuts: {
    slab: "bg-surface border border-hairline rounded-[2px] min-w-0 max-w-full",
    "btn-primary":
      "inline-flex items-center justify-center gap-2 px-4 py-2 text-[13px] font-medium rounded-[2px] bg-amber-fill text-amber-on hover:bg-amber-hover transition-colors cursor-pointer select-none",
    "btn-secondary":
      "inline-flex items-center justify-center gap-2 px-3.5 py-2 text-[13px] font-medium rounded-[2px] bg-surface text-ink border border-strong hover:bg-inset transition-colors cursor-pointer select-none",
    "badge-mono":
      "inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-mono tracking-tight rounded-[2px] border border-hairline bg-inset text-ink-secondary",
    tabular: "font-mono [font-variant-numeric:tabular-nums]",
  },
});
