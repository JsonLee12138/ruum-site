export type HomeNavKey = "home" | "capabilities" | "safety";

export const HOME_NAV_SECTIONS: readonly Exclude<HomeNavKey, "home">[] = [
  "capabilities",
  "safety",
] as const;

export function parseHomeNavHash(hash: string): HomeNavKey | null {
  const normalized = hash.trim().replace(/^#/, "").toLowerCase();
  if (normalized === "capabilities" || normalized === "safety") {
    return normalized;
  }
  return null;
}

export function resolveHomeNavKey(params: {
  scrollY: number;
  viewportHeight: number;
  docHeight: number;
  sections: ReadonlyArray<{ key: HomeNavKey; top: number }>;
  offset?: number;
}): HomeNavKey {
  const { scrollY, viewportHeight, docHeight, sections, offset = 104 } = params;
  if (sections.length === 0 || scrollY <= 8) {
    return "home";
  }

  const ordered = [...sections].sort((a, b) => a.top - b.top);
  if (docHeight > viewportHeight && scrollY + viewportHeight >= docHeight - 24) {
    return ordered[ordered.length - 1].key;
  }

  const threshold = scrollY + offset;
  let active: HomeNavKey = "home";
  for (const section of ordered) {
    if (threshold >= section.top) {
      active = section.key;
    }
  }
  return active;
}
