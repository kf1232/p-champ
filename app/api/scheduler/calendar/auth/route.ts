import { NextResponse } from "next/server";

import {
  buildGoogleOAuthAuthorizeUrl,
  createOAuthStateToken,
  requireConfiguredCalendarApi,
} from "@/lib/scheduler/server";

/** Starts Google OAuth for Calendar (redirect). */
export async function GET(req: Request) {
  const denied = await requireConfiguredCalendarApi();
  if (denied) {
    return denied;
  }

  const state = createOAuthStateToken();
  if (!state) {
    return NextResponse.json(
      { error: "Google Calendar is not configured." },
      { status: 503 },
    );
  }

  const authorizeUrl = buildGoogleOAuthAuthorizeUrl(req.url, state);
  if (!authorizeUrl) {
    return NextResponse.json(
      { error: "Google Calendar is not configured." },
      { status: 503 },
    );
  }

  return NextResponse.redirect(authorizeUrl);
}
