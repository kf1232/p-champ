import type { WowMythicBestRunForDisplay } from "@/lib/wow/schemas/battleNetApiSchemas";

/** Human-readable slot names (row-major), for placeholders and tooltips. */
export const MYTHIC_SEASON_GRID_SLOT_LABELS: readonly string[] = [
  "Seat of the Triumvirate",
  "Pit of Sauron",
  "Skyreach",
  "Algeth'ar Academy",
  "Magister's Terrace",
  "Maisara Caverns",
  "Windrunner Spire",
  "Nexus-Point Xenas",
];

export const MYTHIC_SEASON_GRID_SLOT_COUNT = MYTHIC_SEASON_GRID_SLOT_LABELS.length;

function normDungeonName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[""`]/g, "'")
    .replace(/\s+/g, " ");
}

type SlotMatcher = (n: string) => boolean;

/** One matcher per grid index (0–7). */
const SEASON_GRID_MATCHERS: readonly SlotMatcher[] = [
  (n) =>
    n.includes("triumvirate") ||
    (n.includes("seat") && n.includes("trium")),
  (n) =>
    n.includes("pit of saron") ||
    n.includes("pit of sauron") ||
    (n.includes("pit") && n.includes("saron")),
  (n) => n.includes("skyreach"),
  (n) => n.includes("algeth") && n.includes("academy"),
  (n) => n.includes("magister") && n.includes("terrace"),
  (n) => n.includes("maisara") || n.includes("mistsara"),
  (n) =>
    n.includes("windrunner spire") ||
    (n.includes("windrunner") && n.includes("spire")),
  (n) =>
    n.includes("nexus-point") ||
    (n.includes("nexus") && (n.includes("point") || n.includes("xenas"))),
];

if (SEASON_GRID_MATCHERS.length !== MYTHIC_SEASON_GRID_SLOT_LABELS.length) {
  throw new Error(
    "mythicKeystoneSeasonGridOrder: matcher count must match MYTHIC_SEASON_GRID_SLOT_LABELS",
  );
}

/**
 * Places each run into its season slot; unmatched runs are omitted. Slots without a
 * matching run are `null` (placeholder in the UI).
 */
export function orderMythicRunsIntoSeasonGrid(
  runs: readonly WowMythicBestRunForDisplay[],
): readonly (WowMythicBestRunForDisplay | null)[] {
  const slots: (WowMythicBestRunForDisplay | null)[] = Array.from(
    { length: MYTHIC_SEASON_GRID_SLOT_COUNT },
    () => null,
  );
  const used = new Set<number>();

  for (let slot = 0; slot < MYTHIC_SEASON_GRID_SLOT_COUNT; slot++) {
    const matcher = SEASON_GRID_MATCHERS[slot];
    for (let i = 0; i < runs.length; i++) {
      if (used.has(i)) {
        continue;
      }
      const key = normDungeonName(runs[i].dungeonName);
      if (matcher(key)) {
        slots[slot] = runs[i];
        used.add(i);
        break;
      }
    }
  }

  return slots;
}

/** True if `a` should replace `b` in a “best run” pick (higher key, then timed). */
function keystoneRunIsBetterThan(
  a: WowMythicBestRunForDisplay,
  b: WowMythicBestRunForDisplay,
): boolean {
  if (a.keystoneLevel !== b.keystoneLevel) {
    return a.keystoneLevel > b.keystoneLevel;
  }
  if (a.completedInTime !== b.completedInTime) {
    return a.completedInTime && !b.completedInTime;
  }
  return false;
}

/**
 * For each season grid slot, picks the single best run among all `runs` that match that
 * slot (highest keystone level; if tied, prefers completed in time).
 */
export function aggregateBestRunsForSeasonGrid(
  runs: readonly WowMythicBestRunForDisplay[],
): readonly (WowMythicBestRunForDisplay | null)[] {
  const slots: (WowMythicBestRunForDisplay | null)[] = Array.from(
    { length: MYTHIC_SEASON_GRID_SLOT_COUNT },
    () => null,
  );

  for (let slot = 0; slot < MYTHIC_SEASON_GRID_SLOT_COUNT; slot++) {
    const matcher = SEASON_GRID_MATCHERS[slot];
    const matches: WowMythicBestRunForDisplay[] = [];
    for (const r of runs) {
      if (matcher(normDungeonName(r.dungeonName))) {
        matches.push(r);
      }
    }
    if (matches.length === 0) {
      continue;
    }
    slots[slot] = matches.reduce((best, r) =>
      keystoneRunIsBetterThan(r, best) ? r : best,
      matches[0],
    );
  }

  return slots;
}
