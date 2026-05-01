import {
  WOW_GATE_SEARCH_PARAM,
  WOW_HOME_PATH,
  wowGroupDetailPath,
} from "@/lib/site";

/** Match pathname `/wow/groups/{groupId}` (capture group 1 = id). */
export const WOW_GROUP_DETAIL_PATHNAME_RE = /^\/wow\/groups\/([^/]+)$/;

export function wowGroupGateUrl(groupId: string): string {
  return `${WOW_HOME_PATH}?${WOW_GATE_SEARCH_PARAM}=${encodeURIComponent(groupId)}`;
}

export function wowGroupEntryHrefFromList(groupId: string, gated: boolean): string {
  return gated ? wowGroupGateUrl(groupId) : wowGroupDetailPath(groupId);
}
