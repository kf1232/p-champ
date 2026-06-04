"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  clearLocationFinderStoredData,
  getLocationFinderStorageServerSnapshot,
  getLocationFinderStorageSnapshot,
  parseLocationFinderStorageRaw,
  subscribeLocationFinderStorage,
  writeLocationFinderStoredData,
  type LocationFinderStoredData,
} from "@/lib/burke/location-finder/store";

type LocationFinderStorageContextValue = {
  data: LocationFinderStoredData;
  storedAt: number | null;
  cacheByteSize: number;
  setData: (
    next:
      | LocationFinderStoredData
      | ((
          prev: LocationFinderStoredData,
        ) => LocationFinderStoredData),
  ) => void;
  clear: () => void;
  /** Bumps when {@link clear} runs so forms can remount from empty state. */
  resetNonce: number;
};


const LocationFinderStorageContext =
  createContext<LocationFinderStorageContextValue | null>(null);

export function LocationFinderStorageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const raw = useSyncExternalStore(
    subscribeLocationFinderStorage,
    getLocationFinderStorageSnapshot,
    getLocationFinderStorageServerSnapshot,
  );

  const { data, storedAt } = useMemo(
    () => parseLocationFinderStorageRaw(raw),
    [raw],
  );

  const cacheByteSize = useMemo(
    () => (raw.length ? new TextEncoder().encode(raw).length : 0),
    [raw],
  );

  const [resetNonce, setResetNonce] = useState(0);

  const setData = useCallback(
    (
      next:
        | LocationFinderStoredData
        | ((
            prev: LocationFinderStoredData,
          ) => LocationFinderStoredData),
    ) => {
      const resolved =
        typeof next === "function"
          ? next(
              parseLocationFinderStorageRaw(
                getLocationFinderStorageSnapshot(),
              ).data,
            )
          : next;
      writeLocationFinderStoredData(resolved);
    },
    [],
  );

  const clear = useCallback(() => {
    clearLocationFinderStoredData();
    setResetNonce((n) => n + 1);
  }, []);

  const value = useMemo(
    () => ({ data, storedAt, cacheByteSize, setData, clear, resetNonce }),
    [data, storedAt, cacheByteSize, setData, clear, resetNonce],
  );

  return (
    <LocationFinderStorageContext.Provider value={value}>
      {children}
    </LocationFinderStorageContext.Provider>
  );
}

export function useLocationFinderStorage(): LocationFinderStorageContextValue {
  const ctx = useContext(LocationFinderStorageContext);
  if (!ctx) {
    throw new Error(
      "useLocationFinderStorage must be used within LocationFinderStorageProvider",
    );
  }
  return ctx;
}
