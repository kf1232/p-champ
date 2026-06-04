import { haversineMiles } from "./haversineMiles";
import type { OsrmLegResult } from "./osrmTable";
import type { ResolvedLocation } from "./types";

/** Meters OSRM snapped a coordinate off the input; above this suggests weak geocoding. */
export const OFF_ROAD_SNAP_METERS = 300;

/** Why a single leg could not produce driving distance/time. */
export type RoutingLegFailureCode =
  | "no_road_route"
  | "null_duration"
  | "null_distance"
  | "invalid_duration"
  | "invalid_distance";

export type RoutingLegFailure = {
  code: RoutingLegFailureCode;
  /** Developer-oriented detail (matrix values, snap distance, etc.). */
  detail?: string;
  /** Meters OSRM moved the destination pin to the road network (if known). */
  snapDistanceMeters?: number;
};

/** Request-level routing failure (OSRM down, timeout, bad response). */
export type RoutingRequestFailureCode =
  | "routing_http_error"
  | "routing_service_error"
  | "routing_timeout"
  | "routing_invalid_response"
  | "routing_empty_matrix";

export type RoutingRequestFailure = {
  code: RoutingRequestFailureCode;
  message: string;
  detail?: string;
};

export type RoutedLegSummary = {
  id: string;
  formatted: string;
  lat: number;
  lon: number;
  miles: number;
  minutes: number;
  /** Meters OSRM snapped the input coordinate to the road network (if known). */
  snapDistanceMeters?: number;
};

export type UnroutedLegSummary = {
  id: string;
  formatted: string;
  lat: number;
  lon: number;
  /** Crow-flies miles from target (helps spot “close on map, no road” cases). */
  straightLineMiles: number;
  failure: RoutingLegFailure;
};

export type RoutingRootCauseCode =
  | "geographic_disconnect"
  | "destination_geocode_off_road"
  | "target_geocode_off_road"
  | "routing_service_anomaly"
  | "unknown";

export type RoutingRootCauseReport = {
  code: RoutingRootCauseCode;
  title: string;
  explanation: string;
  suggestions: string[];
};

export type ProximityRoutingDiagnostics = {
  mode: "drivingMiles";
  target: Pick<ResolvedLocation, "formatted" | "lat" | "lon">;
  submittedDestinationCount: number;
  routedCount: number;
  unroutedCount: number;
  /** Count of unrouted legs grouped by failure code. */
  failureCounts: Partial<Record<RoutingLegFailureCode, number>>;
  unrouted: UnroutedLegSummary[];
  /** Largest snap distance among routed legs (helps spot weak geocodes). */
  maxRoutedSnapMeters?: number;
  /** How far OSRM moved the target coordinate to reach the road network. */
  targetSnapDistanceMeters?: number;
  likelyRootCause: RoutingRootCauseReport;
};

const LEG_FAILURE_MESSAGES: Record<RoutingLegFailureCode, string> = {
  no_road_route:
    "No driving route between target and this point (common across water or areas without roads).",
  null_duration: "Routing returned no drive time for this coordinate pair.",
  null_distance: "Routing returned no road distance for this coordinate pair.",
  invalid_duration: "Routing returned a non-numeric drive time.",
  invalid_distance: "Routing returned a non-numeric road distance.",
};

const LEG_FAILURE_HINTS: Record<RoutingLegFailureCode, string> = {
  no_road_route:
    "Compare straight-line miles: if close by air but unrouted here, the road network may not connect (lake, ferry-only, etc.).",
  null_duration:
    "Retry the search; if it persists, the public routing service may be rate-limiting or the coordinate may be off-network.",
  null_distance:
    "Same as null drive time — check coordinates and retry.",
  invalid_duration: "Treat as a routing service anomaly; retry or check server logs.",
  invalid_distance: "Treat as a routing service anomaly; retry or check server logs.",
};

const ROOT_CAUSE_COPY: Record<
  RoutingRootCauseCode,
  Omit<RoutingRootCauseReport, "code">
> = {
  geographic_disconnect: {
    title: "Mostly geographic disconnect (not bad geocodes)",
    explanation:
      "OSRM could snap coordinates to roads, but there is no drivable path from your target to most destinations. This is expected when straight-line distance crosses water, private land, or regions the public road graph does not connect.",
    suggestions: [
      "Switch Within to straight-line miles to compare crow-flies distance.",
      "On the map, check whether failed pins sit across a bay, lake, or inlet from the target.",
      "Expect only destinations on the same drivable landmass to receive road miles.",
    ],
  },
  destination_geocode_off_road: {
    title: "Many destinations are far from the road network",
    explanation:
      "OSRM had to move destination coordinates a long distance (>300 m) to reach a road. Bulk geocoding may have picked rooftops, centroids, or the wrong place.",
    suggestions: [
      "Open warning rows in Secondary locations and pick a street-level suggestion.",
      "Re-import with full street addresses (city, state, ZIP).",
      "Compare map pins to Google Maps before searching again.",
    ],
  },
  target_geocode_off_road: {
    title: "Target location is far from the road network",
    explanation:
      "OSRM could not place your target on a nearby road. Every driving leg is measured from that snapped point, so a bad target breaks most or all routes.",
    suggestions: [
      "Re-select the target from autocomplete or move the pin to the job site on a public road.",
      "Confirm the target is not a marina, dock, or rooftop far from drivable access.",
    ],
  },
  routing_service_anomaly: {
    title: "Unusual routing response mix",
    explanation:
      "Failures are mostly invalid/null matrix values rather than “no route”. That can indicate a transient OSRM issue or an unexpected API response.",
    suggestions: [
      "Retry with fewer secondaries per search.",
      "If it persists, check server logs for the proximity API.",
    ],
  },
  unknown: {
    title: "Mixed or unclear failure pattern",
    explanation:
      "Review the per-location breakdown below. Combine snap distance, straight-line miles, and failure codes to see whether geocoding or geography is the limit.",
    suggestions: [
      "Use straight-line miles to see which addresses are close in air distance.",
      "Fix any secondary rows still in warning (unresolved) before driving search.",
    ],
  },
};

/** True when at least one destination has no driving route (show routing diagnostics UI). */
export function hasDrivingRoutingIssues(
  diagnostics: ProximityRoutingDiagnostics,
): boolean {
  return diagnostics.unroutedCount > 0;
}

export function routingLegFailureMessage(code: RoutingLegFailureCode): string {
  return LEG_FAILURE_MESSAGES[code];
}

export function routingLegFailureHint(code: RoutingLegFailureCode): string {
  return LEG_FAILURE_HINTS[code];
}

export function countRoutingFailures(
  unrouted: UnroutedLegSummary[],
): Partial<Record<RoutingLegFailureCode, number>> {
  const counts: Partial<Record<RoutingLegFailureCode, number>> = {};
  for (const row of unrouted) {
    const code = row.failure.code;
    counts[code] = (counts[code] ?? 0) + 1;
  }
  return counts;
}

export function classifyLegMatrixValues(
  durationSec: number | null | undefined,
  distanceM: number | null | undefined,
  snapMeters?: number | null,
): RoutingLegFailure | null {
  if (
    (durationSec === null || durationSec === undefined) &&
    (distanceM === null || distanceM === undefined)
  ) {
    return {
      code: "no_road_route",
      snapDistanceMeters: snapMeters ?? undefined,
    };
  }
  if (durationSec === null || durationSec === undefined) {
    return {
      code: "null_duration",
      detail: `distance_m=${String(distanceM)}`,
      snapDistanceMeters: snapMeters ?? undefined,
    };
  }
  if (distanceM === null || distanceM === undefined) {
    return {
      code: "null_distance",
      detail: `duration_s=${String(durationSec)}`,
      snapDistanceMeters: snapMeters ?? undefined,
    };
  }
  if (!Number.isFinite(durationSec) || durationSec < 0) {
    return {
      code: "invalid_duration",
      detail: `duration_s=${String(durationSec)}`,
      snapDistanceMeters: snapMeters ?? undefined,
    };
  }
  if (!Number.isFinite(distanceM) || distanceM < 0) {
    return {
      code: "invalid_distance",
      detail: `distance_m=${String(distanceM)}`,
      snapDistanceMeters: snapMeters ?? undefined,
    };
  }
  return null;
}

export function inferLikelyRootCause(
  diagnostics: Pick<
    ProximityRoutingDiagnostics,
    | "submittedDestinationCount"
    | "routedCount"
    | "unrouted"
    | "failureCounts"
    | "targetSnapDistanceMeters"
  >,
): RoutingRootCauseReport {
  const total = diagnostics.submittedDestinationCount;
  const unrouted = diagnostics.unrouted.length;
  const targetSnap = diagnostics.targetSnapDistanceMeters ?? 0;

  if (targetSnap > OFF_ROAD_SNAP_METERS) {
    return { code: "target_geocode_off_road", ...ROOT_CAUSE_COPY.target_geocode_off_road };
  }

  const anomalyCount =
    (diagnostics.failureCounts.invalid_duration ?? 0) +
    (diagnostics.failureCounts.invalid_distance ?? 0) +
    (diagnostics.failureCounts.null_duration ?? 0) +
    (diagnostics.failureCounts.null_distance ?? 0);

  if (unrouted > 0 && anomalyCount > unrouted * 0.4) {
    return { code: "routing_service_anomaly", ...ROOT_CAUSE_COPY.routing_service_anomaly };
  }

  const highSnapUnrouted = diagnostics.unrouted.filter(
    (row) =>
      typeof row.failure.snapDistanceMeters === "number" &&
      row.failure.snapDistanceMeters > OFF_ROAD_SNAP_METERS,
  ).length;

  if (unrouted > 0 && highSnapUnrouted > unrouted * 0.45) {
    return {
      code: "destination_geocode_off_road",
      ...ROOT_CAUSE_COPY.destination_geocode_off_road,
    };
  }

  const noRoute = diagnostics.failureCounts.no_road_route ?? 0;
  if (
    unrouted > 0 &&
    noRoute >= unrouted * 0.6 &&
    total > 0 &&
    unrouted / total >= 0.25
  ) {
    return { code: "geographic_disconnect", ...ROOT_CAUSE_COPY.geographic_disconnect };
  }

  if (diagnostics.routedCount === 0 && unrouted > 0) {
    return { code: "geographic_disconnect", ...ROOT_CAUSE_COPY.geographic_disconnect };
  }

  return { code: "unknown", ...ROOT_CAUSE_COPY.unknown };
}

export function buildProximityRoutingDiagnostics(
  target: ResolvedLocation,
  destinations: ResolvedLocation[],
  legs: OsrmLegResult[],
  sourceSnapDistanceMeters: number | null,
): ProximityRoutingDiagnostics {
  const routed: RoutedLegSummary[] = [];
  const unrouted: UnroutedLegSummary[] = [];

  destinations.forEach((dest, i) => {
    const leg = legs[i];
    const straightLineMiles = haversineMiles(
      target.lat,
      target.lon,
      dest.lat,
      dest.lon,
    );

    if (leg?.status === "routed") {
      routed.push({
        id: dest.id,
        formatted: dest.formatted,
        lat: dest.lat,
        lon: dest.lon,
        miles: leg.metrics.miles,
        minutes: leg.metrics.minutes,
        snapDistanceMeters: leg.metrics.snapDistanceMeters,
      });
      return;
    }

    const failure =
      leg?.status === "unrouted"
        ? leg.failure
        : ({ code: "no_road_route" as const } satisfies RoutingLegFailure);

    unrouted.push({
      id: dest.id,
      formatted: dest.formatted,
      lat: dest.lat,
      lon: dest.lon,
      straightLineMiles,
      failure,
    });
  });

  const snapValues = routed
    .map((r) => r.snapDistanceMeters)
    .filter((n): n is number => typeof n === "number" && Number.isFinite(n));

  const failureCounts = countRoutingFailures(unrouted);
  const base = {
    mode: "drivingMiles" as const,
    target: {
      formatted: target.formatted,
      lat: target.lat,
      lon: target.lon,
    },
    submittedDestinationCount: destinations.length,
    routedCount: routed.length,
    unroutedCount: unrouted.length,
    failureCounts,
    unrouted,
    maxRoutedSnapMeters:
      snapValues.length > 0 ? Math.max(...snapValues) : undefined,
    targetSnapDistanceMeters:
      typeof sourceSnapDistanceMeters === "number" &&
      Number.isFinite(sourceSnapDistanceMeters)
        ? sourceSnapDistanceMeters
        : undefined,
  };

  return {
    ...base,
    likelyRootCause: inferLikelyRootCause(base),
  };
}

export function formatRequestRoutingFailure(err: unknown): RoutingRequestFailure {
  if (err instanceof Error && err.name === "TimeoutError") {
    return {
      code: "routing_timeout",
      message:
        "Driving distance request timed out. Try fewer secondary locations or retry.",
      detail: err.message,
    };
  }
  const message = err instanceof Error ? err.message : String(err);
  if (message.startsWith("Routing service error (")) {
    return {
      code: "routing_http_error",
      message:
        "The public routing service rejected or failed the request. Retry in a moment.",
      detail: message,
    };
  }
  if (message.includes("could not compute routes")) {
    return {
      code: "routing_service_error",
      message:
        "The routing service could not build a driving table for these coordinates.",
      detail: message,
    };
  }
  if (message.includes("Invalid routing")) {
    return {
      code: "routing_invalid_response",
      message: "The routing service returned an unexpected response shape.",
      detail: message,
    };
  }
  return {
    code: "routing_service_error",
    message: "Could not compute driving distances.",
    detail: message,
  };
}
