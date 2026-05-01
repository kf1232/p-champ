import { cookies } from "next/headers";

import {
  WOW_GROUP_GRANTS_COOKIE,
  getWowGroupSecret,
  groupRequiresPassword,
  parseGrantedGroupIds,
} from "@/lib/wow/groupAuthCookie";

/** Server-only: full roster allowed when no password configured for this group, or cookie grants access. */
export async function wowGroupHasAccess(groupId: string): Promise<boolean> {
  if (!groupRequiresPassword(groupId)) {
    return true;
  }
  const secret = getWowGroupSecret();
  if (!secret) {
    return false;
  }
  const jar = await cookies();
  const raw = jar.get(WOW_GROUP_GRANTS_COOKIE)?.value;
  if (!raw) {
    return false;
  }
  const set = parseGrantedGroupIds(raw, secret);
  return set?.has(groupId) ?? false;
}
