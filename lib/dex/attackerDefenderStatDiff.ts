import { DEX_STAT_TODO } from "./dexObject";
import type { DexDisplayEntry } from "./display";
import { formatDexTileDisplayName } from "./display";
import type { StatSpread } from "./statSpread";
import { ZERO_STAT_SPREAD } from "./statSpread";

function isUsableBaseStat(n: number | undefined): n is number {
  return n !== undefined && n !== DEX_STAT_TODO;
}

/**
 * Same species+form row as the defender: treat the attacker as **incoming** (dex base only).
 * Your spread still applies to the defender you’re analyzing.
 */
function effectiveAttackerSpreadForDexComparison(
  attacker: DexDisplayEntry,
  defender: DexDisplayEntry,
  attackerSpread: StatSpread,
): StatSpread {
  if (attacker.key === defender.key) return ZERO_STAT_SPREAD;
  return attackerSpread;
}

/**
 * Physical / special “edges” for an attacker against a defender using **base stats** only.
 *
 * - **phys**: attacker `attack` minus defender `defense` (same units as base stats).
 * - **spec**: attacker `spAtk` minus defender `spDef`.
 *
 * These mirror which side of the damage formula each stat enters (physical vs special).
 *
 * **Level ~100 (and fixed IV/EV/nature):** main-series stats use
 * `floor((2×Base + IV + ⌊EV/4⌋) × Level/100 + 5) × nature`, so a gap in base stats
 * scales to roughly **2×** that gap in actual stats when IV/EV are held constant.
 * For **sorting** candidates against the *same* defender, subtracting the same defender
 * defenses is enough—no z-score or population normalization is required. Relative order
 * of gaps is stable for typical comparisons; treat values as an index, not exact damage.
 */
export type AttackerDefenderStatSpreadOptions = {
  attackerSpread?: StatSpread;
  defenderSpread?: StatSpread;
};

/**
 * If `attacker.key === defender.key`, attacker spread is ignored (incoming uses dex bases;
 * defender spread still applies to the Pokémon you’re viewing).
 */
export function attackerVsDefenderBaseStatDiffs(
  attacker: DexDisplayEntry,
  defender: DexDisplayEntry,
  options?: AttackerDefenderStatSpreadOptions,
): { phys: number | null; spec: number | null } {
  const a = attacker.form;
  const d = defender.form;
  const rawAs = options?.attackerSpread ?? ZERO_STAT_SPREAD;
  const ds = options?.defenderSpread ?? ZERO_STAT_SPREAD;
  const as = effectiveAttackerSpreadForDexComparison(attacker, defender, rawAs);
  if (!a || !d) return { phys: null, spec: null };

  const phys =
    isUsableBaseStat(a.attack) && isUsableBaseStat(d.defense)
      ? a.attack + as.atk - (d.defense + ds.def)
      : null;
  const spec =
    isUsableBaseStat(a.spAtk) && isUsableBaseStat(d.spDef)
      ? a.spAtk + as.spAtk - (d.spDef + ds.spDef)
      : null;

  return { phys, spec };
}

/**
 * Attacker Speed minus defender Speed (positive = attacker outspeeds).
 * Mirror row: incoming attacker uses base Spe only; defender uses spread.
 */
export function attackerVsDefenderBaseSpeedDiff(
  attacker: DexDisplayEntry,
  defender: DexDisplayEntry,
  options?: AttackerDefenderStatSpreadOptions,
): number | null {
  const a = attacker.form;
  const d = defender.form;
  const rawAs = options?.attackerSpread ?? ZERO_STAT_SPREAD;
  const ds = options?.defenderSpread ?? ZERO_STAT_SPREAD;
  const as = effectiveAttackerSpreadForDexComparison(attacker, defender, rawAs);
  if (!a || !d) return null;
  if (!isUsableBaseStat(a.speed) || !isUsableBaseStat(d.speed)) return null;
  return a.speed + as.speed - (d.speed + ds.speed);
}

export type SpeedMatchupTierLabel = "++" | "+" | "=" | "-" | "--";

/** Tier from base Speed difference: ++ (≥15), + (1–14), = (0), − (−1 to −14), −− (≤−15). */
export function speedMatchupTierLabelFromDiff(
  diff: number | null,
): SpeedMatchupTierLabel | null {
  if (diff === null) return null;
  if (diff >= 15) return "++";
  if (diff >= 1) return "+";
  if (diff === 0) return "=";
  if (diff <= -15) return "--";
  return "-";
}

function maxEdge(d: { phys: number | null; spec: number | null }): number {
  const p = d.phys ?? -Infinity;
  const s = d.spec ?? -Infinity;
  return Math.max(p, s);
}

/**
 * Sort attackers against a fixed defender: stronger overall matchup edge first
 * (max of phys/spec gap), then phys gap, then spec gap, then name.
 */
export function compareDexEntriesByAttackerVsDefenderStats(
  a: DexDisplayEntry,
  b: DexDisplayEntry,
  defender: DexDisplayEntry,
  getSpread?: (key: string) => StatSpread,
): number {
  const g = getSpread ?? (() => ZERO_STAT_SPREAD);
  const da = attackerVsDefenderBaseStatDiffs(a, defender, {
    attackerSpread: g(a.key),
    defenderSpread: g(defender.key),
  });
  const db = attackerVsDefenderBaseStatDiffs(b, defender, {
    attackerSpread: g(b.key),
    defenderSpread: g(defender.key),
  });

  const primary = maxEdge(db) - maxEdge(da);
  if (primary !== 0) return primary;

  const physTie = (db.phys ?? -Infinity) - (da.phys ?? -Infinity);
  if (physTie !== 0) return physTie;

  const specTie = (db.spec ?? -Infinity) - (da.spec ?? -Infinity);
  if (specTie !== 0) return specTie;

  return formatDexTileDisplayName(a.dexName, a.formId).localeCompare(
    formatDexTileDisplayName(b.dexName, b.formId),
  );
}

/** Compact signed integer for UI (e.g. "+12", "-3"). */
export function formatSignedBaseStatDiff(n: number | null): string {
  if (n === null) return "—";
  if (n === 0) return "0";
  const sign = n > 0 ? "+" : "-";
  return sign + Math.abs(n);
}
