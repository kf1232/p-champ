import { NextResponse } from "next/server";

import {
  listGoogleCalendarEvents,
  requireCalendarSession,
  withRefreshedSessionCookie,
} from "@/lib/scheduler/server";

function defaultTimeMin(): string {
  return new Date().toISOString();
}

function defaultTimeMax(): string {
  const end = new Date();
  end.setDate(end.getDate() + 30);
  return end.toISOString();
}

/** GET events for a calendar (`calendarId`, optional `timeMin` / `timeMax`). */
export async function GET(req: Request) {
  const sessionResult = await requireCalendarSession();
  if (sessionResult instanceof NextResponse) {
    return sessionResult;
  }

  const url = new URL(req.url);
  const calendarId = url.searchParams.get("calendarId")?.trim() ?? "primary";
  const timeMin = url.searchParams.get("timeMin")?.trim() || defaultTimeMin();
  const timeMax = url.searchParams.get("timeMax")?.trim() || defaultTimeMax();

  const events = await listGoogleCalendarEvents(
    sessionResult.session.accessToken,
    calendarId,
    timeMin,
    timeMax,
  );

  const res = NextResponse.json({ events, calendarId, timeMin, timeMax });
  return withRefreshedSessionCookie(res, sessionResult);
}
