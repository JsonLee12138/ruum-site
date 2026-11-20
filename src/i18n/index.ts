import { en } from "./en";
import { ja } from "./ja";
import { ko } from "./ko";
import type { Locale, SiteCopy } from "./types";
import { zh } from "./zh";

export type { Locale, SiteCopy };

export const LOCALES: readonly Locale[] = ["en", "zh", "ja", "ko"] as const;

export const NON_DEFAULT_LOCALES: readonly Exclude<Locale, "en">[] = ["zh", "ja", "ko"] as const;

const DICTIONARIES: Record<Locale, SiteCopy> = {
  en,
  zh,
  ja,
  ko,
};

export function getCopy(locale: Locale): SiteCopy {
  return DICTIONARIES[locale] ?? en;
}

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "zh" || value === "ja" || value === "ko";
}

export function localePath(locale: Locale, subpath = ""): string {
  const clean = subpath.replace(/^\/+/, "").replace(/\/+$/, "");
  const prefix = locale === "en" ? "" : `/${locale}`;
  if (!clean) {
    return prefix ? `${prefix}/` : "/";
  }
  return `${prefix}/${clean}/`;
}
