import type { DexDisplayEntry } from "./display";
import { formatDexTileDisplayName, getDexEntryTypeNames } from "./display";
import { formatTypeLabel } from "./typeBadgeStyles";
import { TYPES } from "./types";
import type { TypeName } from "./types";

/**
 * Dual-type defending: product of attack type effectiveness vs each defending type.
 */
function dualTypeAttackMultiplier(
  attackType: TypeName,
  defendTypes: readonly TypeName[],
): number {
  const row = TYPES[attackType];
  if (defendTypes.length === 0) return 1;
  let p = 1;
  for (const d of defendTypes) {
    const m = row.typeAtkModifier[d];
    p *= m !== undefined ? m : 1;
  }
  return p;
}

/** Best STAB multiplier vs merged defending typings (pick the stronger attacking type). */
export function bestStabMultiplier(
  attackTypes: readonly TypeName[],
  defendTypes: readonly TypeName[],
): number {
  if (attackTypes.length === 0) return 1;
  return Math.max(
    ...attackTypes.map((a) => dualTypeAttackMultiplier(a, defendTypes)),
  );
}

function formatDefenderTypesLabel(defendTypes: readonly TypeName[]): string {
  if (defendTypes.length === 0) return "—";
  return defendTypes.map((t) => formatTypeLabel(t)).join(" / ");
}

/**
 * Best STAB option (same tie-break as {@link bestStabMultiplier}) with a human line:
 * `Rock > Fire / Flying = 4×` (defender typings are merged via product).
 */
export function getBestStabMatchupBreakdown(
  attackTypes: readonly TypeName[],
  defendTypes: readonly TypeName[],
): { multiplier: number; explanation: string } {
  if (attackTypes.length === 0) {
    return {
      multiplier: 1,
      explanation: `— > ${formatDefenderTypesLabel(defendTypes)} = 1×`,
    };
  }
  const rated = attackTypes.map((type) => ({
    type,
    m: dualTypeAttackMultiplier(type, defendTypes),
  }));
  rated.sort((a, b) => {
    if (b.m !== a.m) return b.m - a.m;
    return a.type.localeCompare(b.type);
  });
  const best = rated[0]!;
  const atk = formatTypeLabel(best.type);
  const def = formatDefenderTypesLabel(defendTypes);
  return {
    multiplier: best.m,
    explanation: `${atk} > ${def} = ${formatEffectivenessMultiplier(best.m)}`,
  };
}

/** UI band for raw type effectiveness (matches main-series multipliers). */
export type EffectivenessTier = "grey" | "red" | "yellow" | "green" | "blue";

/** Maps multiplier to display color tier: 0× grey, &lt;1× red, 1× yellow, 2× green, 4× blue. */
export function multiplierToEffectivenessTier(m: number): EffectivenessTier {
  if (m <= 0) return "grey";
  if (m < 1 - 1e-9) return "red";
  if (m <= 1 + 1e-9) return "yellow";
  if (m <= 2 + 1e-9) return "green";
  return "blue";
}

export function formatEffectivenessMultiplier(m: number): string {
  if (m <= 0) return "0×";
  const r = Math.round(m * 1024) / 1024;
  for (const v of [0.25, 0.5, 1, 2, 4, 8, 16] as const) {
    if (Math.abs(r - v) < 1e-4) return `${v}×`;
  }
  return `${r}×`;
}

/**
 * Maps type effectiveness multiplier to [-4, 4] (one slot of the ±24 team total).
 */
export function multiplierToMatchupScore(m: number): number {
  if (m <= 0) return -4;
  if (m <= 0.25 + 1e-9) return -4;
  if (m <= 0.5 + 1e-9) return -2;
  if (m <= 1 + 1e-9) return 0;
  if (m <= 2 + 1e-9) return 2;
  return 4;
}

/**
 * Best and second-best STAB matchup scores vs merged defending typings.
 * Dual-type defense: product of effectiveness vs each defender type (see {@link dualTypeAttackMultiplier}).
 * Mono-type attacker: secondary is always 0.
 */
export function stabPrimarySecondaryMatchupScores(
  attackTypes: readonly TypeName[],
  defendTypes: readonly TypeName[],
): { primary: number; secondary: number } {
  if (attackTypes.length === 0) return { primary: 0, secondary: 0 };
  if (attackTypes.length === 1) {
    const m = dualTypeAttackMultiplier(attackTypes[0], defendTypes);
    return { primary: multiplierToMatchupScore(m), secondary: 0 };
  }
  const scored = attackTypes.map((type) => {
    const m = dualTypeAttackMultiplier(type, defendTypes);
    return { type, score: multiplierToMatchupScore(m) };
  });
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.type.localeCompare(b.type);
  });
  return {
    primary: scored[0]!.score,
    secondary: scored[1]!.score,
  };
}

/** Raw best-STAB multipliers for one team member vs one selector species (per team slot). */
export type MatchupSlotCell = {
  atkMultiplier: number;
  atkExplanation: string;
  defMultiplier: number;
  defExplanation: string;
};

/**
 * One entry per team slot index: effectiveness vs this selector, or `null` if the slot is empty.
 */
export function computeSelectorTeamMatchupPerSlot(
  selectorEntry: DexDisplayEntry,
  teamSlots: readonly (DexDisplayEntry | null)[],
): (MatchupSlotCell | null)[] {
  const selTypes = getDexEntryTypeNames(selectorEntry);
  return teamSlots.map((slot) => {
    if (!slot) return null;
    const teamTypes = getDexEntryTypeNames(slot);
    const atk = getBestStabMatchupBreakdown(teamTypes, selTypes);
    const def = getBestStabMatchupBreakdown(selTypes, teamTypes);
    return {
      atkMultiplier: atk.multiplier,
      atkExplanation: atk.explanation,
      defMultiplier: def.multiplier,
      defExplanation: def.explanation,
    };
  });
}

/**
 * Team Builder threat: sum over filled slots using the **def** band only (selector STAB
 * attacking your team member). Resisted/neutral slots add 0; 2× adds 2; 4× or higher adds 4.
 */
export function defThreatScoreFromSlots(
  slots: readonly (MatchupSlotCell | null)[],
): number {
  let total = 0;
  for (const cell of slots) {
    if (!cell) continue;
    const m = cell.defMultiplier;
    if (m <= 1 + 1e-9) continue;
    if (m <= 2 + 1e-9) total += 2;
    else total += 4;
  }
  return total;
}

/**
 * Sums per-slot discrete scores (filled slots only) to [-24, 24] each.
 */
export function computeSelectorTeamMatchupTotals(
  selectorEntry: DexDisplayEntry,
  teamSlots: readonly (DexDisplayEntry | null)[],
): {
  target: number;
  targetSecondary: number;
  threat: number;
} {
  const selTypes = getDexEntryTypeNames(selectorEntry);
  let target = 0;
  let targetSecondary = 0;
  let threat = 0;
  for (const slot of teamSlots) {
    if (!slot) continue;
    const teamTypes = getDexEntryTypeNames(slot);
    const t = stabPrimarySecondaryMatchupScores(teamTypes, selTypes);
    target += t.primary;
    targetSecondary += t.secondary;
    const th = stabPrimarySecondaryMatchupScores(selTypes, teamTypes);
    threat += th.primary;
  }
  return { target, targetSecondary, threat };
}

/**
 * Shows whichever of Target vs Threat has the larger magnitude (ties → Target).
 * Use one combined readout when space is tight.
 */
export function getDominantMatchupScore(
  target: number,
  threat: number,
): { value: number; dominant: "target" | "threat" } {
  if (Math.abs(target) >= Math.abs(threat)) {
    return { value: target, dominant: "target" };
  }
  return { value: threat, dominant: "threat" };
}

/**
 * Buckets each candidate by **best STAB** damage multiplier vs the defender’s typings
 * (dual-type defense uses the usual product rule). Entries with &lt;1× STAB are omitted.
 */
export function classifyDexEntriesByBestStabVsDefender(
  defender: DexDisplayEntry,
  candidates: readonly DexDisplayEntry[],
): {
  neutral: DexDisplayEntry[];
  effective: DexDisplayEntry[];
  superEffective: DexDisplayEntry[];
} {
  const defendTypes = getDexEntryTypeNames(defender);
  const neutral: DexDisplayEntry[] = [];
  const effective: DexDisplayEntry[] = [];
  const superEffective: DexDisplayEntry[] = [];

  for (const entry of candidates) {
    const atkTypes = getDexEntryTypeNames(entry);
    const m = bestStabMultiplier(atkTypes, defendTypes);
    if (m >= 4 - 1e-9) superEffective.push(entry);
    else if (m >= 2 - 1e-9) effective.push(entry);
    else if (Math.abs(m - 1) < 1e-9) neutral.push(entry);
  }

  const sortKey = (e: DexDisplayEntry) =>
    formatDexTileDisplayName(e.dexName, e.formId);
  const sort = (a: DexDisplayEntry, b: DexDisplayEntry) =>
    sortKey(a).localeCompare(sortKey(b));

  neutral.sort(sort);
  effective.sort(sort);
  superEffective.sort(sort);

  return { neutral, effective, superEffective };
}
