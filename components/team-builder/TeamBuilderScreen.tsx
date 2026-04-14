"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  DexRecordDetailModal,
  useDexDisplayEntriesForSelectedGame,
} from "@/components/dex";
import { useGameSelection } from "@/components/game";
import { Navigation } from "@/components/navigation";
import {
  NATIONAL_VIEW_ID,
  TYPE_NAMES,
  computeSelectorTeamMatchupPerSlot,
  defThreatScoreFromSlots,
  formatTypeLabel,
  type MatchupSlotCell,
  dexObject,
  formatDexTileDisplayName,
  getDexEntryTypeNames,
} from "@/lib/dex";
import type {
  DexDisplayEntry,
  DexListViewId,
  FormId,
  TypeName,
} from "@/lib/dex";
import { SITE_NAME } from "@/lib/site";

import { SelectorMatchupGrid } from "./SelectorMatchupGrid";
import { TypeBadges } from "./TypeBadges";

const TEAM_BUILDER_TITLE = "Team Builder";
const TEAM_BUILDER_DESCRIPTION =
  "Build and manage Pokémon teams. More tools will land here as the feature grows.";

const TEAM_SIZE = 6;

/** Match {@link DexRecordGrid}: visual break every N items. */
const SELECTOR_ROW_BREAK_EVERY = 30;

const DEX_ENTRY_DRAG_MIME = "application/x-p-champ-dex-entry+json";

const VALID_TYPE_NAMES = new Set<string>(
  Object.values(TYPE_NAMES) as TypeName[],
);

/** Stable order for type filter dropdowns. */
const TYPE_NAMES_ORDERED = (Object.values(TYPE_NAMES) as TypeName[]).slice()
  .sort((a, b) => a.localeCompare(b));

function dexEntryMatchesTypeFilters(
  entry: DexDisplayEntry,
  filterA: TypeName | null,
  filterB: TypeName | null,
): boolean {
  const types = getDexEntryTypeNames(entry);

  if (filterA && filterB && filterA === filterB) {
    return types.length === 1 && types[0] === filterA;
  }

  const required = new Set<TypeName>();
  if (filterA) required.add(filterA);
  if (filterB) required.add(filterB);
  if (required.size === 0) return true;
  const entryTypes = new Set(types);
  for (const t of required) {
    if (!entryTypes.has(t)) return false;
  }
  return true;
}

function serializeDexEntryForDrag(entry: DexDisplayEntry): string {
  return JSON.stringify({
    key: entry.key,
    dexNumber: entry.dexNumber,
    dexName: entry.dexName,
    formId: entry.formId,
    typeNames: getDexEntryTypeNames(entry),
  });
}

function parseDexEntryFromDrag(raw: string): DexDisplayEntry | null {
  try {
    const o = JSON.parse(raw) as unknown;
    if (!o || typeof o !== "object") return null;
    const rec = o as Record<string, unknown>;
    if (
      typeof rec.key !== "string" ||
      typeof rec.dexNumber !== "number" ||
      typeof rec.dexName !== "string" ||
      typeof rec.formId !== "string"
    ) {
      return null;
    }

    let typeNames: TypeName[] | undefined;
    if (rec.typeNames !== undefined) {
      if (!Array.isArray(rec.typeNames)) return null;
      for (const n of rec.typeNames) {
        if (typeof n !== "string" || !VALID_TYPE_NAMES.has(n)) return null;
      }
      typeNames = rec.typeNames as TypeName[];
    }

    return {
      key: rec.key,
      dexNumber: rec.dexNumber,
      dexName: rec.dexName,
      formId: rec.formId as FormId,
      typeNames,
    };
  } catch {
    return null;
  }
}

/** Aligns with {@link filterDexRecordsForListView}: National allows all species; a game only species with `games[viewId]`. */
function isTeamEntryValidForView(
  entry: DexDisplayEntry,
  viewId: DexListViewId,
): boolean {
  if (viewId === NATIONAL_VIEW_ID) return true;
  const record = dexObject[entry.dexNumber];
  if (!record) return false;
  return record.games[viewId] === true;
}

export function TeamBuilderScreen() {
  const { selectedGameId } = useGameSelection();
  const dexEntries = useDexDisplayEntriesForSelectedGame();
  const [teamSlots, setTeamSlots] = useState<(DexDisplayEntry | null)[]>(() =>
    Array.from({ length: TEAM_SIZE }, () => null),
  );
  const [typeFilterA, setTypeFilterA] = useState<TypeName | null>(null);
  const [typeFilterB, setTypeFilterB] = useState<TypeName | null>(null);
  const [nameFilter, setNameFilter] = useState("");
  const [gridSort, setGridSort] = useState<
    "default" | "threat-desc" | "threat-asc"
  >("default");
  const [flashSlotIndex, setFlashSlotIndex] = useState<number | null>(null);
  const [selectorDetailEntry, setSelectorDetailEntry] =
    useState<DexDisplayEntry | null>(null);
  const flashClearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    setTeamSlots((prev) =>
      prev.map((slot) =>
        slot && !isTeamEntryValidForView(slot, selectedGameId) ? null : slot,
      ),
    );
  }, [selectedGameId]);

  useEffect(() => {
    return () => {
      if (flashClearTimeoutRef.current) {
        clearTimeout(flashClearTimeoutRef.current);
      }
    };
  }, []);

  const nameFilterNorm = nameFilter.trim().toLowerCase();

  const filteredDexEntries = useMemo(() => {
    return dexEntries.filter((e) => {
      if (!dexEntryMatchesTypeFilters(e, typeFilterA, typeFilterB)) return false;
      if (!nameFilterNorm) return true;
      const label = formatDexTileDisplayName(e.dexName, e.formId).toLowerCase();
      return (
        label.includes(nameFilterNorm) ||
        e.dexName.toLowerCase().includes(nameFilterNorm)
      );
    });
  }, [dexEntries, typeFilterA, typeFilterB, nameFilterNorm]);

  const selectorNames = useMemo(
    () =>
      filteredDexEntries.map((e) => ({
        entry: e,
        label: formatDexTileDisplayName(e.dexName, e.formId),
      })),
    [filteredDexEntries],
  );

  /** National dex numbers already occupying a team slot (one form per species). */
  const teamDexNumbers = useMemo(
    () => new Set(teamSlots.flatMap((s) => (s ? [s.dexNumber] : []))),
    [teamSlots],
  );

  const matchupByKey = useMemo(() => {
    const m = new Map<string, (MatchupSlotCell | null)[]>();
    for (const row of selectorNames) {
      m.set(
        row.entry.key,
        computeSelectorTeamMatchupPerSlot(row.entry, teamSlots),
      );
    }
    return m;
  }, [selectorNames, teamSlots]);

  const sortedSelectorNames = useMemo(() => {
    const rows = selectorNames.slice();
    if (gridSort === "default") return rows;
    return rows.sort((a, b) => {
      const sa = defThreatScoreFromSlots(matchupByKey.get(a.entry.key) ?? []);
      const sb = defThreatScoreFromSlots(matchupByKey.get(b.entry.key) ?? []);
      if (sa !== sb) {
        return gridSort === "threat-desc" ? sb - sa : sa - sb;
      }
      return a.label.localeCompare(b.label);
    });
  }, [selectorNames, gridSort, matchupByKey]);

  const handleSlotDrop = useCallback((slotIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData(DEX_ENTRY_DRAG_MIME);
    const entry = parseDexEntryFromDrag(raw);
    if (!entry) return;

    const existingIndex = teamSlots.findIndex(
      (s) => s !== null && s.dexNumber === entry.dexNumber,
    );
    const slotToFlash = existingIndex !== -1 ? existingIndex : slotIndex;

    setTeamSlots((prev) => {
      const next = [...prev];
      const idx = next.findIndex(
        (s) => s !== null && s.dexNumber === entry.dexNumber,
      );
      if (idx !== -1) {
        next[idx] = entry;
        return next;
      }
      next[slotIndex] = entry;
      return next;
    });

    if (flashClearTimeoutRef.current) {
      clearTimeout(flashClearTimeoutRef.current);
    }
    setFlashSlotIndex(null);
    requestAnimationFrame(() => {
      setFlashSlotIndex(slotToFlash);
      flashClearTimeoutRef.current = setTimeout(() => {
        setFlashSlotIndex(null);
        flashClearTimeoutRef.current = null;
      }, 650);
    });
  }, [teamSlots]);

  const handleSlotDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const clearSlot = useCallback((slotIndex: number) => {
    setTeamSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  }, []);

  const clearAllTeam = useCallback(() => {
    setTeamSlots(Array.from({ length: TEAM_SIZE }, () => null));
  }, []);

  const clearAllFilters = useCallback(() => {
    setTypeFilterA(null);
    setTypeFilterB(null);
    setNameFilter("");
  }, []);

  const closeSelectorDetail = useCallback(
    () => setSelectorDetailEntry(null),
    [],
  );

  const hasActiveFilters =
    typeFilterA !== null || typeFilterB !== null || nameFilter.trim() !== "";
  const hasTeamMembers = teamSlots.some((s) => s !== null);

  return (
    <div className="flex h-dvh max-h-dvh min-h-0 flex-col overflow-hidden">
      <Navigation title={SITE_NAME} />

      <main className="mx-auto flex w-full max-w-7xl min-h-0 flex-1 flex-col overflow-hidden px-6 py-6">
        <div className="shrink-0">
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            {TEAM_BUILDER_TITLE}
          </h1>
          <p className="mt-1 max-w-prose text-black/70">
            {TEAM_BUILDER_DESCRIPTION}
          </p>
        </div>

        <div className="mt-6 flex min-h-0 flex-1 flex-col gap-0 overflow-hidden rounded-xl border border-black/30 bg-white/40 lg:mt-8 lg:flex-row">
          <section
            aria-label="Team workspace"
            className="flex min-h-0 flex-1 flex-col overflow-hidden border-b border-black/25 p-4 sm:p-5 lg:w-1/3 lg:flex-none lg:border-b-0 lg:border-r lg:border-black/25"
          >
            <ol
              className="grid min-h-0 flex-1 grid-cols-2 gap-2 overflow-y-auto pr-0.5"
              aria-label="Team slots"
            >
              {teamSlots.map((slot, i) => (
                <li
                  key={i}
                  className={[
                    "flex min-h-[6.25rem] flex-col rounded-lg border border-dashed border-black/45 bg-white/60 p-2",
                    flashSlotIndex === i ? "animate-team-slot-flash" : "",
                    slot ? "cursor-pointer" : "",
                  ].join(" ")}
                  aria-label={
                    slot
                      ? `Team slot ${i + 1}: ${formatDexTileDisplayName(slot.dexName, slot.formId)}`
                      : `Team slot ${i + 1} of ${TEAM_SIZE}, empty`
                  }
                  title={
                    slot
                      ? "Double-click for stats and type matchups."
                      : undefined
                  }
                  onDragOver={handleSlotDragOver}
                  onDrop={(e) => handleSlotDrop(i, e)}
                  onDoubleClick={() => {
                    if (slot) setSelectorDetailEntry(slot);
                  }}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[10px] font-semibold tabular-nums text-black/35">
                      {i + 1}
                    </span>
                    {slot ? (
                      <button
                        type="button"
                        className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium text-black/45 hover:bg-red-500/10 hover:text-red-800"
                        onClick={() => clearSlot(i)}
                        onDoubleClick={(e) => e.stopPropagation()}
                        aria-label={`Remove ${formatDexTileDisplayName(slot.dexName, slot.formId)} from slot ${i + 1}`}
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                  {slot ? (
                    <>
                      <p className="mt-1 line-clamp-2 text-xs font-medium leading-snug text-black">
                        {formatDexTileDisplayName(slot.dexName, slot.formId)}
                      </p>
                      <div className="mt-auto pt-1">
                        <TypeBadges
                          typeNames={getDexEntryTypeNames(slot)}
                          size="compact"
                        />
                      </div>
                    </>
                  ) : (
                    <p className="mt-1 text-[10px] text-black/35">Drop here</p>
                  )}
                </li>
              ))}
            </ol>
            <div className="shrink-0 border-t border-black/15 pt-3">
              <button
                type="button"
                onClick={clearAllTeam}
                disabled={!hasTeamMembers}
                aria-label="Clear all team slots"
                className="w-full rounded-md border border-black/25 bg-white/80 px-3 py-2 text-xs font-medium text-black/70 shadow-sm hover:bg-black/[0.04] hover:text-black disabled:cursor-not-allowed disabled:border-black/10 disabled:bg-black/[0.02] disabled:text-black/30"
              >
                Clear team
              </button>
            </div>
          </section>

          <section
            aria-label="Selector workspace"
            className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-4 sm:p-5 lg:w-2/3 lg:flex-none"
          >
            <div className="flex w-full shrink-0 flex-wrap items-end justify-end gap-2 sm:gap-3">
              <div className="flex min-w-0 flex-col items-end gap-1">
                <label
                  htmlFor="team-builder-name-filter"
                  className="text-[10px] font-semibold uppercase tracking-wide text-black/45"
                >
                  Name
                </label>
                <input
                  id="team-builder-name-filter"
                  type="search"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  placeholder="Search…"
                  autoComplete="off"
                  className="min-w-[9rem] max-w-full rounded-md border border-black/25 bg-white/80 px-2 py-1.5 text-right text-xs text-black shadow-sm placeholder:text-black/35"
                  aria-label="Filter Pokémon by name"
                />
              </div>
              <div className="flex min-w-0 flex-col items-end gap-1">
                <label
                  htmlFor="team-builder-sort"
                  className="text-[10px] font-semibold uppercase tracking-wide text-black/45"
                >
                  Sort
                </label>
                <select
                  id="team-builder-sort"
                  value={gridSort}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "threat-desc" || v === "threat-asc") setGridSort(v);
                    else setGridSort("default");
                  }}
                  className="min-w-[11rem] max-w-full rounded-md border border-black/25 bg-white/80 px-2 py-1.5 text-right text-xs text-black shadow-sm"
                  aria-label="Sort Pokémon grid"
                >
                  <option value="default">Default (unsorted)</option>
                  <option value="threat-desc">Threat (high → low)</option>
                  <option value="threat-asc">Threat (low → high)</option>
                </select>
              </div>
              <div className="flex min-w-0 flex-col items-end gap-1">
                <label
                  htmlFor="team-builder-type-a"
                  className="text-[10px] font-semibold uppercase tracking-wide text-black/45"
                >
                  Type 1
                </label>
                <select
                  id="team-builder-type-a"
                  value={typeFilterA ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setTypeFilterA(v === "" ? null : (v as TypeName));
                  }}
                  className="min-w-[7.5rem] max-w-full rounded-md border border-black/25 bg-white/80 px-2 py-1.5 text-right text-xs text-black shadow-sm"
                >
                  <option value="">Any</option>
                  {TYPE_NAMES_ORDERED.map((t) => (
                    <option key={t} value={t}>
                      {formatTypeLabel(t)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex min-w-0 flex-col items-end gap-1">
                <label
                  htmlFor="team-builder-type-b"
                  className="text-[10px] font-semibold uppercase tracking-wide text-black/45"
                >
                  Type 2
                </label>
                <select
                  id="team-builder-type-b"
                  value={typeFilterB ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setTypeFilterB(v === "" ? null : (v as TypeName));
                  }}
                  className="min-w-[7.5rem] max-w-full rounded-md border border-black/25 bg-white/80 px-2 py-1.5 text-right text-xs text-black shadow-sm"
                >
                  <option value="">Any</option>
                  {TYPE_NAMES_ORDERED.map((t) => (
                    <option key={t} value={t}>
                      {formatTypeLabel(t)}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={clearAllFilters}
                disabled={!hasActiveFilters}
                aria-label="Clear name and type filters"
                className="rounded-md border border-black/25 bg-white/80 px-2.5 py-1.5 text-xs font-medium text-black/70 shadow-sm hover:bg-black/[0.04] hover:text-black disabled:cursor-not-allowed disabled:border-black/10 disabled:bg-black/[0.02] disabled:text-black/30"
              >
                Clear all filters
              </button>
            </div>
            {dexEntries.length === 0 ? (
              <p className="mt-3 shrink-0 text-sm text-black/50">
                No Pokémon match the current game filter.
              </p>
            ) : filteredDexEntries.length === 0 ? (
              <p className="mt-3 shrink-0 text-sm text-black/50">
                No Pokémon match the current name or type filters. Adjust the
                search, choose &quot;Any&quot; for types, or pick two different
                types (same type in both slots = pure single-type only).
              </p>
            ) : (
              <div className="mt-3 min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1 [scrollbar-gutter:stable]">
                <ul
                  className="grid list-none grid-cols-3 gap-4 sm:gap-5"
                  aria-label="Pokémon available for your team"
                >
                  {sortedSelectorNames.flatMap(({ entry, label }, i) => {
                    const nodes: ReactNode[] = [];
                    if (i > 0 && i % SELECTOR_ROW_BREAK_EVERY === 0) {
                      nodes.push(
                        <li
                          key={`selector-break-${i}`}
                          className="col-span-full list-none"
                          aria-hidden="true"
                        >
                          <div className="my-3 border-t border-black/25 sm:my-4" />
                        </li>,
                      );
                    }
                    const speciesOnTeam = teamDexNumbers.has(entry.dexNumber);
                    const matchupSlots =
                      matchupByKey.get(entry.key) ??
                      Array.from(
                        { length: TEAM_SIZE },
                        () => null as MatchupSlotCell | null,
                      );
                    const dragTitle = speciesOnTeam
                      ? "Species on your team — drop on any slot to change its form in the slot it already occupies."
                      : undefined;
                    const detailTitle = [dragTitle, "Double-click for stats and type matchups."]
                      .filter(Boolean)
                      .join(" ");
                    nodes.push(
                      <li
                        key={entry.key}
                        draggable
                        title={detailTitle}
                        onDoubleClick={() => setSelectorDetailEntry(entry)}
                        onDragStart={(e) => {
                          e.dataTransfer.setData(
                            DEX_ENTRY_DRAG_MIME,
                            serializeDexEntryForDrag(entry),
                          );
                          e.dataTransfer.effectAllowed = "copy";
                        }}
                        className={[
                          "flex h-full min-h-0 flex-col gap-2 rounded-xl border border-black/35 p-2.5 text-sm font-medium leading-snug select-none sm:gap-2.5 sm:p-3",
                          "cursor-grab bg-white/60 text-black hover:border-black/50 hover:bg-white/80 active:cursor-grabbing",
                          speciesOnTeam ? "ring-1 ring-inset ring-amber-500/35" : "",
                        ].join(" ")}
                      >
                        <header className="shrink-0 text-center">
                          <h3 className="line-clamp-3 text-sm font-semibold leading-tight text-black">
                            {label}
                          </h3>
                        </header>
                        <div className="flex min-h-0 w-full flex-1 flex-col justify-center">
                          <SelectorMatchupGrid slots={matchupSlots} />
                        </div>
                        <footer className="shrink-0 flex justify-center">
                          <TypeBadges
                            typeNames={getDexEntryTypeNames(entry)}
                            size="default"
                          />
                        </footer>
                      </li>,
                    );
                    return nodes;
                  })}
                </ul>
              </div>
            )}
          </section>
        </div>
      </main>

      <DexRecordDetailModal
        record={selectorDetailEntry}
        allRecords={dexEntries}
        onClose={closeSelectorDetail}
      />
    </div>
  );
}
