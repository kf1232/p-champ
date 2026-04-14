import type { MatchupSlotCell } from "@/lib/dex";
import {
  multiplierToEffectivenessTier,
  type EffectivenessTier,
} from "@/lib/dex";

type SelectorMatchupGridProps = {
  /** Length matches team slots (e.g. 6); index aligns with team slot order (row-major 2×3). */
  slots: readonly (MatchupSlotCell | null)[];
};

const TIER_SWATCH: Record<EffectivenessTier, string> = {
  grey: "bg-zinc-400",
  red: "bg-red-500",
  yellow: "bg-yellow-400",
  green: "bg-green-500",
  blue: "bg-blue-600",
};

function TierSwatch({
  tier,
  explanation,
}: {
  tier: EffectivenessTier;
  /** Full math line, e.g. "Rock > Fire Flying = 4×" */
  explanation: string;
}) {
  return (
    <span
      className={`block h-full min-h-0 flex-1 ${TIER_SWATCH[tier]}`}
      title={explanation}
    />
  );
}

/**
 * 2×3 grid: one cell per team slot, same order as the team panel (left-to-right, top-to-bottom).
 * Each filled slot shows attack | defense effectiveness as two color bands.
 */
export function SelectorMatchupGrid({ slots }: SelectorMatchupGridProps) {
  const labelParts = slots.map((cell, i) =>
    cell
      ? `slot ${i + 1} attack ${cell.atkExplanation}; defense ${cell.defExplanation}`
      : `slot ${i + 1} empty`,
  );

  return (
    <div
      className="grid w-full grid-cols-2 grid-rows-3 gap-1"
      role="group"
      aria-label={`Matchups vs team: ${labelParts.join("; ")}`}
    >
      {slots.map((cell, i) => (
        <div
          key={i}
          className={[
            "flex min-h-[2rem] flex-col items-center justify-center rounded-md border px-0.5 py-0.5",
            cell
              ? "border-black/25 bg-white/40"
              : "border-black/15 bg-black/[0.04]",
          ].join(" ")}
          aria-label={labelParts[i] ?? `slot ${i + 1}`}
        >
          {cell ? (
            <div
              className="flex h-4 w-full max-w-[5.5rem] items-stretch overflow-hidden rounded border border-black/30"
              role="img"
              aria-label={`Attack: ${cell.atkExplanation}. Defense: ${cell.defExplanation}`}
            >
              <TierSwatch
                tier={multiplierToEffectivenessTier(cell.atkMultiplier)}
                explanation={cell.atkExplanation}
              />
              <span className="w-px shrink-0 bg-black/40" aria-hidden />
              <TierSwatch
                tier={multiplierToEffectivenessTier(cell.defMultiplier)}
                explanation={cell.defExplanation}
              />
            </div>
          ) : (
            <span className="text-sm text-black/25">—</span>
          )}
        </div>
      ))}
    </div>
  );
}
