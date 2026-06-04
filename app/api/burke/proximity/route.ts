import { NextResponse } from "next/server";

import {
  buildProximityRoutingDiagnostics,
  dedupeResolvedLocations,
  expandProximityMatches,
  expandProximityRoutingDiagnostics,
  filterByDrivingMilesThreshold,
  formatRequestRoutingFailure,
  isDrivingDistanceUnit,
  listProximityMetricsDriving,
  LOCATION_FINDER_MAX_SECONDARY_LOCATIONS,
  normalizeDistanceUnit,
} from "@/lib/burke";
import type {
  DistanceThreshold,
  ResolvedLocation,
} from "@/lib/burke";
import {
  fetchOsrmTableMetrics,
  requireLocationFinderApiAccess,
} from "@/lib/burke/server";

type ProximityRequestBody = {
  target?: ResolvedLocation;
  destinations?: ResolvedLocation[];
  threshold?: DistanceThreshold;
};

function isResolvedLocation(v: unknown): v is ResolvedLocation {
  return (
    v !== null &&
    typeof v === "object" &&
    typeof (v as ResolvedLocation).id === "string" &&
    typeof (v as ResolvedLocation).formatted === "string" &&
    typeof (v as ResolvedLocation).lat === "number" &&
    typeof (v as ResolvedLocation).lon === "number" &&
    Number.isFinite((v as ResolvedLocation).lat) &&
    Number.isFinite((v as ResolvedLocation).lon)
  );
}

/** POST — driving-distance proximity (OSRM road miles from target to each destination). */
export async function POST(req: Request) {
  const denied = await requireLocationFinderApiAccess();
  if (denied) {
    return denied;
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const b = body as ProximityRequestBody;
  const target = b.target;
  const destinations = b.destinations;
  const threshold = b.threshold;
  const unit = threshold ? normalizeDistanceUnit(threshold.unit) : null;

  if (!isResolvedLocation(target)) {
    return NextResponse.json({ error: "Missing target." }, { status: 400 });
  }

  if (
    !Array.isArray(destinations) ||
    destinations.length === 0 ||
    !destinations.every(isResolvedLocation)
  ) {
    return NextResponse.json(
      { error: "Missing destinations." },
      { status: 400 },
    );
  }

  if (
    !threshold ||
    !unit ||
    !isDrivingDistanceUnit(unit) ||
    !Number.isFinite(threshold.value) ||
    threshold.value <= 0
  ) {
    return NextResponse.json(
      { error: "Invalid driving miles threshold." },
      { status: 400 },
    );
  }

  const deduped = dedupeResolvedLocations(destinations);
  if (deduped.unique.length > LOCATION_FINDER_MAX_SECONDARY_LOCATIONS) {
    return NextResponse.json(
      {
        error: `At most ${LOCATION_FINDER_MAX_SECONDARY_LOCATIONS} distinct locations per search (${deduped.unique.length} after removing duplicates).`,
      },
      { status: 400 },
    );
  }

  try {
    const { legs, sourceSnapDistanceMeters } = await fetchOsrmTableMetrics(
      target,
      deduped.unique.map((d) => ({ lat: d.lat, lon: d.lon })),
    );

    const diagnostics = expandProximityRoutingDiagnostics(
      buildProximityRoutingDiagnostics(
        target,
        deduped.unique,
        legs,
        sourceSnapDistanceMeters,
      ),
      destinations,
      deduped.canonicalIdByInputId,
    );

    const minutesById = new Map<string, number>();
    const milesById = new Map<string, number>();

    deduped.unique.forEach((dest, i) => {
      const leg = legs[i];
      if (!leg || leg.status !== "routed") {
        return;
      }
      minutesById.set(dest.id, leg.metrics.minutes);
      milesById.set(dest.id, leg.metrics.miles);
    });

    const canonicalMetrics = listProximityMetricsDriving(
      deduped.unique,
      milesById,
      minutesById,
    );
    const canonicalMatches = filterByDrivingMilesThreshold(
      deduped.unique,
      milesById,
      minutesById,
      threshold.value,
    );

    const metrics = expandProximityMatches(
      canonicalMetrics,
      destinations,
      deduped.canonicalIdByInputId,
    );
    const matches = expandProximityMatches(
      canonicalMatches,
      destinations,
      deduped.canonicalIdByInputId,
    );

    return NextResponse.json(
      {
        unit: "drivingMiles",
        matches,
        metrics,
        unroutedCount: diagnostics.unroutedCount,
        duplicateCount: deduped.duplicateInputIds.length,
        diagnostics,
      },
      { status: 200 },
    );
  } catch (err) {
    const failure = formatRequestRoutingFailure(err);
    return NextResponse.json(
      {
        error: failure.message,
        requestFailure: failure,
      },
      { status: 502 },
    );
  }
}
