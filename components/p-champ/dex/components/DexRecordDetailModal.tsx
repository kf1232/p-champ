"use client";

import { useCallback, useEffect, useMemo } from "react";

import {
  PhysicalDamageCategoryIcon,
  SpecialDamageCategoryIcon,
  SpeedStatIcon,
} from "./MoveDamageCategoryIcons";
import { StatSpreadSliders } from "../../team-builder/StatSpreadSliders";
import { TypeBadges } from "../../team-builder/TypeBadges";
import {
  DEX_STAT_TODO,
  ZERO_STAT_SPREAD,
  attackerVsDefenderBaseSpeedDiff,
  attackerVsDefenderBaseStatDiffs,
  classifyDexEntriesByBestStabVsDefender,
  formatDexTileDisplayName,
  formatSignedBaseStatDiff,
  getDexEntryTypeNames,
} from "@/lib/dex";
import type { DexDisplayEntry, StatSpread } from "@/lib/dex";

type DexRecordDetailModalProps = {
  record: DexDisplayEntry | null;
  allRecords: readonly DexDisplayEntry[];
  /**
   * Entries used to build STAB matchup buckets. Defaults to `allRecords`.
   * Pass your team (or another subset) to scope who appears as attackers.
   */
  matchupRecordsForBuckets?: readonly DexDisplayEntry[];
  onClose: () => void;
  /** Per-species/form stat spread for matchup math (base + spread). */
  statSpreadByKey: Readonly<Record<string, StatSpread>>;
  onStatSpreadChange: (entryKey: string, spread: StatSpread) => void;
  /** Open this Pokémon in the modal with matchups limited to the current team. */
  onThreatEntryDoubleClick?: (entry: DexDisplayEntry) => void;
  /** Blue = viewing your team member (full dex); red = threat drill-in or selector Pokémon. */
  detailAccent: "team" | "threat";
  /** When true, dismiss returns to the previous detail (e.g. your team Pokémon) instead of closing. */
  hasPreviousDetail: boolean;
};

function statPill(label: string, value: number | undefined) {
  const display =
    value === undefined || value === DEX_STAT_TODO ? "—" : String(value);
  return (
    <div className="flex min-w-[4.5rem] flex-col items-center rounded-lg border border-black/10 bg-white/80 px-3 py-2 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-black/45">
        {label}
      </div>
      <div className="text-base font-semibold tabular-nums text-black">{display}</div>
    </div>
  );
}

function MatchupColumn({
  title,
  subtitle,
  defender,
  entries,
  getSpread,
  onThreatEntryDoubleClick,
}: {
  title: string;
  subtitle: string;
  defender: DexDisplayEntry;
  entries: DexDisplayEntry[];
  getSpread: (key: string) => StatSpread;
  onThreatEntryDoubleClick?: (entry: DexDisplayEntry) => void;
}) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col rounded-xl border border-black/10 bg-white/50">
      <div className="shrink-0 border-b border-black/10 px-3 py-2">
        <h3 className="text-sm font-semibold text-black">{title}</h3>
        <p className="text-xs text-black/50">{subtitle}</p>
      </div>
      <ul
        className="max-h-[min(22rem,50vh)] list-none overflow-y-auto p-2"
        aria-label={`${title}: ${entries.length} Pokémon`}
      >
        {entries.length === 0 ? (
          <li className="px-2 py-4 text-center text-sm text-black/45">None</li>
        ) : (
          entries.map((e) => {
            const { phys, spec } = attackerVsDefenderBaseStatDiffs(e, defender, {
              attackerSpread: getSpread(e.key),
              defenderSpread: getSpread(defender.key),
            });
            const speedDiff = attackerVsDefenderBaseSpeedDiff(e, defender, {
              attackerSpread: getSpread(e.key),
              defenderSpread: getSpread(defender.key),
            });
            const mirror = e.key === defender.key;
            const speedTitle =
              speedDiff === null
                ? "Speed"
                : mirror
                  ? "Speed: incoming uses base Spe; your Pokémon uses spread"
                  : "Speed (attacker Spe − defender Spe, incl. spread)";
            const physTitle = mirror
              ? "Physical: incoming uses base Atk; your Pokémon uses spread on Def"
              : "Physical (Atk − defender Def)";
            const specTitle = mirror
              ? "Special: incoming uses base Sp.Atk; your Pokémon uses spread on Sp.Def"
              : "Special (Sp.Atk − defender Sp.Def)";

            return (
              <li
                key={e.key}
                className={[
                  "flex flex-col gap-2 rounded-lg border border-transparent px-2 py-2 hover:border-black/10 hover:bg-white/80",
                  onThreatEntryDoubleClick ? "cursor-pointer" : "",
                ].join(" ")}
                title={
                  onThreatEntryDoubleClick
                    ? "Double-click to open this Pokémon with matchups scoped to your team."
                    : undefined
                }
                onDoubleClick={() => onThreatEntryDoubleClick?.(e)}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="min-w-0 flex-1 text-base font-medium leading-snug text-black">
                    {formatDexTileDisplayName(e.dexName, e.formId)}
                  </span>
                  <div className="shrink-0 pt-0.5">
                    <TypeBadges typeNames={getDexEntryTypeNames(e)} size="default" />
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center gap-x-2 text-sm tabular-nums text-black/60">
                  <span
                    className="flex min-w-0 items-center justify-start gap-1.5"
                    title={physTitle}
                  >
                    <PhysicalDamageCategoryIcon className="h-4 w-4 shrink-0 text-orange-600" />
                    {formatSignedBaseStatDiff(phys)}
                  </span>
                  <span
                    className="flex min-w-0 items-center justify-center gap-1.5"
                    title={specTitle}
                  >
                    <SpecialDamageCategoryIcon className="h-4 w-4 shrink-0 text-sky-600" />
                    {formatSignedBaseStatDiff(spec)}
                  </span>
                  <span
                    className="flex min-w-0 items-center justify-end gap-1.5"
                    title={speedTitle}
                  >
                    <SpeedStatIcon className="h-4 w-4 shrink-0 text-emerald-700" />
                    {formatSignedBaseStatDiff(speedDiff)}
                  </span>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export function DexRecordDetailModal({
  record,
  allRecords,
  matchupRecordsForBuckets,
  onClose,
  statSpreadByKey,
  onStatSpreadChange,
  onThreatEntryDoubleClick,
  detailAccent,
  hasPreviousDetail,
}: DexRecordDetailModalProps) {
  const getSpread = useCallback(
    (key: string) => statSpreadByKey[key] ?? ZERO_STAT_SPREAD,
    [statSpreadByKey],
  );

  const bucketSource = matchupRecordsForBuckets ?? allRecords;
  /** Parent passes `matchupRecordsForBuckets` only when bucketing should not use the full dex. */
  const teamScopedMatchups = matchupRecordsForBuckets !== undefined;

  const buckets = useMemo(() => {
    if (!record) {
      return {
        neutral: [] as DexDisplayEntry[],
        effective: [] as DexDisplayEntry[],
        superEffective: [] as DexDisplayEntry[],
      };
    }
    return classifyDexEntriesByBestStabVsDefender(record, bucketSource, {
      getSpread,
    });
  }, [record, bucketSource, getSpread]);

  useEffect(() => {
    if (!record) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [record, onClose]);

  if (!record) return null;

  const displayName = formatDexTileDisplayName(record.dexName, record.formId);
  const hasForm = Boolean(record.form);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dex-record-modal-title"
        className="flex max-h-[min(92vh,900px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-black/15 bg-[#f8f8f6] shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          className={[
            "h-[5px] w-full shrink-0 rounded-t-2xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.25)]",
            detailAccent === "team"
              ? "bg-blue-600 shadow-blue-600/45"
              : "bg-red-600 shadow-red-600/40",
          ].join(" ")}
          aria-hidden
        />
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-black/10 px-5 py-4">
          <div className="min-w-0">
            <h2
              id="dex-record-modal-title"
              className="truncate text-xl font-semibold tracking-tight text-black"
            >
              {displayName}
            </h2>
            <p className="mt-1 text-sm text-black/55">
              Best STAB typing vs this Pokémon (species with resisted STAB are not listed
              below).
              {teamScopedMatchups ? (
                <>
                  {" "}
                  <span className="text-amber-900/90">
                    Matchup lists are limited to your current team.
                  </span>
                </>
              ) : null}
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg border border-black/15 bg-white px-3 py-1.5 text-sm font-semibold text-black hover:bg-black/5"
            onClick={onClose}
            aria-label={
              hasPreviousDetail
                ? "Back to previous Pokémon detail"
                : "Close detail"
            }
          >
            {hasPreviousDetail ? "Back" : "Close"}
          </button>
        </header>

        {hasForm ? (
          <div className="shrink-0 border-b border-black/10 px-5 py-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-black/40">
              Base stats
            </p>
            <div className="flex flex-wrap gap-2">
              {statPill("HP", record.form!.hp)}
              {statPill("Atk", record.form!.attack)}
              {statPill("Def", record.form!.defense)}
              {statPill("SpA", record.form!.spAtk)}
              {statPill("SpD", record.form!.spDef)}
              {statPill("Spe", record.form!.speed)}
            </div>
            <div className="mt-3 min-w-0 max-w-xl">
              <StatSpreadSliders
                idPrefix={`dex-detail-${record.key}`}
                spread={getSpread(record.key)}
                onChange={(next) => onStatSpreadChange(record.key, next)}
              />
            </div>
          </div>
        ) : (
          <div className="shrink-0 border-b border-black/10 px-5 py-4 text-sm text-black/60">
            Stats not available for this form yet.
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-hidden px-5 py-4">
          <div className="flex min-h-[min(24rem,45vh)] flex-col gap-3 md:flex-row">
            <MatchupColumn
              title="Neutral"
              subtitle="1× best STAB"
              defender={record}
              entries={buckets.neutral}
              getSpread={getSpread}
              onThreatEntryDoubleClick={onThreatEntryDoubleClick}
            />
            <MatchupColumn
              title="Effective"
              subtitle="2× best STAB"
              defender={record}
              entries={buckets.effective}
              getSpread={getSpread}
              onThreatEntryDoubleClick={onThreatEntryDoubleClick}
            />
            <MatchupColumn
              title="Super effective"
              subtitle="4× or higher best STAB"
              defender={record}
              entries={buckets.superEffective}
              getSpread={getSpread}
              onThreatEntryDoubleClick={onThreatEntryDoubleClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
