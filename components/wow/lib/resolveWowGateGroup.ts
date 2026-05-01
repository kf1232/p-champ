import { WOW_GROUP_ENTRIES, WOW_GROUP_ID_SET } from "@/components/wow/config/wowRosterConfig";
import { groupRequiresPassword } from "@/lib/wow/groupAuthCookie";
import { WOW_GATE_SEARCH_PARAM } from "@/lib/site";

export type WowGateGroup = {
  id: string;
  name: string;
  scheduleLabel: string;
};

/**
 * If `?gate=` points at a password-gated known group, return modal payload; else null.
 */
export function resolveWowGateGroup(
  sp: Record<string, string | string[] | undefined>,
): WowGateGroup | null {
  const raw = sp[WOW_GATE_SEARCH_PARAM];
  const gateParam =
    typeof raw === "string"
      ? raw
      : Array.isArray(raw)
        ? raw[0]
        : undefined;
  const gateGroupId =
    gateParam && WOW_GROUP_ID_SET.has(gateParam) ? gateParam : null;

  if (!gateGroupId || !groupRequiresPassword(gateGroupId)) {
    return null;
  }

  const g = WOW_GROUP_ENTRIES.find((x) => x.id === gateGroupId)!;
  return {
    id: g.id,
    name: g.name,
    scheduleLabel: g.scheduleLabel,
  };
}
