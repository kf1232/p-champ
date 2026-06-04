import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { BURKE_LOCATION_FINDER_GRANT_COOKIE } from "./constants";

const GRANT_PAYLOAD = "lf";

/** Compare env-stored secrets; use long random values in production. */
function hashPassword(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

export function getLocationFinderPassword(): string | null {
  const value = process.env.BURKE_LOCATION_FINDER_PASSWORD?.trim();
  return value && value.length > 0 ? value : null;
}

export function getLocationFinderSecret(): string | null {
  const value = process.env.BURKE_LOCATION_FINDER_SECRET?.trim();
  return value && value.length > 0 ? value : null;
}

export function isLocationFinderGateConfigured(): boolean {
  return (
    getLocationFinderPassword() !== null &&
    getLocationFinderSecret() !== null
  );
}

export function verifyLocationFinderPassword(candidate: string): boolean {
  const expected = getLocationFinderPassword();
  if (!expected) {
    return false;
  }
  const a = hashPassword(candidate);
  const b = hashPassword(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function createGrantToken(secret: string): string {
  const sig = createHmac("sha256", secret)
    .update(GRANT_PAYLOAD)
    .digest("base64url");
  return `${GRANT_PAYLOAD}.${sig}`;
}

export function verifyGrantToken(
  secret: string,
  token: string | undefined,
): boolean {
  if (!token) {
    return false;
  }
  const dot = token.indexOf(".");
  if (dot < 0) {
    return false;
  }
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (payload !== GRANT_PAYLOAD || !sig) {
    return false;
  }
  const expected = createHmac("sha256", secret)
    .update(GRANT_PAYLOAD)
    .digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function hasValidLocationFinderGrant(
  cookieValue: string | undefined,
): boolean {
  const secret = getLocationFinderSecret();
  if (!secret || !isLocationFinderGateConfigured()) {
    return false;
  }
  return verifyGrantToken(secret, cookieValue);
}

export function readGrantFromRequest(req: NextRequest): string | undefined {
  return req.cookies.get(BURKE_LOCATION_FINDER_GRANT_COOKIE)?.value;
}

export function isRequestGranted(req: NextRequest): boolean {
  return hasValidLocationFinderGrant(readGrantFromRequest(req));
}

/**
 * API route guard — returns a response when access is denied, else null.
 * Returns **503** when gate env is missing; **401** when configured but cookie is invalid.
 */
export async function requireLocationFinderGrant(): Promise<NextResponse | null> {
  if (!isLocationFinderGateConfigured()) {
    return NextResponse.json(
      { error: "Location Finder is not configured." },
      { status: 503 },
    );
  }

  const store = await cookies();
  const granted = hasValidLocationFinderGrant(
    store.get(BURKE_LOCATION_FINDER_GRANT_COOKIE)?.value,
  );

  if (!granted) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return null;
}

export type LocationFinderPreloadStatus = {
  configured: boolean;
  granted: boolean;
};

export async function getLocationFinderPreloadStatus(
  grantCookieValue: string | undefined,
): Promise<LocationFinderPreloadStatus> {
  const configured = isLocationFinderGateConfigured();
  const granted =
    configured && hasValidLocationFinderGrant(grantCookieValue);

  return {
    configured,
    granted,
  };
}

/** Grant guard for geocode, batch, and proximity routes. */
export async function requireLocationFinderApiAccess(): Promise<NextResponse | null> {
  return requireLocationFinderGrant();
}

export type GrantCookieOptions = {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: "/";
};

export function grantCookieOptions(): GrantCookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };
}

export function buildGrantCookie(token: string): {
  name: string;
  value: string;
  options: GrantCookieOptions;
} {
  return {
    name: BURKE_LOCATION_FINDER_GRANT_COOKIE,
    value: token,
    options: grantCookieOptions(),
  };
}
