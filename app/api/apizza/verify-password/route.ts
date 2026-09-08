import { NextResponse } from "next/server";

import {
  buildApizzaGrantCookie,
  createApizzaGrantToken,
  verifyApizzaPassword,
} from "@/lib/apizza/access/server";

/** POST `{ password: string }` — sets httpOnly session grant cookie on success. */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const password =
    typeof (body as { password?: unknown }).password === "string"
      ? (body as { password: string }).password
      : "";

  if (!verifyApizzaPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const cookie = buildApizzaGrantCookie(createApizzaGrantToken());
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
