"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import { GAME_IDS, VALID_GAMES } from "@/lib/dex";
import type { GameId } from "@/lib/dex";

const STORAGE_KEY = "p-champ:selected-game";

function defaultGameId(): GameId {
  return VALID_GAMES[0] ?? GAME_IDS.CHAMPIONS;
}

function isGameId(value: string): value is GameId {
  return (VALID_GAMES as readonly string[]).includes(value);
}

function readStoredGameId(): GameId | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && isGameId(raw)) return raw;
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

function getSnapshot(): GameId {
  return readStoredGameId() ?? defaultGameId();
}

function getServerSnapshot(): GameId {
  return defaultGameId();
}

function persistGameId(gameId: GameId) {
  try {
    localStorage.setItem(STORAGE_KEY, gameId);
  } catch {
    /* ignore */
  }
  emit();
}

type GameSelectionContextValue = {
  selectedGameId: GameId;
  setSelectedGameId: (gameId: GameId) => void;
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

  const setSelectedGameId = useCallback((gameId: GameId) => {
    persistGameId(gameId);
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
