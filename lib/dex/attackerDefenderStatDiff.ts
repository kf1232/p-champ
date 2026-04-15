import { DEX_STAT_TODO } from "./dexObject";
import type { DexDisplayEntry } from "./display";
import { formatDexTileDisplayName } from "./display";

function isUsableBaseStat(n: number | undefined): n is number {
  return n !== undefined && n !== DEX_STAT_TODO;
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
export function attackerVsDefenderBaseStatDiffs(
  attacker: DexDisplayEntry,
  defender: DexDisplayEntry,
): { phys: number | null; spec: number | null } {
  const a = attacker.form;
  const d = defender.form;
  if (!a || !d) return { phys: null, spec: null };

  const phys =
    isUsableBaseStat(a.attack) && isUsableBaseStat(d.defense)
      ? a.attack - d.defense
      : null;
  const spec =
    isUsableBaseStat(a.spAtk) && isUsableBaseStat(d.spDef)
      ? a.spAtk - d.spDef
      : null;

  return { phys, spec };
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
): number {
  const da = attackerVsDefenderBaseStatDiffs(a, defender);
  const db = attackerVsDefenderBaseStatDiffs(b, defender);

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
