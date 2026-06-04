import { stripTrailingCountry } from "./geocodeCountryOnlyCorrection";
import type { GeocodeCacheEntry, GeocodeResponse } from "./types";

const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

const cache = new Map<string, GeocodeCacheEntry>();

/** Cache key: trim, collapse spaces, lowercase, drop trailing country. */
export function normalizeGeocodeQuery(query: string): string {
  const collapsed = query.trim().replace(/\s+/g, " ");
  return stripTrailingCountry(collapsed).toLowerCase();
}

export function getCachedGeocode(query: string): GeocodeResponse | null {
  const key = normalizeGeocodeQuery(query);
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }
  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }
  return entry.result;
}

export function setCachedGeocode(
  query: string,
  result: GeocodeResponse,
): void {
  const key = normalizeGeocodeQuery(query);
  cache.set(key, {
    result,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

export function clearGeocodeCache(): void {
  cache.clear();
}
