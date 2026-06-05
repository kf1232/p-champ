import {
  GOOGLE_CALENDAR_READONLY_SCOPE,
  GOOGLE_OAUTH_AUTH_URL,
  GOOGLE_OAUTH_TOKEN_URL,
} from "../constants";
import {
  getGoogleOAuthClientId,
  getGoogleOAuthClientSecret,
  resolveCalendarOAuthRedirectUri,
} from "./googleOAuthEnv";
import type { CalendarSession } from "./sessionCookie";

type GoogleTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
};

type GoogleUserInfo = {
  email?: string;
};

export function buildGoogleOAuthAuthorizeUrl(
  requestUrl: string,
  state: string,
): string | null {
  const clientId = getGoogleOAuthClientId();
  if (!clientId) {
    return null;
  }
  const redirectUri = resolveCalendarOAuthRedirectUri(requestUrl);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GOOGLE_CALENDAR_READONLY_SCOPE,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `${GOOGLE_OAUTH_AUTH_URL}?${params.toString()}`;
}

async function fetchGoogleUserEmail(
  accessToken: string,
): Promise<string | undefined> {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) {
    return undefined;
  }
  const data = (await res.json()) as GoogleUserInfo;
  return typeof data.email === "string" ? data.email : undefined;
}

export async function exchangeGoogleOAuthCode(
  requestUrl: string,
  code: string,
): Promise<CalendarSession | null> {
  const clientId = getGoogleOAuthClientId();
  const clientSecret = getGoogleOAuthClientSecret();
  if (!clientId || !clientSecret) {
    return null;
  }

  const redirectUri = resolveCalendarOAuthRedirectUri(requestUrl);
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const res = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const data = (await res.json()) as GoogleTokenResponse;
  if (
    !res.ok ||
    typeof data.access_token !== "string" ||
    typeof data.expires_in !== "number"
  ) {
    return null;
  }

  const refreshToken =
    typeof data.refresh_token === "string" ? data.refresh_token : "";
  if (!refreshToken) {
    return null;
  }

  const email = await fetchGoogleUserEmail(data.access_token);
  return {
    accessToken: data.access_token,
    refreshToken,
    expiresAt: Date.now() + data.expires_in * 1000,
    email,
  };
}

export async function refreshGoogleAccessToken(
  session: CalendarSession,
): Promise<CalendarSession | null> {
  const clientId = getGoogleOAuthClientId();
  const clientSecret = getGoogleOAuthClientSecret();
  if (!clientId || !clientSecret) {
    return null;
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: session.refreshToken,
    grant_type: "refresh_token",
  });

  const res = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const data = (await res.json()) as GoogleTokenResponse;
  if (!res.ok || typeof data.access_token !== "string") {
    return null;
  }

  const expiresIn =
    typeof data.expires_in === "number" ? data.expires_in : 3600;

  return {
    ...session,
    accessToken: data.access_token,
    expiresAt: Date.now() + expiresIn * 1000,
  };
}
