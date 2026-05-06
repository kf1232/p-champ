"use client";

import {
  STAT_SPREAD_MAX_PER_STAT,
  STAT_SPREAD_MAX_TOTAL,
  clampStatSpreadField,
  maxAssignableForStatSpreadField,
  totalStatSpread,
  type StatSpread,
} from "@/lib/dex";

const FIELDS: { key: keyof StatSpread; label: string }[] = [
  { key: "hp", label: "HP" },
  { key: "atk", label: "Atk" },
  { key: "def", label: "Def" },
  { key: "spAtk", label: "SpA" },
  { key: "spDef", label: "SpD" },
  { key: "speed", label: "Spe" },
];

const RANGE_CLASS =
  "h-1.5 w-full min-w-0 cursor-pointer appearance-none rounded-full bg-black/10 accent-zinc-700 " +
  "[&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-700 " +
  "[&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-zinc-700";

type StatSpreadSlidersProps = {
  spread: StatSpread;
  onChange: (next: StatSpread) => void;
  idPrefix: string;
  /** Smaller grid and labels (team tiles). */
  compact?: boolean;
};

function SpreadGrid({
  spread,
  onChange,
  idPrefix,
  tiny,
}: {
  spread: StatSpread;
  onChange: (next: StatSpread) => void;
  idPrefix: string;
  tiny: boolean;
}) {
  const labelCls = tiny
    ? "text-[8px] font-semibold uppercase tracking-wide text-black/45"
    : "text-[10px] font-semibold uppercase tracking-wide text-black/50";
  const valCls = tiny
    ? "min-w-[0.85rem] text-right text-[8px] tabular-nums text-black/50"
    : "min-w-[0.9rem] text-right text-[9px] tabular-nums text-black/55";

  return (
    <div
      className={
        tiny
          ? "grid grid-cols-3 gap-x-1.5 gap-y-1"
          : "grid grid-cols-3 gap-x-2 gap-y-1.5 sm:gap-x-3"
      }
    >
      {FIELDS.map(({ key, label }) => {
        const max = maxAssignableForStatSpreadField(spread, key);
        const inputId = `${idPrefix}-${key}`;
        const v = Math.min(spread[key], max);
        return (
          <div key={key} className="min-w-0">
            <div className="mb-0.5 flex items-center justify-between gap-0.5">
              <label className={labelCls} htmlFor={inputId}>
                {label}
              </label>
              <span className={valCls}>{spread[key]}</span>
            </div>
            <input
              id={inputId}
              type="range"
              min={0}
              max={max}
              value={v}
              onChange={(e) => {
                onChange(
                  clampStatSpreadField(spread, key, Number(e.target.value)),
                );
              }}
              className={RANGE_CLASS}
              aria-valuemin={0}
              aria-valuemax={max}
              aria-valuenow={spread[key]}
            />
          </div>
        );
      })}
    </div>
  );
}

export function StatSpreadSliders({
  spread,
  onChange,
  idPrefix,
  compact = false,
}: StatSpreadSlidersProps) {
  const total = totalStatSpread(spread);
  const hint = `0–${STAT_SPREAD_MAX_PER_STAT} per stat · ${STAT_SPREAD_MAX_TOTAL} total`;

  return (
    <div
      className="min-w-0"
      title={hint}
      onDoubleClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <p
        className={
          compact
            ? "mb-1 text-[9px] font-medium tabular-nums text-black/50"
            : "mb-1.5 text-[10px] font-medium tabular-nums text-black/50"
        }
      >
        Spread{" "}
        <span className="text-black/75">
          {total}/{STAT_SPREAD_MAX_TOTAL}
        </span>
      </p>
      <SpreadGrid
        spread={spread}
        onChange={onChange}
        idPrefix={idPrefix}
        tiny={compact}
      />
    </div>
  );
}
