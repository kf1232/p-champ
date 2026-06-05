import { GOOGLE_CALENDAR_API_BASE } from "../constants";
import type { CalendarEventEntry, CalendarListEntry } from "../types";
import { refreshGoogleAccessToken } from "./googleOAuth";
import type { CalendarSession } from "./sessionCookie";

const ACCESS_TOKEN_REFRESH_SKEW_MS = 60_000;

type GoogleCalendarListResponse = {
  items?: Array<{
    id?: string;
    summary?: string;
    primary?: boolean;
  }>;
};

type GoogleEventsListResponse = {
  items?: Array<{
    id?: string;
    summary?: string;
    htmlLink?: string;
    start?: { dateTime?: string; date?: string };
    end?: { dateTime?: string; date?: string };
  }>;
};

export type ResolvedCalendarSession = {
  session: CalendarSession;
  refreshed: boolean;
};

export async function resolveCalendarSession(
  session: CalendarSession,
): Promise<ResolvedCalendarSession | null> {
  if (Date.now() < session.expiresAt - ACCESS_TOKEN_REFRESH_SKEW_MS) {
    return { session, refreshed: false };
  }

  const refreshed = await refreshGoogleAccessToken(session);
  if (!refreshed) {
    return null;
  }

  return { session: refreshed, refreshed: true };
}

export async function listGoogleCalendars(
  accessToken: string,
): Promise<CalendarListEntry[]> {
  const url = new URL(`${GOOGLE_CALENDAR_API_BASE}/users/me/calendarList`);
  url.searchParams.set("minAccessRole", "reader");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const data = (await res.json()) as GoogleCalendarListResponse;
  const items = Array.isArray(data.items) ? data.items : [];

  return items
    .filter((item): item is { id: string; summary: string; primary?: boolean } =>
      typeof item.id === "string" && typeof item.summary === "string",
    )
    .map((item) => ({
      id: item.id,
      summary: item.summary,
      primary: item.primary === true,
    }));
}

function formatEventBoundary(
  value: { dateTime?: string; date?: string } | undefined,
): string {
  if (!value) {
    return "";
  }
  if (typeof value.dateTime === "string") {
    return value.dateTime;
  }
  if (typeof value.date === "string") {
    return value.date;
  }
  return "";
}

export async function listGoogleCalendarEvents(
  accessToken: string,
  calendarId: string,
  timeMin: string,
  timeMax: string,
): Promise<CalendarEventEntry[]> {
  const url = new URL(
    `${GOOGLE_CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events`,
  );
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("timeMin", timeMin);
  url.searchParams.set("timeMax", timeMax);
  url.searchParams.set("maxResults", "50");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const data = (await res.json()) as GoogleEventsListResponse;
  const items = Array.isArray(data.items) ? data.items : [];

  return items
    .filter((item): item is {
      id: string;
      summary?: string;
      htmlLink?: string;
      start?: { dateTime?: string; date?: string };
      end?: { dateTime?: string; date?: string };
    } => typeof item.id === "string")
    .map((item) => ({
      id: item.id,
      summary: typeof item.summary === "string" ? item.summary : "",
      start: formatEventBoundary(item.start),
      end: formatEventBoundary(item.end),
      htmlLink: typeof item.htmlLink === "string" ? item.htmlLink : undefined,
    }));
}
