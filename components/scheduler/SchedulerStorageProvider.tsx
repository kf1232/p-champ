"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  clearSchedulerStoredData,
  getSchedulerStorageServerSnapshot,
  getSchedulerStorageSnapshot,
  parseSchedulerStorageRaw,
  subscribeSchedulerStorage,
  writeSchedulerStoredData,
  type SchedulerStoredData,
} from "@/lib/scheduler";

type SchedulerStorageContextValue = {
  data: SchedulerStoredData;
  storedAt: number | null;
  cacheByteSize: number;
  setData: (
    next:
      | SchedulerStoredData
      | ((prev: SchedulerStoredData) => SchedulerStoredData),
  ) => void;
  clear: () => void;
};

const SchedulerStorageContext =
  createContext<SchedulerStorageContextValue | null>(null);

export function SchedulerStorageProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(
    subscribeSchedulerStorage,
    getSchedulerStorageSnapshot,
    getSchedulerStorageServerSnapshot,
  );

  const { data, storedAt } = useMemo(
    () => parseSchedulerStorageRaw(raw),
    [raw],
  );

  const cacheByteSize = useMemo(
    () => (raw.length ? new TextEncoder().encode(raw).length : 0),
    [raw],
  );

  const setData = useCallback(
    (
      next:
        | SchedulerStoredData
        | ((prev: SchedulerStoredData) => SchedulerStoredData),
    ) => {
      const resolved =
        typeof next === "function"
          ? next(
              parseSchedulerStorageRaw(getSchedulerStorageSnapshot()).data,
            )
          : next;
      writeSchedulerStoredData(resolved);
    },
    [],
  );

  const clear = useCallback(() => {
    clearSchedulerStoredData();
  }, []);

  const value = useMemo(
    () => ({ data, storedAt, cacheByteSize, setData, clear }),
    [data, storedAt, cacheByteSize, setData, clear],
  );

  return (
    <SchedulerStorageContext.Provider value={value}>
      {children}
    </SchedulerStorageContext.Provider>
  );
}

export function useSchedulerStorage(): SchedulerStorageContextValue {
  const ctx = useContext(SchedulerStorageContext);
  if (!ctx) {
    throw new Error(
      "useSchedulerStorage must be used within SchedulerStorageProvider",
    );
  }
  return ctx;
}
