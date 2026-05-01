import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { WOW_GROUP_ENTRIES } from "@/components/wow/config/wowRosterConfig";
import {
  getWowGroupSecret,
  revokeGrant,
  WOW_GROUP_GRANTS_COOKIE,
} from "@/lib/wow/groupAuthCookie";

const GROUP_IDS = new Set(WOW_GROUP_ENTRIES.map((g) => g.id));

/**
 * Body: `{ groupId: string }`.
 * Removes that group id from the signed `wow_group_grants` cookie (or clears the cookie).
 */
export async function POST(req: Request) {
  const secret = getWowGroupSecret();
  if (!secret) {
    return NextResponse.json({ ok: true as const });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const b = body as { groupId?: unknown };
  const groupId =
    typeof b.groupId === "string" && b.groupId.trim().length > 0
      ? b.groupId.trim()
      : "";

  if (!groupId || !GROUP_IDS.has(groupId)) {
    return NextResponse.json({ error: "Invalid group." }, { status: 400 });
  }

  const jar = await cookies();
  const prev = jar.get(WOW_GROUP_GRANTS_COOKIE)?.value;
  const result = revokeGrant(prev, secret, groupId);

  if (result.kind === "noop") {
    return NextResponse.json({ ok: true as const });
  }

  const secure = process.env.NODE_ENV === "production";
  const res = NextResponse.json({ ok: true as const });

  if (result.kind === "delete") {
    res.cookies.delete(WOW_GROUP_GRANTS_COOKIE);
  } else {
    res.cookies.set(WOW_GROUP_GRANTS_COOKIE, result.value, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure,
    });
  }

  return res;
}
