"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type AppStorageFooterConfig = {
  ariaLabel: string;
  ttlMs: number;
  storedAt: number | null;
  cacheByteSize: number;
  /** Shown in sr-only text after cache size (e.g. tool id). */
  serviceId: string;
  onDownload: () => void;
  onClear: () => void;
  clearConfirmMessage: string;
};

type AppStorageFooterContextValue = {
  config: AppStorageFooterConfig | null;
  setConfig: Dispatch<SetStateAction<AppStorageFooterConfig | null>>;
};

const AppStorageFooterContext =
  createContext<AppStorageFooterContextValue | null>(null);

export function AppStorageFooterProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppStorageFooterConfig | null>(null);
  const value = useMemo(
    () => ({ config, setConfig }),
    [config],
  );
  return (
    <AppStorageFooterContext.Provider value={value}>
      {children}
    </AppStorageFooterContext.Provider>
  );
}

export function useAppStorageFooterConfig(): AppStorageFooterConfig | null {
  return useContext(AppStorageFooterContext)?.config ?? null;
}

/** Registers (or clears) the active local-storage footer for the current route tree. */
export function useRegisterAppStorageFooter(
  config: AppStorageFooterConfig | null,
): void {
  const ctx = useContext(AppStorageFooterContext);
  const setConfig = ctx?.setConfig;
  useEffect(() => {
    if (!setConfig) {
      return;
    }
    setConfig(config);
    return () => setConfig(null);
  }, [config, setConfig]);
}
