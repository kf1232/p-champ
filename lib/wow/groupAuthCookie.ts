import { createHash, createHmac, timingSafeEqual } from "crypto";

import { parseGalleryKeyedEnvJson } from "@/lib/photographyGalleryEnv";

/** HttpOnly cookie storing HMAC-signed granted group ids (newline-delimited payload). */
export const WOW_GROUP_GRANTS_COOKIE = "wow_group_grants";

function hashPassword(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

export function getWowGroupSecret(): string | null {
  const s = process.env.WOW_GROUP_SECRET?.trim();
  return s && s.length > 0 ? s : null;
}

/** When unset or group has no entry → no password gate for that group. */
export function groupRequiresPassword(groupId: string): boolean {
  const map = parseGalleryKeyedEnvJson(process.env.WOW_GROUP_PASSWORDS);
  return map?.has(groupId) ?? false;
}

export function signGrantedGroupIds(ids: readonly string[], secret: string): string {
  const sorted = [...new Set(ids)].sort().join("\0");
  const sig = createHmac("sha256", secret)
    .update(`wow-groups:${sorted}`, "utf8")
    .digest("base64url");
  const payload = Buffer.from(sorted, "utf8").toString("base64url");
  return `${payload}.${sig}`;
}

export function parseGrantedGroupIds(
  cookieValue: string | undefined,
  secret: string,
): Set<string> | null {
  if (!cookieValue || !secret) {
    return null;
  }
  const dot = cookieValue.lastIndexOf(".");
  if (dot <= 0) {
    return null;
  }
  const payloadB64 = cookieValue.slice(0, dot);
  const sig = cookieValue.slice(dot + 1);
  let sorted: string;
  try {
    sorted = Buffer.from(payloadB64, "base64url").toString("utf8");
  } catch {
    return null;
  }
  const expectedSig = createHmac("sha256", secret)
    .update(`wow-groups:${sorted}`, "utf8")
    .digest("base64url");
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expectedSig, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return null;
  }
  return new Set(sorted.split("\0").filter(Boolean));
}

export function mergeGrant(
  existingCookie: string | undefined,
  secret: string,
  groupId: string,
): string {
  const cur = parseGrantedGroupIds(existingCookie, secret);
  const next = new Set(cur ?? []);
  next.add(groupId);
  return signGrantedGroupIds([...next], secret);
}

export type RevokeGrantResult =
  | { kind: "noop" }
  | { kind: "delete" }
  | { kind: "set"; value: string };

/** Remove one group id from the signed grant cookie payload. */
export function revokeGrant(
  existingCookie: string | undefined,
  secret: string,
  groupId: string,
): RevokeGrantResult {
  const cur = parseGrantedGroupIds(existingCookie, secret);
  if (!cur || !cur.has(groupId)) {
    return { kind: "noop" };
  }
  cur.delete(groupId);
  if (cur.size === 0) {
    return { kind: "delete" };
  }
  return { kind: "set", value: signGrantedGroupIds([...cur], secret) };
}

export function passwordsEqual(a: string, b: string): boolean {
  const x = hashPassword(a);
  const y = hashPassword(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
