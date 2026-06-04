"use client";

import { useMemo } from "react";

import { useGameSelection } from "../GameSelectionProvider";
import {
  dexObject,
  expandDexRecords,
  filterDexRecordsForListView,
  getDexIds,
} from "@/lib/p-champ/dex";
import type { DexDisplayEntry } from "@/lib/p-champ/dex";

/** Dex grid rows: all species for National, or `games[gameId] === true` for a game. */
export function useDexDisplayEntriesForSelectedGame(): DexDisplayEntry[] {
  const { selectedGameId } = useGameSelection();
  return useMemo(() => {
    const baseRecords = getDexIds().map((id) => dexObject[id]);
    const forGame = filterDexRecordsForListView(baseRecords, selectedGameId);
    return expandDexRecords(forGame);
  }, [selectedGameId]);
}
