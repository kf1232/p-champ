/**
 * Wowhead “Gear and Best in Slot” guide URLs for retail classes/specs.
 * Pattern: https://www.wowhead.com/guide/classes/{class}/{spec}/bis-gear
 * @see https://www.wowhead.com/guide/classes/paladin/retribution/bis-gear
 */

import catalog from "./wowClassSpecCatalog.json";

export const WOWHEAD_GUIDE_CLASSES_BASE =
  "https://www.wowhead.com/guide/classes";

/** Lowercase hyphenated segment matching Wowhead guide paths (e.g. “Death Knight” → “death-knight”). */
export function wowheadGuideSlug(displayName: string): string {
  return displayName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function buildWowheadBisGearGuideUrl(
  classDisplayName: string,
  specDisplayName: string,
): string {
  return `${WOWHEAD_GUIDE_CLASSES_BASE}/${wowheadGuideSlug(classDisplayName)}/${wowheadGuideSlug(specDisplayName)}/bis-gear`;
}

export type WowheadBisGearOption = {
  specId: number;
  specName: string;
  guideUrl: string;
};

export function listWowheadBisGearOptionsForClass(
  classId: number,
): WowheadBisGearOption[] {
  const cls = catalog.classes.find((c) => c.id === classId);
  if (!cls) return [];
  return cls.specializations.map((spec) => ({
    specId: spec.id,
    specName: spec.name,
    guideUrl: buildWowheadBisGearGuideUrl(cls.name, spec.name),
  }));
}

export function getWowheadBisGearGuideUrl(
  classId: number,
  specId: number,
): string | null {
  const cls = catalog.classes.find((c) => c.id === classId);
  if (!cls) return null;
  const spec = cls.specializations.find((s) => s.id === specId);
  if (!spec) return null;
  return buildWowheadBisGearGuideUrl(cls.name, spec.name);
}
