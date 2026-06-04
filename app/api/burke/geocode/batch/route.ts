import { NextResponse } from "next/server";

import { BURKE_GEOCODE_BATCH_MAX } from "@/lib/burke";
import {
  geoGoogleMapsApiKey,
  geocodeServiceUnavailableResponse,
  requireLocationFinderApiAccess,
  resolveAddressQueries,
} from "@/lib/burke/server";

/** Allow long batch runs on hosts that support extended route duration. */
export const maxDuration = 300;

type BatchBody = {
  addresses?: unknown;
  /** When true, skips fallback geocode queries (fewer Google API calls). */
  skipFallbacks?: unknown;
};

/** POST `{ addresses: string[] }` — resolve via Google with shared cache (batch only). */
export async function POST(req: Request) {
  const denied = await requireLocationFinderApiAccess();
  if (denied) {
    return denied;
  }

  if (geoGoogleMapsApiKey() === null) {
    return NextResponse.json(
      { error: "Geocoding is not configured (set BURKE_GOOGLE_MAPS_API_KEY)." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const raw = (body as BatchBody).addresses;
  if (!Array.isArray(raw)) {
    return NextResponse.json({ error: "Missing addresses array." }, { status: 400 });
  }

  const addresses = raw
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length >= 3);

  if (addresses.length === 0) {
    return NextResponse.json({ results: {} }, { status: 200 });
  }

  if (addresses.length > BURKE_GEOCODE_BATCH_MAX) {
    return NextResponse.json(
      {
        error: `At most ${BURKE_GEOCODE_BATCH_MAX} addresses per batch.`,
      },
      { status: 400 },
    );
  }

  const skipFallbacks = (body as BatchBody).skipFallbacks === true;

  try {
    const results = await resolveAddressQueries(addresses, fetch, {
      skipFallbacks,
      useCache: true,
    });
    return NextResponse.json({ results }, { status: 200 });
  } catch {
    return geocodeServiceUnavailableResponse();
  }
}
