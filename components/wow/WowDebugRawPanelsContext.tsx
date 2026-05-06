"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "p-champ:wow-debug-raw-panels";

function readStoredEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

type WowDebugRawPanelsContextValue = {
  enabled: boolean;
  setEnabled: (next: boolean) => void;
};

const WowDebugRawPanelsContext =
  createContext<WowDebugRawPanelsContextValue | null>(null);

export function WowDebugRawPanelsProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(false);

  useEffect(() => {
    setEnabledState(readStoredEnabled());
  }, []);

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
    try {
      if (typeof window !== "undefined") {
        if (next) window.localStorage.setItem(STORAGE_KEY, "1");
        else window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore quota / private mode
    }
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
