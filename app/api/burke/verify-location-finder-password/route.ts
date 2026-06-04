import { NextResponse } from "next/server";

import {
  buildGrantCookie,
  createGrantToken,
  getLocationFinderSecret,
  isLocationFinderGateConfigured,
  verifyLocationFinderPassword,
} from "@/lib/burke/location-finder/access/locationFinderGrant";

/** POST `{ password: string }` — sets httpOnly session grant cookie on success. */
export async function POST(req: Request) {
  if (!isLocationFinderGateConfigured()) {
    return NextResponse.json(
      { error: "Location Finder is not configured." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const password =
    typeof (body as { password?: unknown }).password === "string"
      ? (body as { password: string }).password
      : "";

  if (!verifyLocationFinderPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const secret = getLocationFinderSecret()!;
  const token = createGrantToken(secret);
  const cookie = buildGrantCookie(token);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
