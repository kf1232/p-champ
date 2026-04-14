"use client";

import { useMemo } from "react";

import { useGameSelection } from "@/components/game";
import {
  dexObject,
  expandDexRecords,
  filterDexRecordsForGame,
  getDexIds,
} from "@/lib/dex";
import type { DexDisplayEntry } from "@/lib/dex";

/** Dex grid rows for the navigation game selector (enabled species only). */
export function useDexDisplayEntriesForSelectedGame(): DexDisplayEntry[] {
  const { selectedGameId } = useGameSelection();
  return useMemo(() => {
    const baseRecords = getDexIds().map((id) => dexObject[id]);
    const forGame = filterDexRecordsForGame(baseRecords, selectedGameId);
    return expandDexRecords(forGame);
  }, [selectedGameId]);
}
