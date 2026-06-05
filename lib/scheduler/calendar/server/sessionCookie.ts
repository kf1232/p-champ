import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SCHEDULER_CALENDAR_SESSION_COOKIE } from "../constants";
import { getCalendarSessionSecret } from "./googleOAuthEnv";

export type CalendarSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  email?: string;
};

type SignedPayload = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  email?: string;
};

const STATE_MAX_AGE_MS = 10 * 60 * 1000;

function sign(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function encodePayload(session: SignedPayload): string {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

function decodePayload(encoded: string): SignedPayload | null {
  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as SignedPayload;
    if (
      !parsed ||
      typeof parsed.accessToken !== "string" ||
      typeof parsed.refreshToken !== "string" ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function verifySignedToken(
  secret: string,
  token: string | undefined,
): SignedPayload | null {
  if (!token) {
    return null;
  }
  const dot = token.indexOf(".");
  if (dot < 0) {
    return null;
  }
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!payload || !sig) {
    return null;
  }
  const expected = sign(secret, payload);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return null;
    }
  } catch {
    return null;
  }
  return decodePayload(payload);
}

export function createSignedSessionToken(session: CalendarSession): string | null {
  const secret = getCalendarSessionSecret();
  if (!secret) {
    return null;
  }
  const payload = encodePayload(session);
  return `${payload}.${sign(secret, payload)}`;
}

export function readSignedSessionToken(
  token: string | undefined,
): CalendarSession | null {
  const secret = getCalendarSessionSecret();
  if (!secret) {
    return null;
  }
  return verifySignedToken(secret, token);
}

export function readSessionFromRequest(
  req: NextRequest,
): CalendarSession | null {
  return readSignedSessionToken(
    req.cookies.get(SCHEDULER_CALENDAR_SESSION_COOKIE)?.value,
  );
}

export async function readSessionFromCookies(): Promise<CalendarSession | null> {
  const store = await cookies();
  return readSignedSessionToken(
    store.get(SCHEDULER_CALENDAR_SESSION_COOKIE)?.value,
  );
}

export type SessionCookieOptions = {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: "/";
  maxAge?: number;
};

export function sessionCookieOptions(): SessionCookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  };
}

export function buildSessionCookie(session: CalendarSession): {
  name: string;
  value: string;
  options: SessionCookieOptions;
} | null {
  const value = createSignedSessionToken(session);
  if (!value) {
    return null;
  }
  return {
    name: SCHEDULER_CALENDAR_SESSION_COOKIE,
    value,
    options: sessionCookieOptions(),
  };
}

export function applySessionCookie(
  res: NextResponse,
  session: CalendarSession,
): boolean {
  const cookie = buildSessionCookie(session);
  if (!cookie) {
    return false;
  }
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return true;
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(SCHEDULER_CALENDAR_SESSION_COOKIE, "", {
    ...sessionCookieOptions(),
    maxAge: 0,
  });
}

export function createOAuthStateToken(): string | null {
  const secret = getCalendarSessionSecret();
  if (!secret) {
    return null;
  }
  const payload = Buffer.from(
    JSON.stringify({ n: randomBytes(16).toString("base64url"), t: Date.now() }),
    "utf8",
  ).toString("base64url");
  return `${payload}.${sign(secret, payload)}`;
}

function verifySignedPayload(
  secret: string,
  token: string,
): Record<string, unknown> | null {
  const dot = token.indexOf(".");
  if (dot < 0) {
    return null;
  }
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!payload || !sig) {
    return null;
  }
  const expected = sign(secret, payload);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return null;
    }
  } catch {
    return null;
  }
  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Record<string, unknown>;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function verifyOAuthStateToken(state: string | null): boolean {
  const secret = getCalendarSessionSecret();
  if (!secret || !state) {
    return false;
  }
  const raw = verifySignedPayload(secret, state);
  if (!raw || typeof raw.t !== "number") {
    return false;
  }
  return Date.now() - raw.t <= STATE_MAX_AGE_MS;
}
