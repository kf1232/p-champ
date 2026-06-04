import type {
  DistanceThreshold,
  ProximityMatch,
  ResolvedLocation,
} from "@/lib/burke/location-finder/distance/types";

import { LOCATION_FINDER_PROXIMITY_RESULTS_KEY } from "./locationFinderCacheKeys";
import type { LocationFinderStoredData } from "./types";

function isProximityMatch(value: unknown): value is ProximityMatch {
  if (!value || typeof value !== "object") {
    return false;
  }
  const o = value as ProximityMatch;
  return (
    typeof o.id === "string" &&
    typeof o.formatted === "string" &&
    typeof o.miles === "number" &&
    typeof o.minutes === "number"
  );
}

export function makeProximityCacheKey(
  target: ResolvedLocation,
  destinations: ResolvedLocation[],
  threshold: DistanceThreshold,
): string {
  const destPart = [...destinations]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((d) => `${d.id}|${d.lat}|${d.lon}|${d.formatted}`)
    .join(";");
  return [
    `t:${target.lat},${target.lon},${target.formatted}`,
    `d:${destPart}`,
    `th:${threshold.value},${threshold.unit}`,
  ].join("|");
}

function readProximityMap(
  data: LocationFinderStoredData,
): Record<string, ProximityMatch[]> {
  const raw = data[LOCATION_FINDER_PROXIMITY_RESULTS_KEY];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }
  const out: Record<string, ProximityMatch[]> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (Array.isArray(value) && value.every(isProximityMatch)) {
      out[key] = value;
    }
  }
  return out;
}

export function findStoredProximityMatches(
  data: LocationFinderStoredData,
  target: ResolvedLocation,
  destinations: ResolvedLocation[],
  threshold: DistanceThreshold,
): ProximityMatch[] | null {
  const key = makeProximityCacheKey(target, destinations, threshold);
  const map = readProximityMap(data);
  const hit = map[key];
  return hit ? [...hit] : null;
}

export function mergeProximityMatchesIntoLocationFinderData(
  prev: LocationFinderStoredData,
  target: ResolvedLocation,
  destinations: ResolvedLocation[],
  threshold: DistanceThreshold,
  matches: ProximityMatch[],
): LocationFinderStoredData {
  const key = makeProximityCacheKey(target, destinations, threshold);
  const map = readProximityMap(prev);
  map[key] = matches;
  return {
    ...prev,
    [LOCATION_FINDER_PROXIMITY_RESULTS_KEY]: map,
  };
}
