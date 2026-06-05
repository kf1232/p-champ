import { NextResponse } from "next/server";

import { SCHEDULER_CALENDAR_PATH } from "@/lib/site";
import {
  applySessionCookie,
  buildSessionCookie,
  exchangeGoogleOAuthCode,
  requireConfiguredCalendarApi,
  verifyOAuthStateToken,
} from "@/lib/scheduler/server";

function calendarPageRedirect(
  req: Request,
  query?: Record<string, string>,
): NextResponse {
  const destination = new URL(SCHEDULER_CALENDAR_PATH, req.url);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      destination.searchParams.set(key, value);
    }
  }
  return NextResponse.redirect(destination);
}

/** Google OAuth callback — exchanges code and sets session cookie. */
export async function GET(req: Request) {
  const denied = await requireConfiguredCalendarApi();
  if (denied) {
    return denied;
  }

  const url = new URL(req.url);
  const error = url.searchParams.get("error");
  if (error) {
    return calendarPageRedirect(req, { error });
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !verifyOAuthStateToken(state)) {
    return calendarPageRedirect(req, { error: "oauth" });
  }

  const session = await exchangeGoogleOAuthCode(req.url, code);
  if (!session || !buildSessionCookie(session)) {
    return calendarPageRedirect(req, { error: "token" });
  }

  const res = calendarPageRedirect(req);
  applySessionCookie(res, session);
  return res;
}