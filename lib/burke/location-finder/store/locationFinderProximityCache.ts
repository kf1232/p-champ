import type { ProximityRoutingDiagnostics } from "../distance/routingDiagnostics";
import type {
  DistanceThreshold,
  ProximityMatch,
  ResolvedLocation,
} from "../distance/types";

import {
  LOCATION_FINDER_PROXIMITY_DIAGNOSTICS_KEY,
  LOCATION_FINDER_PROXIMITY_RESULTS_KEY,
} from "./locationFinderCacheKeys";
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

function isProximityRoutingDiagnostics(
  value: unknown,
): value is ProximityRoutingDiagnostics {
  if (!value || typeof value !== "object") {
    return false;
  }
  const o = value as ProximityRoutingDiagnostics;
  return (
    o.mode === "drivingMiles" &&
    typeof o.submittedDestinationCount === "number" &&
    typeof o.routedCount === "number" &&
    typeof o.unroutedCount === "number" &&
    Array.isArray(o.unrouted) &&
    o.target !== null &&
    typeof o.target === "object" &&
    typeof o.target.formatted === "string"
  );
}

function destinationFingerprint(destinations: ResolvedLocation[]): string {
  return [...destinations]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((d) => `${d.id}|${d.lat}|${d.lon}|${d.formatted}`)
    .join(";");
}

export function makeProximityMetricsCacheKey(
  target: ResolvedLocation,
  destinations: ResolvedLocation[],
  threshold: DistanceThreshold,
): string {
  return [
    `t:${target.lat},${target.lon},${target.formatted}`,
    `d:${destinationFingerprint(destinations)}`,
    `metrics:${threshold.unit}`,
  ].join("|");
}

export function makeProximityCacheKey(
  target: ResolvedLocation,
  destinations: ResolvedLocation[],
  threshold: DistanceThreshold,
): string {
  return [
    `t:${target.lat},${target.lon},${target.formatted}`,
    `d:${destinationFingerprint(destinations)}`,
    `th:${threshold.value},${threshold.unit}`,
  ].join("|");
}

/** Same fingerprint as metrics; diagnostics are independent of threshold miles. */
export function makeProximityDrivingDiagnosticsCacheKey(
  target: ResolvedLocation,
  destinations: ResolvedLocation[],
  threshold: DistanceThreshold,
): string {
  return makeProximityMetricsCacheKey(target, destinations, threshold);
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

function readProximityDiagnosticsMap(
  data: LocationFinderStoredData,
): Record<string, ProximityRoutingDiagnostics> {
  const raw = data[LOCATION_FINDER_PROXIMITY_DIAGNOSTICS_KEY];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }
  const out: Record<string, ProximityRoutingDiagnostics> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (isProximityRoutingDiagnostics(value)) {
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

export function findStoredProximityMetrics(
  data: LocationFinderStoredData,
  target: ResolvedLocation,
  destinations: ResolvedLocation[],
  threshold: DistanceThreshold,
): ProximityMatch[] | null {
  const key = makeProximityMetricsCacheKey(target, destinations, threshold);
  const map = readProximityMap(data);
  const hit = map[key];
  return hit ? [...hit] : null;
}

/**
 * Driving diagnostics for a cached metrics key.
 * `undefined` = no entry (legacy cache before diagnostics were stored).
 */
export function findStoredProximityDrivingDiagnostics(
  data: LocationFinderStoredData,
  target: ResolvedLocation,
  destinations: ResolvedLocation[],
  threshold: DistanceThreshold,
): ProximityRoutingDiagnostics | undefined {
  const key = makeProximityDrivingDiagnosticsCacheKey(
    target,
    destinations,
    threshold,
  );
  const map = readProximityDiagnosticsMap(data);
  if (!Object.prototype.hasOwnProperty.call(map, key)) {
    return undefined;
  }
  return map[key];
}

export function mergeProximityMatchesIntoLocationFinderData(
  prev: LocationFinderStoredData,
  target: ResolvedLocation,
  destinations: ResolvedLocation[],
  threshold: DistanceThreshold,
  matches: ProximityMatch[],
  metrics?: ProximityMatch[],
  drivingDiagnostics?: ProximityRoutingDiagnostics | null,
): LocationFinderStoredData {
  const map = readProximityMap(prev);
  map[makeProximityCacheKey(target, destinations, threshold)] = matches;
  if (metrics) {
    map[makeProximityMetricsCacheKey(target, destinations, threshold)] = metrics;
  }

  let next: LocationFinderStoredData = {
    ...prev,
    [LOCATION_FINDER_PROXIMITY_RESULTS_KEY]: map,
  };

  if (drivingDiagnostics) {
    const diagnosticsMap = readProximityDiagnosticsMap(prev);
    diagnosticsMap[
      makeProximityDrivingDiagnosticsCacheKey(target, destinations, threshold)
    ] = drivingDiagnostics;
    next = {
      ...next,
      [LOCATION_FINDER_PROXIMITY_DIAGNOSTICS_KEY]: diagnosticsMap,
    };
  }

  return next;
}
