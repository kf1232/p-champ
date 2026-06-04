"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { APP_STORAGE_KEYS, appLocalStorage } from "@/lib/storage";

const debugRawPanelsStorage = appLocalStorage(
  APP_STORAGE_KEYS.wowDebugRawPanels,
);

type WowDebugRawPanelsContextValue = {
  enabled: boolean;
  setEnabled: (next: boolean) => void;
};

const WowDebugRawPanelsContext =
  createContext<WowDebugRawPanelsContextValue | null>(null);

export function WowDebugRawPanelsProvider({ children }: { children: ReactNode }) {
  const enabled = useSyncExternalStore(
    debugRawPanelsStorage.subscribe,
    debugRawPanelsStorage.read,
    () => false,
  );

  const setEnabled = useCallback((next: boolean) => {
    debugRawPanelsStorage.write(next);
  }, []);

  const value = useMemo(
    () => ({ enabled, setEnabled }),
    [enabled, setEnabled],
  );

  return (
    <WowDebugRawPanelsContext.Provider value={value}>
      {children}
    </WowDebugRawPanelsContext.Provider>
  );
}

/** Outside the WoW debug provider, raw panels stay hidden and `setEnabled` is a no-op. */
export function useWowDebugRawPanels(): WowDebugRawPanelsContextValue {
  const ctx = useContext(WowDebugRawPanelsContext);
  return ctx ?? { enabled: false, setEnabled: () => {} };
}
