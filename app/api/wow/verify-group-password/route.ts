import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { WOW_GROUP_ENTRIES } from "@/components/wow/config/wowRosterConfig";
import { parseGalleryKeyedEnvJson } from "@/lib/photographyGalleryEnv";
import {
  getWowGroupSecret,
  mergeGrant,
  WOW_GROUP_GRANTS_COOKIE,
  passwordsEqual,
} from "@/lib/wow/groupAuthCookie";

const GROUP_IDS = new Set(WOW_GROUP_ENTRIES.map((g) => g.id));

/**
 * Body: `{ groupId: string, password: string }`.
 * On success sets httpOnly signed cookie `wow_group_grants` with this group id merged in (session cookie; revoked when leaving `/wow/groups/[groupId]`).
 */
export async function POST(req: Request) {
  const secret = getWowGroupSecret();
  const passwordMap = parseGalleryKeyedEnvJson(process.env.WOW_GROUP_PASSWORDS);

  if (!secret) {
    return NextResponse.json(
      { error: "Server is not configured for group passwords (WOW_GROUP_SECRET)." },
      { status: 503 },
    );
  }

  if (!passwordMap || passwordMap.size === 0) {
    return NextResponse.json(
      { error: "Group passwords are not configured." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const b = body as { groupId?: unknown; password?: unknown };
  const groupId =
    typeof b.groupId === "string" && b.groupId.trim().length > 0
      ? b.groupId.trim()
      : "";
  const password = typeof b.password === "string" ? b.password : "";

  if (!groupId || !GROUP_IDS.has(groupId)) {
    return NextResponse.json({ error: "Invalid group." }, { status: 400 });
  }

  const expectedPassword = passwordMap.get(groupId);
  if (!expectedPassword) {
    return NextResponse.json(
      { error: "This group does not use a password." },
      { status: 400 },
    );
  }

  if (!passwordsEqual(password, expectedPassword)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const jar = await cookies();
  const prev = jar.get(WOW_GROUP_GRANTS_COOKIE)?.value;
  const value = mergeGrant(prev, secret, groupId);
  const secure = process.env.NODE_ENV === "production";

  const res = NextResponse.json({ ok: true as const });
  // Session cookie (no maxAge): cleared when the browser session ends. Grants are
  // also revoked when navigating away from `/wow/groups/[groupId]` (see WowGroupAccessRevokeBridge).
  res.cookies.set(WOW_GROUP_GRANTS_COOKIE, value, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure,
  });
  return res;
}
