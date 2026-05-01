import type { WowRoleSlots } from "./wowRoleTypes";

/**
 * Per-class role **capacity** (spec counts per role column).
 * Eligibility and metrics only treat roles with capacity > 0 as meaningful.
 * Keys: lowercase, no spaces (matches Blizzard class strings normalized).
 */
const CLASS_ROLE_CAPACITY: Readonly<Record<string, WowRoleSlots>> = {
  deathknight: { tank: 1, heal: 0, dps: 2 },
  demonhunter: { tank: 1, heal: 0, dps: 1 },
  druid: { tank: 1, heal: 1, dps: 1 },
  evoker: { tank: 0, heal: 1, dps: 1 },
  hunter: { tank: 0, heal: 0, dps: 3 },
  mage: { tank: 0, heal: 0, dps: 3 },
  monk: { tank: 1, heal: 1, dps: 1 },
  paladin: { tank: 1, heal: 1, dps: 1 },
  priest: { tank: 0, heal: 2, dps: 1 },
  rogue: { tank: 0, heal: 0, dps: 3 },
  shaman: { tank: 0, heal: 1, dps: 2 },
  warlock: { tank: 0, heal: 0, dps: 3 },
  warrior: { tank: 2, heal: 0, dps: 2 },
  unknown: { tank: 0, heal: 0, dps: 0 },
};

function normalizeClassKey(className: string): string {
  const compact = className.trim().toLowerCase().replace(/\s+/g, "");
  if (compact === "deathknight" || compact === "dk") return "deathknight";
  if (compact === "demonhunter" || compact === "dh") return "demonhunter";
  return compact;
}

/** Role lane counts for this class from shared commons. Unknown / unrecognized → zeros. */
export function classRoleCapacity(className: string): WowRoleSlots {
  const key = normalizeClassKey(className);
  return CLASS_ROLE_CAPACITY[key] ?? CLASS_ROLE_CAPACITY.unknown;
}
