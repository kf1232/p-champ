"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import { DEX_LIST_VIEW_IDS, GAME_IDS } from "@/lib/dex";
import type { DexListViewId } from "@/lib/dex";

const STORAGE_KEY = "p-champ:selected-game";

function defaultDexListViewId(): DexListViewId {
  return GAME_IDS.CHAMPIONS;
}

function isDexListViewId(value: string): value is DexListViewId {
  return (DEX_LIST_VIEW_IDS as readonly string[]).includes(value);
}

function readStoredDexListViewId(): DexListViewId | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && isDexListViewId(raw)) return raw;
  } catch {
    /* ignore */
  }
  return null;
}

let listeners: Array<() => void> = [];

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function emit() {
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) emit();
  });
}

function getSnapshot(): DexListViewId {
  return readStoredDexListViewId() ?? defaultDexListViewId();
}

function getServerSnapshot(): DexListViewId {
  return defaultDexListViewId();
}

function persistDexListViewId(viewId: DexListViewId) {
  try {
    localStorage.setItem(STORAGE_KEY, viewId);
  } catch {
    /* ignore */
  }
  emit();
}

type GameSelectionContextValue = {
  selectedGameId: DexListViewId;
  setSelectedGameId: (viewId: DexListViewId) => void;
};

const GameSelectionContext = createContext<GameSelectionContextValue | null>(
  null
);

export function GameSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const selectedGameId = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const setSelectedGameId = useCallback((viewId: DexListViewId) => {
    persistDexListViewId(viewId);
  }, []);

  const value = useMemo(
    () => ({ selectedGameId, setSelectedGameId }),
    [selectedGameId, setSelectedGameId]
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
      "useGameSelection must be used within GameSelectionProvider"
    );
  }
  return ctx;
}
