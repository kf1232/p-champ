import { NextResponse } from "next/server";

import {
  listGoogleCalendars,
  requireCalendarSession,
  withRefreshedSessionCookie,
} from "@/lib/scheduler/server";

/** GET calendar list for the connected account. */
export async function GET() {
  const sessionResult = await requireCalendarSession();
  if (sessionResult instanceof NextResponse) {
    return sessionResult;
  }

  const calendars = await listGoogleCalendars(sessionResult.session.accessToken);
  const res = NextResponse.json({ calendars });
  return withRefreshedSessionCookie(res, sessionResult);
}
