import { NextResponse } from "next/server";

import { isGoogleCalendarConfigured } from "./googleOAuthEnv";
import {
  applySessionCookie,
  readSessionFromCookies,
  type CalendarSession,
} from "./sessionCookie";
import { resolveCalendarSession } from "./googleCalendarApi";

export type CalendarSessionResult = {
  session: CalendarSession;
  refreshed: boolean;
};

export function calendarNotConfiguredResponse(): NextResponse {
  return NextResponse.json(
    { error: "Google Calendar is not configured." },
    { status: 503 },
  );
}

export function calendarUnauthorizedResponse(): NextResponse {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function requireConfiguredCalendarApi(): Promise<NextResponse | null> {
  if (!isGoogleCalendarConfigured()) {
    return calendarNotConfiguredResponse();
  }
  return null;
}

export async function requireCalendarSession(): Promise<
  CalendarSessionResult | NextResponse
> {
  const denied = await requireConfiguredCalendarApi();
  if (denied) {
    return denied;
  }

  const session = await readSessionFromCookies();
  if (!session) {
    return calendarUnauthorizedResponse();
  }

  const resolved = await resolveCalendarSession(session);
  if (!resolved) {
    return calendarUnauthorizedResponse();
  }

  return resolved;
}

export function withRefreshedSessionCookie(
  res: NextResponse,
  result: CalendarSessionResult,
): NextResponse {
  if (result.refreshed) {
    applySessionCookie(res, result.session);
  }
  return res;
}
