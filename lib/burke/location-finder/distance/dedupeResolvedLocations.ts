import type { ProximityMatch, ResolvedLocation } from "./types";
import {
  countRoutingFailures,
  inferLikelyRootCause,
  type ProximityRoutingDiagnostics,
} from "./routingDiagnostics";

/** ~1 m precision for treating coordinates as the same place. */
const COORD_SCALE = 1e5;

export type DedupedResolvedLocations = {
  unique: ResolvedLocation[];
  /** First occurrence id for each dedupe key. */
  canonicalIdByInputId: Map<string, string>;
  /** Input ids that shared coordinates with an earlier row. */
  duplicateInputIds: string[];
};

function locationDedupeKey(loc: ResolvedLocation): string {
  const lat = Math.round(loc.lat * COORD_SCALE);
  const lon = Math.round(loc.lon * COORD_SCALE);
  const label = loc.formatted.trim().toLowerCase();
  return `${lat}|${lon}|${label}`;
}

/** Collapse identical coordinates; keep first row as canonical per group. */
export function dedupeResolvedLocations(
  locations: ResolvedLocation[],
): DedupedResolvedLocations {
  const unique: ResolvedLocation[] = [];
  const keyToCanonicalId = new Map<string, string>();
  const canonicalIdByInputId = new Map<string, string>();
  const duplicateInputIds: string[] = [];

  for (const loc of locations) {
    const key = locationDedupeKey(loc);
    const existingCanonicalId = keyToCanonicalId.get(key);
    if (existingCanonicalId) {
      canonicalIdByInputId.set(loc.id, existingCanonicalId);
      duplicateInputIds.push(loc.id);
      continue;
    }
    keyToCanonicalId.set(key, loc.id);
    canonicalIdByInputId.set(loc.id, loc.id);
    unique.push(loc);
  }

  return {
    unique,
    canonicalIdByInputId,
    duplicateInputIds,
  };
}

export function expandProximityMatches(
  canonicalRows: ProximityMatch[],
  allLocations: ResolvedLocation[],
  canonicalIdByInputId: Map<string, string>,
): ProximityMatch[] {
  const byCanonicalId = new Map(canonicalRows.map((row) => [row.id, row]));

  return allLocations.flatMap((loc) => {
    const canonicalId = canonicalIdByInputId.get(loc.id) ?? loc.id;
    const row = byCanonicalId.get(canonicalId);
    if (!row) {
      return [];
    }
    return [
      {
        ...row,
        id: loc.id,
        formatted: loc.formatted,
      },
    ];
  });
}

export function expandProximityRoutingDiagnostics(
  diagnostics: ProximityRoutingDiagnostics,
  allLocations: ResolvedLocation[],
  canonicalIdByInputId: Map<string, string>,
): ProximityRoutingDiagnostics {
  const canonicalUnrouted = diagnostics.unrouted;
  const expandedUnrouted = allLocations.flatMap((loc) => {
    const canonicalId = canonicalIdByInputId.get(loc.id) ?? loc.id;
    const row = canonicalUnrouted.find((u) => u.id === canonicalId);
    if (!row) {
      return [];
    }
    return [
      {
        ...row,
        id: loc.id,
        formatted: loc.formatted,
        lat: loc.lat,
        lon: loc.lon,
      },
    ];
  });

  const submittedDestinationCount = allLocations.length;
  const unroutedCount = expandedUnrouted.length;
  const routedCount = submittedDestinationCount - unroutedCount;
  const failureCounts = countRoutingFailures(expandedUnrouted);
  const summary = {
    submittedDestinationCount,
    routedCount,
    unroutedCount,
    unrouted: expandedUnrouted,
    failureCounts,
    targetSnapDistanceMeters: diagnostics.targetSnapDistanceMeters,
  };

  return {
    ...diagnostics,
    submittedDestinationCount,
    routedCount,
    unroutedCount,
    failureCounts,
    unrouted: expandedUnrouted,
    likelyRootCause: inferLikelyRootCause(summary),
  };
}
