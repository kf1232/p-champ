"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import {
  clearWowServiceStoredData,
  getWowServiceStorageServerSnapshot,
  getWowServiceStorageSnapshot,
  parseWowServiceStorageRaw,
  subscribeWowServiceStorage,
  writeWowServiceStoredData,
  type WowServiceStoredData,
} from "@/lib/wow";

type WowServiceStorageContextValue = {
  data: WowServiceStoredData;
  storedAt: number | null;
  /** UTF-8 byte length of the persisted JSON string (0 when empty). */
  cacheByteSize: number;
  setData: (
    next:
      | WowServiceStoredData
      | ((prev: WowServiceStoredData) => WowServiceStoredData)
  ) => void;
  clear: () => void;
};

const WowServiceStorageContext =
  createContext<WowServiceStorageContextValue | null>(null);

export function WowServiceStorageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const raw = useSyncExternalStore(
    subscribeWowServiceStorage,
    getWowServiceStorageSnapshot,
    getWowServiceStorageServerSnapshot
  );

  const { data, storedAt } = useMemo(
    () => parseWowServiceStorageRaw(raw),
    [raw]
  );

  const cacheByteSize = useMemo(
    () => (raw.length ? new TextEncoder().encode(raw).length : 0),
    [raw]
  );

  const setData = useCallback(
    (
      next:
        | WowServiceStoredData
        | ((prev: WowServiceStoredData) => WowServiceStoredData)
    ) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: WowServiceStoredData) => WowServiceStoredData)(
              parseWowServiceStorageRaw(getWowServiceStorageSnapshot()).data
            )
          : next;
      writeWowServiceStoredData(resolved);
    },
    []
  );

  const clear = useCallback(() => {
    clearWowServiceStoredData();
  }, []);

  const value = useMemo(
    () => ({ data, storedAt, cacheByteSize, setData, clear }),
    [data, storedAt, cacheByteSize, setData, clear]
  );

  return (
    <WowServiceStorageContext.Provider value={value}>
      {children}
    </WowServiceStorageContext.Provider>
  );
}

export function useWowServiceStorage(): WowServiceStorageContextValue {
  const ctx = useContext(WowServiceStorageContext);
  if (!ctx) {
    throw new Error(
      "useWowServiceStorage must be used within WowServiceStorageProvider"
    );
  }
  return ctx;
}
