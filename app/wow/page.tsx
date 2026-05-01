import type { Metadata } from "next";

import { WowScreen } from "@/components/wow";
import { WOW_GROUP_ENTRIES } from "@/components/wow/config/wowRosterConfig";
import { groupRequiresPassword } from "@/lib/wow/groupAuthCookie";
import {
  PORTAL_NAME,
  WOW_GATE_SEARCH_PARAM,
} from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `WoW · ${PORTAL_NAME}`,
  },
};

export const dynamic = "force-dynamic";

const VALID_GROUP_IDS = new Set(WOW_GROUP_ENTRIES.map((g) => g.id));

type WowPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function WowPage({ searchParams }: WowPageProps) {
  const sp = (await searchParams) ?? {};
  const raw = sp[WOW_GATE_SEARCH_PARAM];
  const gateParam =
    typeof raw === "string"
      ? raw
      : Array.isArray(raw)
        ? raw[0]
        : undefined;
  const gateGroupId =
    gateParam && VALID_GROUP_IDS.has(gateParam) ? gateParam : null;

  let gateModal: {
    id: string;
    name: string;
    scheduleLabel: string;
  } | null = null;

  if (gateGroupId && groupRequiresPassword(gateGroupId)) {
    const g = WOW_GROUP_ENTRIES.find((x) => x.id === gateGroupId)!;
    gateModal = {
      id: g.id,
      name: g.name,
      scheduleLabel: g.scheduleLabel,
    };
  }

  return <WowScreen gateGroup={gateModal} />;
}
