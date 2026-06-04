import { NextResponse } from "next/server";

/** Upstream geocode failure (network, Google API, misconfiguration). */
export function geocodeServiceUnavailableResponse(): NextResponse {
  return NextResponse.json(
    { error: "Geocoding service unavailable." },
    { status: 502 },
  );
}
