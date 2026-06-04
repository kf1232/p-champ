import { normalizeGeocodeQuery } from "@/lib/burke/geo/geocodeCache";
import { sanitizeGeocodeResponse } from "@/lib/burke/geo/sanitizeGeocodeResponse";
import type { GeocodeResponse } from "@/lib/burke/geo/types";

import { LOCATION_FINDER_GEOCODE_RESPONSES_KEY } from "./locationFinderCacheKeys";
import type { LocationFinderStoredData } from "./types";

function isGeocodeResponse(value: unknown): value is GeocodeResponse {
  if (!value || typeof value !== "object") {
    return false;
  }
  const o = value as GeocodeResponse;
  return (
    typeof o.query === "string" &&
    (o.status === "found" ||
      o.status === "ambiguous" ||
      o.status === "not_found") &&
    Array.isArray(o.suggestions)
  );
}

export function readGeocodeResponseMap(
  data: LocationFinderStoredData,
): Record<string, GeocodeResponse> {
  const raw = data[LOCATION_FINDER_GEOCODE_RESPONSES_KEY];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }
  const out: Record<string, GeocodeResponse> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (isGeocodeResponse(value)) {
      out[key] = sanitizeGeocodeResponse(value);
    }
  }
  return out;
}

export function findStoredGeocodeResponse(
  data: LocationFinderStoredData,
  query: string,
): GeocodeResponse | null {
  const map = readGeocodeResponseMap(data);
  const hit = map[normalizeGeocodeQuery(query)] ?? null;
  if (!hit) {
    return null;
  }
  return sanitizeGeocodeResponse({ ...hit, query: query.trim() });
}

export function mergeGeocodeResponseIntoLocationFinderData(
  prev: LocationFinderStoredData,
  query: string,
  response: GeocodeResponse,
): LocationFinderStoredData {
  const key = normalizeGeocodeQuery(query);
  const map = readGeocodeResponseMap(prev);
  map[key] = response;
  return {
    ...prev,
    [LOCATION_FINDER_GEOCODE_RESPONSES_KEY]: map,
  };
}
