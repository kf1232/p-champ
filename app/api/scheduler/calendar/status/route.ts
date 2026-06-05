import { NextResponse } from "next/server";

import {
  isGoogleCalendarConfigured,
  readSessionFromCookies,
} from "@/lib/scheduler/server";

/** GET connection status for Calendar. */
export async function GET() {
  const configured = isGoogleCalendarConfigured();
  const session = configured ? await readSessionFromCookies() : null;

  return NextResponse.json({
    configured,
    connected: session !== null,
    email: session?.email,
  });
}
