/** Server-only Scheduler APIs. Import from `@/lib/scheduler/server` (not `@/lib/scheduler`). */

export {
  applySessionCookie,
  buildGoogleOAuthAuthorizeUrl,
  buildSessionCookie,
  clearSessionCookie,
  createOAuthStateToken,
  exchangeGoogleOAuthCode,
  isGoogleCalendarConfigured,
  listGoogleCalendarEvents,
  listGoogleCalendars,
  readSessionFromCookies,
  requireCalendarSession,
  requireConfiguredCalendarApi,
  verifyOAuthStateToken,
  withRefreshedSessionCookie,
  type CalendarSession,
  type CalendarSessionResult,
} from "./calendar/server";
