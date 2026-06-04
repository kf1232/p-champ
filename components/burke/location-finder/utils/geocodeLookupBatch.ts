import {
  BURKE_GEOCODE_BATCH_API_PATH,
  BURKE_GEOCODE_BATCH_RETRY_MS,
  BURKE_GEOCODE_CLIENT_BATCH_SIZE,
} from "@/lib/burke";
import { normalizeGeocodeQuery } from "@/lib/burke";
import { sanitizeGeocodeResponse } from "@/lib/burke";
import type { GeocodeResponse } from "@/lib/burke";

export type GeocodeCacheBundle = {
  cache: Map<string, GeocodeResponse>;
  inflight: Map<string, Promise<GeocodeResponse>>;
};

export type GeocodeApiHandlers = {
  onUnauthorized?: () => void;
};

export type GeocodeBatchFetchOptions = {
  skipFallbacks?: boolean;
};

const BATCH_RETRY_DELAY_MS = BURKE_GEOCODE_BATCH_RETRY_MS;
const BATCH_MAX_ATTEMPTS = 3;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

export function emptyGeocodeResponse(query: string): GeocodeResponse {
  return {
    query,
    status: "not_found",
    match: null,
    suggestions: [],
  };
}

function applyResultsToCache(
  { cache, inflight }: GeocodeCacheBundle,
  results: Record<string, GeocodeResponse>,
  persist?: (results: Record<string, GeocodeResponse>) => void,
): void {
  for (const [address, result] of Object.entries(results)) {
    const key = normalizeGeocodeQuery(address);
    cache.set(key, result);
    inflight.delete(key);
  }
  persist?.(results);
}

export function markBatchMissesAsEmpty(
  { cache, inflight }: GeocodeCacheBundle,
  addresses: string[],
  persist?: (query: string, response: GeocodeResponse) => void,
): void {
  for (const address of addresses) {
    const key = normalizeGeocodeQuery(address);
    if (cache.has(key)) {
      continue;
    }
    const fallback = emptyGeocodeResponse(address);
    cache.set(key, fallback);
    inflight.delete(key);
    persist?.(address, fallback);
  }
}

function handleBlockedApiResponse(
  res: Response,
  handlers: GeocodeApiHandlers,
): void {
  if (res.status === 401) {
    handlers.onUnauthorized?.();
  }
}

async function fetchGeocodeBatch(
  addresses: string[],
  handlers: GeocodeApiHandlers,
  options: GeocodeBatchFetchOptions = {},
): Promise<Record<string, GeocodeResponse>> {
  const res = await fetch(BURKE_GEOCODE_BATCH_API_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      addresses,
      skipFallbacks: options.skipFallbacks === true,
    }),
    credentials: "same-origin",
  });
  const body: unknown = await res.json().catch(() => null);
  handleBlockedApiResponse(res, handlers);
  if (
    res.ok &&
    body &&
    typeof body === "object" &&
    "results" in body &&
    typeof (body as { results: unknown }).results === "object" &&
    (body as { results: unknown }).results !== null
  ) {
    const raw = (body as { results: Record<string, GeocodeResponse> }).results;
    const sanitized: Record<string, GeocodeResponse> = {};
    for (const [address, result] of Object.entries(raw)) {
      sanitized[address] = sanitizeGeocodeResponse(result);
    }
    return sanitized;
  }
  return {};
}

/** Resolve uncached addresses via the Burke geocode batch API (with retries). */
export async function resolveAddressesViaBatch(
  addresses: string[],
  bundle: GeocodeCacheBundle,
  handlers: GeocodeApiHandlers,
  options: GeocodeBatchFetchOptions,
  persistBatch?: (results: Record<string, GeocodeResponse>) => void,
  persistOne?: (query: string, response: GeocodeResponse) => void,
): Promise<void> {
  const unique = [
    ...new Set(
      addresses.map((a) => a.trim()).filter((a) => a.length >= 3),
    ),
  ];
  if (unique.length === 0) {
    return;
  }

  const needed = unique.filter((address) => {
    const key = normalizeGeocodeQuery(address);
    return !bundle.cache.has(key);
  });
  if (needed.length === 0) {
    return;
  }

  const batches = chunk(needed, BURKE_GEOCODE_CLIENT_BATCH_SIZE);
  for (const batch of batches) {
    let resolved = false;
    for (let attempt = 0; attempt < BATCH_MAX_ATTEMPTS; attempt += 1) {
      const results = await fetchGeocodeBatch(batch, handlers, options);
      if (Object.keys(results).length > 0) {
        applyResultsToCache(bundle, results, persistBatch);
        resolved = true;
        break;
      }
      if (attempt < BATCH_MAX_ATTEMPTS - 1) {
        await sleep(BATCH_RETRY_DELAY_MS * (attempt + 1));
      }
    }
    if (!resolved) {
      markBatchMissesAsEmpty(bundle, batch, persistOne);
    }
  }
}
