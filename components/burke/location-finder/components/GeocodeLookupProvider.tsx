"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  BURKE_GEOCODE_CLIENT_BATCH_SIZE,
  BURKE_GEOCODE_LOOKUP_COALESCE_MS,
} from "@/lib/burke";
import { clearGeocodeCache, normalizeGeocodeQuery } from "@/lib/burke";
import { sanitizeGeocodeResponse } from "@/lib/burke";
import type { GeocodeResponse } from "@/lib/burke";

function fingerprintGeocodeResponseMap(
  map: Record<string, GeocodeResponse>,
): string {
  const keys = Object.keys(map).sort();
  const parts: string[] = [];
  for (const key of keys) {
    const row = map[key]!;
    parts.push(
      `${key}:${row.status}:${row.suggestions.length}:${row.match?.placeId ?? ""}`,
    );
  }
  return parts.join("|");
}
import {
  findStoredGeocodeResponse,
  mergeGeocodeResponseIntoLocationFinderData,
  readGeocodeResponseMap,
} from "@/lib/burke";

import {
  chunk,
  emptyGeocodeResponse,
  markBatchMissesAsEmpty,
  resolveAddressesViaBatch,
  type GeocodeCacheBundle,
} from "../utils/geocodeLookupBatch";
import { useLocationFinderStorage } from "./providers/LocationFinderStorageProvider";

type GeocodeLookupContextValue = {
  lookup: (query: string) => Promise<GeocodeResponse>;
  prefetch: (queries: string[]) => Promise<void>;
  peekLookup: (query: string) => GeocodeResponse | null;
  lookupGeneration: string;
};

const GeocodeLookupContext = createContext<GeocodeLookupContextValue | null>(
  null,
);

type GeocodeLookupProviderProps = {
  children: ReactNode;
  onUnauthorized?: () => void;
};

export function GeocodeLookupProvider({
  children,
  onUnauthorized,
}: GeocodeLookupProviderProps) {
  const apiHandlers = useMemo(
    () => ({ onUnauthorized }),
    [onUnauthorized],
  );
  const { data, setData } = useLocationFinderStorage();
  const cacheRef = useRef(new Map<string, GeocodeResponse>());
  const inflightRef = useRef(new Map<string, Promise<GeocodeResponse>>());
  const coalesceQueueRef = useRef(new Set<string>());
  const coalesceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const coalesceResolversRef = useRef(
    new Map<string, (result: GeocodeResponse) => void>(),
  );
  const geocodeFingerprintRef = useRef("");
  const [cacheRevision, setCacheRevision] = useState(0);

  const dataFingerprint = useMemo(() => {
    const map = readGeocodeResponseMap(data);
    return fingerprintGeocodeResponseMap(map);
  }, [data]);

  const lookupGeneration = `${dataFingerprint}:${cacheRevision}`;

  const bundle = useCallback(
    (): GeocodeCacheBundle => ({
      cache: cacheRef.current,
      inflight: inflightRef.current,
    }),
    [],
  );

  useEffect(() => {
    const map = readGeocodeResponseMap(data);
    const keys = Object.keys(map);
    if (keys.length === 0) {
      cacheRef.current.clear();
      inflightRef.current.clear();
      clearGeocodeCache();
      geocodeFingerprintRef.current = "";
      return;
    }
    const nextCache = new Map<string, GeocodeResponse>();
    for (const key of keys) {
      nextCache.set(key, map[key]!);
    }
    cacheRef.current = nextCache;
    geocodeFingerprintRef.current = fingerprintGeocodeResponseMap(map);
  }, [data]);

  const persistGeocode = useCallback(
    (query: string, response: GeocodeResponse) => {
      setData((prev) =>
        mergeGeocodeResponseIntoLocationFinderData(prev, query, response),
      );
    },
    [setData],
  );

  const persistGeocodeBatch = useCallback(
    (results: Record<string, GeocodeResponse>) => {
      setData((prev) => {
        let next = prev;
        for (const [address, result] of Object.entries(results)) {
          next = mergeGeocodeResponseIntoLocationFinderData(
            next,
            address,
            result,
          );
        }
        return next;
      });
    },
    [setData],
  );

  const readPersisted = useCallback(
    (trimmed: string): GeocodeResponse | null => {
      const stored = findStoredGeocodeResponse(data, trimmed);
      if (!stored) {
        return null;
      }
      const key = normalizeGeocodeQuery(trimmed);
      cacheRef.current.set(key, stored);
      return stored;
    },
    [data],
  );

  const resolveCoalescedLookups = useCallback((addresses: string[]) => {
    for (const trimmed of addresses) {
      const key = normalizeGeocodeQuery(trimmed);
      const resolve = coalesceResolversRef.current.get(key);
      if (!resolve) {
        continue;
      }
      coalesceResolversRef.current.delete(key);
      inflightRef.current.delete(key);
      const hit =
        cacheRef.current.get(key) ?? emptyGeocodeResponse(trimmed);
      resolve(sanitizeGeocodeResponse({ ...hit, query: trimmed }));
    }
  }, []);

  const flushCoalescedLookups = useCallback(async () => {
    coalesceTimerRef.current = null;
    const addresses = [...coalesceQueueRef.current];
    coalesceQueueRef.current.clear();
    if (addresses.length === 0) {
      return;
    }

    const needed = addresses.filter((trimmed) => {
      const key = normalizeGeocodeQuery(trimmed);
      return !cacheRef.current.has(key);
    });

    if (needed.length > 0) {
      try {
        await resolveAddressesViaBatch(
          needed,
          bundle(),
          apiHandlers,
          { skipFallbacks: false },
          persistGeocodeBatch,
          persistGeocode,
        );
        setCacheRevision((g) => g + 1);
      } catch {
        markBatchMissesAsEmpty(bundle(), needed, persistGeocode);
      }
    }

    resolveCoalescedLookups(addresses);
  }, [
    apiHandlers,
    bundle,
    persistGeocode,
    persistGeocodeBatch,
    resolveCoalescedLookups,
  ]);

  useEffect(() => {
    return () => {
      if (coalesceTimerRef.current) {
        clearTimeout(coalesceTimerRef.current);
        coalesceTimerRef.current = null;
      }
    };
  }, []);

  const scheduleCoalescedLookup = useCallback(
    (trimmed: string): Promise<GeocodeResponse> => {
      const key = normalizeGeocodeQuery(trimmed);
      const inflight = inflightRef.current.get(key);
      if (inflight) {
        return inflight.then((result) =>
          sanitizeGeocodeResponse({ ...result, query: trimmed }),
        );
      }

      const promise = new Promise<GeocodeResponse>((resolve) => {
        coalesceResolversRef.current.set(key, resolve);
      });
      inflightRef.current.set(key, promise);
      coalesceQueueRef.current.add(trimmed);

      if (!coalesceTimerRef.current) {
        coalesceTimerRef.current = setTimeout(() => {
          void flushCoalescedLookups();
        }, BURKE_GEOCODE_LOOKUP_COALESCE_MS);
      }

      return promise;
    },
    [flushCoalescedLookups],
  );

  const lookup = useCallback(
    async (query: string): Promise<GeocodeResponse> => {
      const trimmed = query.trim();
      if (trimmed.length < 3) {
        return emptyGeocodeResponse(trimmed);
      }

      const key = normalizeGeocodeQuery(trimmed);
      const cached = cacheRef.current.get(key);
      if (cached) {
        return sanitizeGeocodeResponse({ ...cached, query: trimmed });
      }

      const persisted = readPersisted(trimmed);
      if (persisted) {
        return sanitizeGeocodeResponse(persisted);
      }

      return scheduleCoalescedLookup(trimmed);
    },
    [readPersisted, scheduleCoalescedLookup],
  );

  const peekLookup = useCallback(
    (query: string): GeocodeResponse | null => {
      const trimmed = query.trim();
      if (trimmed.length < 3) {
        return null;
      }
      const key = normalizeGeocodeQuery(trimmed);
      const cached = cacheRef.current.get(key);
      if (cached) {
        return sanitizeGeocodeResponse({ ...cached, query: trimmed });
      }
      const persisted = readPersisted(trimmed);
      return persisted ? sanitizeGeocodeResponse(persisted) : null;
    },
    [readPersisted],
  );

  const prefetch = useCallback(
    async (queries: string[]) => {
      const unique = [
        ...new Set(
          queries.map((q) => q.trim()).filter((q) => q.length >= 3),
        ),
      ];

      const needed = unique.filter((q) => {
        const key = normalizeGeocodeQuery(q);
        if (cacheRef.current.has(key) || inflightRef.current.has(key)) {
          return false;
        }
        const stored = findStoredGeocodeResponse(data, q);
        if (stored) {
          cacheRef.current.set(key, stored);
          return false;
        }
        return true;
      });

      if (needed.length === 0) {
        return;
      }

      const batches = chunk(needed, BURKE_GEOCODE_CLIENT_BATCH_SIZE);
      for (const batch of batches) {
        const batchKeys = batch.map((address) => normalizeGeocodeQuery(address));
        const batchPromise = resolveAddressesViaBatch(
          batch,
          bundle(),
          apiHandlers,
          { skipFallbacks: true },
          persistGeocodeBatch,
          persistGeocode,
        ).then(() => {
          setCacheRevision((g) => g + 1);
        });

        for (let i = 0; i < batch.length; i++) {
          const address = batch[i]!;
          const key = batchKeys[i]!;
          if (!cacheRef.current.has(key) && !inflightRef.current.has(key)) {
            inflightRef.current.set(
              key,
              batchPromise.then(
                () =>
                  cacheRef.current.get(key) ??
                  emptyGeocodeResponse(address),
              ),
            );
          }
        }

        await batchPromise;
      }
    },
    [apiHandlers, bundle, data, persistGeocode, persistGeocodeBatch],
  );

  const value = useMemo(
    () => ({ lookup, prefetch, peekLookup, lookupGeneration }),
    [lookup, prefetch, peekLookup, lookupGeneration],
  );

  return (
    <GeocodeLookupContext.Provider value={value}>
      {children}
    </GeocodeLookupContext.Provider>
  );
}

export function useGeocodeLookup(): GeocodeLookupContextValue {
  const ctx = useContext(GeocodeLookupContext);
  if (!ctx) {
    throw new Error("useGeocodeLookup requires GeocodeLookupProvider");
  }
  return ctx;
}
