"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";

import { useDexDisplayEntriesForSelectedGame } from "@/components/dex";
import { Navigation } from "@/components/navigation";
import {
  TYPE_NAMES,
  formatDexTileDisplayName,
  getDexEntryTypeNames,
} from "@/lib/dex";
import type { DexDisplayEntry, FormId, TypeName } from "@/lib/dex";
import { SITE_NAME } from "@/lib/site";

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

export function TeamBuilderScreen() {
  const dexEntries = useDexDisplayEntriesForSelectedGame();
  const [teamSlots, setTeamSlots] = useState<(DexDisplayEntry | null)[]>(() =>
    Array.from({ length: TEAM_SIZE }, () => null),
  );

  const selectorNames = useMemo(
    () =>
      dexEntries.map((e) => ({
        entry: e,
        label: formatDexTileDisplayName(e.dexName, e.formId),
      })),
    [dexEntries],
  );

  /** National dex numbers already occupying a team slot (one form per species). */
  const teamDexNumbers = useMemo(
    () => new Set(teamSlots.flatMap((s) => (s ? [s.dexNumber] : []))),
    [teamSlots],
  );

  const handleSlotDrop = useCallback((slotIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData(DEX_ENTRY_DRAG_MIME);
    const entry = parseDexEntryFromDrag(raw);
    if (!entry) return;
    setTeamSlots((prev) => {
      const speciesTakenElsewhere = prev.some(
        (s, j) =>
          j !== slotIndex && s !== null && s.dexNumber === entry.dexNumber,
      );
      if (speciesTakenElsewhere) return prev;
      const next = [...prev];
      next[slotIndex] = entry;
      return next;
    });
  }, []);

  const handleSlotDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

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

        <div className="mt-6 flex min-h-0 flex-1 flex-col gap-0 overflow-hidden rounded-xl border border-black/10 bg-white/40 lg:mt-8 lg:flex-row">
          <section
            aria-label="Team workspace"
            className="flex min-h-0 flex-1 flex-col overflow-hidden border-b border-black/10 p-4 sm:p-5 lg:w-1/3 lg:flex-none lg:border-b-0 lg:border-r"
          >
            <h2 className="shrink-0 text-xs font-semibold uppercase tracking-widest text-black/50">
              Team
            </h2>
            <ol
              className="mt-3 grid min-h-0 flex-1 grid-cols-2 gap-2 overflow-y-auto pr-0.5"
              aria-label="Team slots"
            >
              {teamSlots.map((slot, i) => (
                <li
                  key={i}
                  className="flex min-h-[6.25rem] flex-col rounded-lg border border-dashed border-black/20 bg-white/60 p-2"
                  aria-label={
                    slot
                      ? `Team slot ${i + 1}: ${formatDexTileDisplayName(slot.dexName, slot.formId)}`
                      : `Team slot ${i + 1} of ${TEAM_SIZE}, empty`
                  }
                  onDragOver={handleSlotDragOver}
                  onDrop={(e) => handleSlotDrop(i, e)}
                >
                  <span className="text-[10px] font-semibold tabular-nums text-black/35">
                    {i + 1}
                  </span>
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
          </section>

          <section
            aria-label="Selector workspace"
            className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-4 sm:p-5 lg:w-2/3 lg:flex-none"
          >
            <h2 className="shrink-0 text-xs font-semibold uppercase tracking-widest text-black/50">
              Selector
            </h2>
            {selectorNames.length === 0 ? (
              <p className="mt-3 shrink-0 text-sm text-black/50">
                No Pokémon match the current game filter.
              </p>
            ) : (
              <div className="mt-3 min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1 [scrollbar-gutter:stable]">
                <ul
                  className="grid list-none grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5 lg:gap-6"
                  aria-label="Pokémon available for your team"
                >
                  {selectorNames.flatMap(({ entry, label }, i) => {
                    const nodes: ReactNode[] = [];
                    if (i > 0 && i % SELECTOR_ROW_BREAK_EVERY === 0) {
                      nodes.push(
                        <li
                          key={`selector-break-${i}`}
                          className="col-span-full list-none"
                          aria-hidden="true"
                        >
                          <div className="my-3 border-t border-black/10 sm:my-4" />
                        </li>,
                      );
                    }
                    const speciesOnTeam = teamDexNumbers.has(entry.dexNumber);
                    nodes.push(
                      <li
                        key={entry.key}
                        draggable={!speciesOnTeam}
                        title={
                          speciesOnTeam
                            ? "This species is already on your team (one form per Pokémon)."
                            : undefined
                        }
                        aria-disabled={speciesOnTeam}
                        onDragStart={(e) => {
                          e.dataTransfer.setData(
                            DEX_ENTRY_DRAG_MIME,
                            serializeDexEntryForDrag(entry),
                          );
                          e.dataTransfer.effectAllowed = "copy";
                        }}
                        className={[
                          "flex min-h-[6.75rem] flex-col items-stretch justify-between gap-1.5 rounded-xl border border-black/10 p-2.5 text-center text-sm font-medium leading-snug select-none",
                          speciesOnTeam
                            ? "cursor-not-allowed border-black/5 bg-black/[0.03] text-black/35"
                            : "cursor-grab bg-white/60 text-black hover:border-black/20 hover:bg-white/80 active:cursor-grabbing",
                        ].join(" ")}
                      >
                        <span className="line-clamp-3">{label}</span>
                        <TypeBadges
                          typeNames={getDexEntryTypeNames(entry)}
                          size="default"
                        />
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
    </div>
  );
}
