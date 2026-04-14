"use client";

import { useMemo } from "react";

import { useGameSelection } from "@/components/game";
import {
  dexObject,
  expandDexRecords,
  filterDexRecordsForListView,
  getDexIds,
} from "@/lib/dex";
import type { DexDisplayEntry } from "@/lib/dex";

/** Dex grid rows: all species for National, or `games[gameId] === true` for a game. */
export function useDexDisplayEntriesForSelectedGame(): DexDisplayEntry[] {
  const { selectedGameId } = useGameSelection();
  return useMemo(() => {
    const baseRecords = getDexIds().map((id) => dexObject[id]);
    const forGame = filterDexRecordsForListView(baseRecords, selectedGameId);
    return expandDexRecords(forGame);
  }, [selectedGameId]);
}
