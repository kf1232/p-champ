"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { AppPageIntro } from "@/components/commons";
import {
  CALENDAR_SELECTED_CALENDAR_ID_KEY,
  SCHEDULER_CALENDAR_AUTH_API_PATH,
  SCHEDULER_CALENDAR_CALENDARS_API_PATH,
  SCHEDULER_CALENDAR_DISCONNECT_API_PATH,
  SCHEDULER_CALENDAR_EVENTS_API_PATH,
  SCHEDULER_CALENDAR_STATUS_API_PATH,
  type CalendarConnectionStatus,
  type CalendarEventEntry,
  type CalendarListEntry,
} from "@/lib/scheduler";

import { useSchedulerStorage } from "../SchedulerStorageProvider";
import { CALENDAR_TITLE } from "./configs/calendarCopy";

function formatEventWhen(start: string, end: string): string {
  if (!start) {
    return "";
  }

  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;
  const dateFmt = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: start.includes("T") ? "short" : undefined,
  });

  if (!end || start === end) {
    return dateFmt.format(startDate);
  }

  if (!endDate || Number.isNaN(endDate.getTime())) {
    return dateFmt.format(startDate);
  }

  return `${dateFmt.format(startDate)} – ${dateFmt.format(endDate)}`;
}

export function CalendarScreen() {
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");
  const { data, setData } = useSchedulerStorage();

  const [status, setStatus] = useState<CalendarConnectionStatus | null>(null);
  const [calendars, setCalendars] = useState<CalendarListEntry[]>([]);
  const [events, setEvents] = useState<CalendarEventEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);

  const selectedCalendarId =
    typeof data[CALENDAR_SELECTED_CALENDAR_ID_KEY] === "string"
      ? (data[CALENDAR_SELECTED_CALENDAR_ID_KEY] as string)
      : "";

  const loadStatus = useCallback(async () => {
    const res = await fetch(SCHEDULER_CALENDAR_STATUS_API_PATH, {
      credentials: "same-origin",
      cache: "no-store",
    });
    const body = (await res.json().catch(() => ({}))) as CalendarConnectionStatus;
    setStatus({
      configured: body.configured === true,
      connected: body.connected === true,
      email: typeof body.email === "string" ? body.email : undefined,
    });
    return body;
  }, []);

  const loadCalendars = useCallback(async () => {
    const res = await fetch(SCHEDULER_CALENDAR_CALENDARS_API_PATH, {
      credentials: "same-origin",
      cache: "no-store",
    });
    if (!res.ok) {
      setCalendars([]);
      return [];
    }
    const body = (await res.json()) as { calendars?: CalendarListEntry[] };
    const next = Array.isArray(body.calendars) ? body.calendars : [];
    setCalendars(next);
    return next;
  }, []);

  const loadEvents = useCallback(async (calendarId: string) => {
    if (!calendarId) {
      setEvents([]);
      return;
    }

    setEventsLoading(true);
    try {
      const url = new URL(SCHEDULER_CALENDAR_EVENTS_API_PATH, window.location.origin);
      url.searchParams.set("calendarId", calendarId);
      const res = await fetch(url, {
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!res.ok) {
        setEvents([]);
        return;
      }
      const body = (await res.json()) as { events?: CalendarEventEntry[] };
      setEvents(Array.isArray(body.events) ? body.events : []);
    } finally {
      setEventsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const storedId =
      typeof data[CALENDAR_SELECTED_CALENDAR_ID_KEY] === "string"
        ? (data[CALENDAR_SELECTED_CALENDAR_ID_KEY] as string)
        : "";

    void (async () => {
      try {
        const nextStatus = await loadStatus();
        if (cancelled || nextStatus.connected !== true) {
          return;
        }

        const nextCalendars = await loadCalendars();
        if (cancelled) {
          return;
        }

        const primary =
          nextCalendars.find((calendar) => calendar.primary)?.id ??
          nextCalendars[0]?.id ??
          "primary";
        const calendarId = storedId || primary;
        if (!storedId && calendarId) {
          setData((prev) => ({
            ...prev,
            [CALENDAR_SELECTED_CALENDAR_ID_KEY]: calendarId,
          }));
        }
        await loadEvents(calendarId);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loadCalendars, loadEvents, loadStatus, setData]);

  const activeCalendarId = useMemo(() => {
    if (selectedCalendarId) {
      return selectedCalendarId;
    }
    return (
      calendars.find((calendar) => calendar.primary)?.id ??
      calendars[0]?.id ??
      "primary"
    );
  }, [calendars, selectedCalendarId]);

  const handleCalendarChange = useCallback(
    (calendarId: string) => {
      setData((prev) => ({
        ...prev,
        [CALENDAR_SELECTED_CALENDAR_ID_KEY]: calendarId,
      }));
      void loadEvents(calendarId);
    },
    [loadEvents, setData],
  );

  const handleDisconnect = useCallback(async () => {
    await fetch(SCHEDULER_CALENDAR_DISCONNECT_API_PATH, {
      method: "POST",
      credentials: "same-origin",
    });
    setCalendars([]);
    setEvents([]);
    await loadStatus();
  }, [loadStatus]);

  if (loading) {
    return null;
  }

  return (
    <>
      <AppPageIntro title={CALENDAR_TITLE} />

      {oauthError ? (
        <p className="mb-4 text-sm text-secondary" role="status">
          {oauthError}
        </p>
      ) : null}

      {status?.configured !== true ? (
        <p className="text-sm text-secondary" role="status">
          503
        </p>
      ) : null}

      {status?.configured === true && status.connected !== true ? (
        <a
          href={SCHEDULER_CALENDAR_AUTH_API_PATH}
          className="inline-flex rounded-lg border border-border-default bg-surface px-3 py-2 text-sm font-semibold text-primary hover:bg-hover"
        >
          Connect
        </a>
      ) : null}

      {status?.connected === true ? (
        <section className="mt-6 flex flex-col gap-4" aria-label="Calendar">
          <div className="flex flex-wrap items-center gap-3">
            {status.email ? (
              <span className="text-sm text-secondary">{status.email}</span>
            ) : null}
            <button
              type="button"
              onClick={() => {
                void handleDisconnect();
              }}
              className="rounded-lg border border-border-default bg-surface px-3 py-1.5 text-sm font-semibold text-primary hover:bg-hover"
            >
              Disconnect
            </button>
          </div>

          {calendars.length > 0 ? (
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-semibold text-primary">Calendar</span>
              <select
                className="max-w-md rounded-md border border-border-strong bg-surface-elevated px-2 py-1.5 text-sm text-primary"
                value={activeCalendarId}
                onChange={(event) => {
                  handleCalendarChange(event.target.value);
                }}
              >
                {calendars.map((calendar) => (
                  <option key={calendar.id} value={calendar.id}>
                    {calendar.summary}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {eventsLoading ? null : (
            <ul className="flex flex-col gap-2">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="rounded-xl border border-border-subtle bg-surface-overlay px-4 py-3"
                >
                  <div className="font-semibold text-primary">
                    {event.summary || event.id}
                  </div>
                  <div className="text-sm text-secondary">
                    {formatEventWhen(event.start, event.end)}
                  </div>
                  {event.htmlLink ? (
                    <a
                      href={event.htmlLink}
                      className="mt-1 inline-block text-sm text-primary underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {event.htmlLink}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </>
  );
}
