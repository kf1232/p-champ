import {
  getCalendarSessionSecret,
  getGoogleOAuthClientId,
  getGoogleOAuthClientSecret,
  isGoogleCalendarConfigured,
  resolveCalendarOAuthRedirectUri,
} from "./googleOAuthEnv";

describe("googleOAuthEnv", () => {
  const prev = {
    clientId: process.env.SCHEDULER_GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.SCHEDULER_GOOGLE_OAUTH_CLIENT_SECRET,
    sessionSecret: process.env.SCHEDULER_CALENDAR_SESSION_SECRET,
  };

  afterEach(() => {
    if (prev.clientId === undefined) {
      delete process.env.SCHEDULER_GOOGLE_OAUTH_CLIENT_ID;
    } else {
      process.env.SCHEDULER_GOOGLE_OAUTH_CLIENT_ID = prev.clientId;
    }
    if (prev.clientSecret === undefined) {
      delete process.env.SCHEDULER_GOOGLE_OAUTH_CLIENT_SECRET;
    } else {
      process.env.SCHEDULER_GOOGLE_OAUTH_CLIENT_SECRET = prev.clientSecret;
    }
    if (prev.sessionSecret === undefined) {
      delete process.env.SCHEDULER_CALENDAR_SESSION_SECRET;
    } else {
      process.env.SCHEDULER_CALENDAR_SESSION_SECRET = prev.sessionSecret;
    }
  });

  it("reports unconfigured when env vars are missing", () => {
    delete process.env.SCHEDULER_GOOGLE_OAUTH_CLIENT_ID;
    delete process.env.SCHEDULER_GOOGLE_OAUTH_CLIENT_SECRET;
    delete process.env.SCHEDULER_CALENDAR_SESSION_SECRET;
    expect(isGoogleCalendarConfigured()).toBe(false);
  });

  it("reports configured when all env vars are set", () => {
    process.env.SCHEDULER_GOOGLE_OAUTH_CLIENT_ID = "client-id";
    process.env.SCHEDULER_GOOGLE_OAUTH_CLIENT_SECRET = "client-secret";
    process.env.SCHEDULER_CALENDAR_SESSION_SECRET = "session-secret";
    expect(isGoogleCalendarConfigured()).toBe(true);
    expect(getGoogleOAuthClientId()).toBe("client-id");
    expect(getGoogleOAuthClientSecret()).toBe("client-secret");
    expect(getCalendarSessionSecret()).toBe("session-secret");
  });

  it("resolves callback redirect URI from request origin", () => {
    expect(
      resolveCalendarOAuthRedirectUri(
        "http://localhost:3000/api/scheduler/calendar/auth",
      ),
    ).toBe("http://localhost:3000/api/scheduler/calendar/callback");
  });
});
