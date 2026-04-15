/** Optional allocation (0–32 per stat, 66 total) layered on base stats for comparisons. */
export type StatSpread = {
  hp: number;
  atk: number;
  def: number;
  spAtk: number;
  spDef: number;
  speed: number;
};

export const STAT_SPREAD_MAX_PER_STAT = 32;
export const STAT_SPREAD_MAX_TOTAL = 66;

export const ZERO_STAT_SPREAD: StatSpread = {
  hp: 0,
  atk: 0,
  def: 0,
  spAtk: 0,
  spDef: 0,
  speed: 0,
};

export function totalStatSpread(sp: StatSpread): number {
  return sp.hp + sp.atk + sp.def + sp.spAtk + sp.spDef + sp.speed;
}

/** Max value allowed for `field` given the other five stats (per-stat and 66-point caps). */
export function maxAssignableForStatSpreadField(
  spread: StatSpread,
  field: keyof StatSpread,
): number {
  const rest = totalStatSpread(spread) - spread[field];
  return Math.max(
    0,
    Math.min(STAT_SPREAD_MAX_PER_STAT, STAT_SPREAD_MAX_TOTAL - rest),
  );
}

/**
 * Set one field and enforce per-stat and global caps (other stats unchanged).
 */
export function clampStatSpreadField(
  prev: StatSpread,
  field: keyof StatSpread,
  rawValue: number,
): StatSpread {
  const v = Math.max(
    0,
    Math.min(
      STAT_SPREAD_MAX_PER_STAT,
      Math.round(Number(rawValue)),
    ),
  );
  const prevOther = totalStatSpread(prev) - prev[field];
  const maxForField = Math.max(
    0,
    Math.min(STAT_SPREAD_MAX_PER_STAT, STAT_SPREAD_MAX_TOTAL - prevOther),
  );
  return { ...prev, [field]: Math.min(v, maxForField) };
}

const SPREAD_FIELD_ORDER: (keyof StatSpread)[] = [
  "hp",
  "atk",
  "def",
  "spAtk",
  "spDef",
  "speed",
];

/** Coerce into valid per-stat and total caps (for hydration or external state). */
export function normalizeStatSpread(sp: StatSpread): StatSpread {
  let next: StatSpread = { ...sp };
  for (const k of SPREAD_FIELD_ORDER) {
    next[k] = Math.max(
      0,
      Math.min(STAT_SPREAD_MAX_PER_STAT, Math.round(Number(next[k])) || 0),
    );
  }
  while (totalStatSpread(next) > STAT_SPREAD_MAX_TOTAL) {
    let pick: keyof StatSpread | null = null;
    let pickV = -1;
    for (const k of SPREAD_FIELD_ORDER) {
      if (next[k] > pickV) {
        pickV = next[k];
        pick = k;
      }
    }
    if (!pick || pickV <= 0) break;
    next = { ...next, [pick]: pickV - 1 };
  }
  return next;
}
