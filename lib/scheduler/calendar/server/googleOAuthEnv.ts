export function getGoogleOAuthClientId(): string | null {
  const value = process.env.SCHEDULER_GOOGLE_OAUTH_CLIENT_ID?.trim();
  return value && value.length > 0 ? value : null;
}

export function getGoogleOAuthClientSecret(): string | null {
  const value = process.env.SCHEDULER_GOOGLE_OAUTH_CLIENT_SECRET?.trim();
  return value && value.length > 0 ? value : null;
}

export function getCalendarSessionSecret(): string | null {
  const value = process.env.SCHEDULER_CALENDAR_SESSION_SECRET?.trim();
  return value && value.length > 0 ? value : null;
}

export function isGoogleCalendarConfigured(): boolean {
  return (
    getGoogleOAuthClientId() !== null &&
    getGoogleOAuthClientSecret() !== null &&
    getCalendarSessionSecret() !== null
  );
}

export function resolveCalendarOAuthRedirectUri(requestUrl: string): string {
  const origin = new URL(requestUrl).origin;
  return `${origin}/api/scheduler/calendar/callback`;
}
