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

/** Feature override for the app header inner slot (see `useRegisterAppHeader`). */
export type AppHeaderSlotConfig = {
  /** Replaces route-default inner nav content. */
  content: ReactNode;
  /** Matches `app-chrome__header-inner--wide` when true. */
  wide?: boolean;
  /** Overrides route-default `aria-label` on `.app-chrome__header`. */
  ariaLabel?: string;
};

type AppHeaderContextValue = {
  config: AppHeaderSlotConfig | null;
  setConfig: Dispatch<SetStateAction<AppHeaderSlotConfig | null>>;
};

const AppHeaderContext = createContext<AppHeaderContextValue | null>(null);

export function AppHeaderProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppHeaderSlotConfig | null>(null);
  const value = useMemo(() => ({ config, setConfig }), [config]);
  return (
    <AppHeaderContext.Provider value={value}>{children}</AppHeaderContext.Provider>
  );
}

export function useAppHeaderSlotConfig(): AppHeaderSlotConfig | null {
  return useContext(AppHeaderContext)?.config ?? null;
}

/** Registers (or clears) the active header inner content for the current route tree. */
export function useRegisterAppHeader(config: AppHeaderSlotConfig | null): void {
  const ctx = useContext(AppHeaderContext);
  const setConfig = ctx?.setConfig;
  useEffect(() => {
    if (!setConfig) {
      return;
    }
    setConfig(config);
    return () => setConfig(null);
  }, [config, setConfig]);
}
