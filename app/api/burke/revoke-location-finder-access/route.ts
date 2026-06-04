import { NextResponse } from "next/server";

import { BURKE_LOCATION_FINDER_GRANT_COOKIE } from "@/lib/burke/location-finder/access/constants";
import { grantCookieOptions } from "@/lib/burke/location-finder/access/locationFinderGrant";

/** Clears the Location Finder grant cookie (session ends for this tool). */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(BURKE_LOCATION_FINDER_GRANT_COOKIE, "", {
    ...grantCookieOptions(),
    maxAge: 0,
  });
  return res;
}
