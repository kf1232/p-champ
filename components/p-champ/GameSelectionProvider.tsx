"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import { DEX_LIST_VIEW_IDS, GAME_IDS } from "@/lib/p-champ/dex";
import type { DexListViewId } from "@/lib/p-champ/dex";
import { APP_STORAGE_KEYS, appLocalStorage } from "@/lib/storage";

const selectedGameStorage = appLocalStorage(APP_STORAGE_KEYS.selectedGame);

function defaultDexListViewId(): DexListViewId {
  return GAME_IDS.CHAMPIONS;
}

function isDexListViewId(value: string): value is DexListViewId {
  return (DEX_LIST_VIEW_IDS as readonly string[]).includes(value);
}

function readStoredDexListViewId(): DexListViewId | null {
  const raw = selectedGameStorage.read();
  if (raw && isDexListViewId(raw)) {
    return raw;
  }
  return null;
}

function getSnapshot(): DexListViewId {
  return readStoredDexListViewId() ?? defaultDexListViewId();
}

function getServerSnapshot(): DexListViewId {
  return defaultDexListViewId();
}

type GameSelectionContextValue = {
  selectedGameId: DexListViewId;
  setSelectedGameId: (viewId: DexListViewId) => void;
};

const GameSelectionContext = createContext<GameSelectionContextValue | null>(
  null,
);

export function GameSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const selectedGameId = useSyncExternalStore(
    selectedGameStorage.subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setSelectedGameId = useCallback((viewId: DexListViewId) => {
    selectedGameStorage.write(viewId);
  }, []);

  const value = useMemo(
    () => ({ selectedGameId, setSelectedGameId }),
    [selectedGameId, setSelectedGameId],
  );

  return (
    <GameSelectionContext.Provider value={value}>
      {children}
    </GameSelectionContext.Provider>
  );
}

export function useGameSelection(): GameSelectionContextValue {
  const ctx = useContext(GameSelectionContext);
  if (!ctx) {
    throw new Error(
      "useGameSelection must be used within GameSelectionProvider",
    );
  }
  return ctx;
}
