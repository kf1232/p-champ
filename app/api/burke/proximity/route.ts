import { NextResponse } from "next/server";

import { requireLocationFinderApiAccess } from "@/lib/burke/location-finder/access/locationFinderGrant";
import { filterByMinutesThreshold } from "@/lib/burke/location-finder/distance/filterByThreshold";
import { fetchOsrmTableMetrics } from "@/lib/burke/location-finder/distance/osrmTable";
import type {
  DistanceThreshold,
  ResolvedLocation,
} from "@/lib/burke/location-finder/distance/types";

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
    typeof (v as ResolvedLocation).lon === "number"
  );
}

/** POST — driving-time proximity from target to each destination (minutes threshold). */
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
    threshold.unit !== "minutes" ||
    !Number.isFinite(threshold.value) ||
    threshold.value <= 0
  ) {
    return NextResponse.json(
      { error: "Invalid minutes threshold." },
      { status: 400 },
    );
  }

  try {
    const metrics = await fetchOsrmTableMetrics(
      target,
      destinations.map((d) => ({ lat: d.lat, lon: d.lon })),
    );

    const minutesById = new Map<string, number>();
    const milesById = new Map<string, number>();
    destinations.forEach((dest, i) => {
      const leg = metrics[i];
      if (!leg) {
        return;
      }
      minutesById.set(dest.id, leg.minutes);
      milesById.set(dest.id, leg.miles);
    });

    const matches = filterByMinutesThreshold(
      destinations,
      minutesById,
      milesById,
      threshold.value,
    );

    return NextResponse.json({ unit: "minutes", matches }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Could not compute drive times." },
      { status: 502 },
    );
  }
}
