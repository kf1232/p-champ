import { createHash, createHmac, timingSafeEqual } from "crypto";

import { APIZZA_GRANT_COOKIE } from "./constants";

const GRANT_PAYLOAD = "apizza";
const APIZZA_PASSWORD = "timon";
const APIZZA_GRANT_SECRET = "apizza-austin-grant-v1";

function hashPassword(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

export function verifyApizzaPassword(candidate: string): boolean {
  const a = hashPassword(candidate);
  const b = hashPassword(APIZZA_PASSWORD);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function createApizzaGrantToken(): string {
  const sig = createHmac("sha256", APIZZA_GRANT_SECRET)
    .update(GRANT_PAYLOAD)
    .digest("base64url");
  return `${GRANT_PAYLOAD}.${sig}`;
}

export function hasValidApizzaGrant(cookieValue: string | undefined): boolean {
  if (!cookieValue) {
    return false;
  }

  const dot = cookieValue.indexOf(".");
  if (dot < 0) {
    return false;
  }

  const payload = cookieValue.slice(0, dot);
  const sig = cookieValue.slice(dot + 1);
  if (payload !== GRANT_PAYLOAD || !sig) {
    return false;
  }

  const expected = createHmac("sha256", APIZZA_GRANT_SECRET)
    .update(GRANT_PAYLOAD)
    .digest("base64url");

  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

type GrantCookieOptions = {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: "/";
};

function grantCookieOptions(): GrantCookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };
}

export function buildApizzaGrantCookie(token: string): {
  name: string;
  value: string;
  options: GrantCookieOptions;
} {
  return {
    name: APIZZA_GRANT_COOKIE,
    value: token,
    options: grantCookieOptions(),
  };
}

export { APIZZA_GRANT_COOKIE };
