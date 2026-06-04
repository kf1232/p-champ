import { NextResponse } from "next/server";

import { requireLocationFinderApiAccess } from "@/lib/burke/location-finder/access/locationFinderGrant";
import { BURKE_GEOCODE_QUERY_PARAM } from "@/lib/burke/geo/constants";
import { geoGoogleMapsApiKey } from "@/lib/burke/geo/googleGeocodeSearch";
import { geocodeServiceUnavailableResponse } from "@/lib/burke/geo/geocodeApiErrors";
import { resolveAddressQuery } from "@/lib/burke/geo/resolveAddress";

/** Query: `address` (required). Geocodes via Google Geocoding API. */
export async function GET(req: Request) {
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

  const address = new URL(req.url).searchParams
    .get(BURKE_GEOCODE_QUERY_PARAM)
    ?.trim();

  if (!address) {
    return NextResponse.json(
      { error: `Missing query parameter: ${BURKE_GEOCODE_QUERY_PARAM}` },
      { status: 400 },
    );
  }

  try {
    const body = await resolveAddressQuery(address);
    return NextResponse.json(body, { status: 200 });
  } catch {
    return geocodeServiceUnavailableResponse();
  }
}
