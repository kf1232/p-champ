import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import {
  rosterByUserForGroup,
  WOW_GROUP_ENTRIES,
  WOW_GROUP_ID_SET,
} from "@/components/wow/config/wowRosterConfig";
import { enrichGroupRosterSections } from "@/lib/wow/battleNetCharacterProfile";
import { wowGroupHasAccess } from "@/lib/wow/groupAuthServer";
import { wowGroupGateUrl } from "@/lib/wow/wowRoutes";
import { PORTAL_NAME } from "@/lib/site";

import { WowGroupDetailView } from "./components/WowGroupDetailView";

type PageProps = {
  params: Promise<{ groupId: string }>;
};

export function generateStaticParams(): { groupId: string }[] {
  return WOW_GROUP_ENTRIES.map((g) => ({ groupId: g.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { groupId } = await params;
  const group = WOW_GROUP_ENTRIES.find((g) => g.id === groupId);
  if (!group) {
    return { title: "Group" };
  }
  return {
    title: {
      absolute: `${group.name} · WoW · ${PORTAL_NAME}`,
    },
  };
}

export default async function WowGroupDetailScreen({ params }: PageProps) {
  const { groupId } = await params;
  if (!WOW_GROUP_ID_SET.has(groupId)) {
    notFound();
  }

  if (!(await wowGroupHasAccess(groupId))) {
    redirect(wowGroupGateUrl(groupId));
  }

  const group = WOW_GROUP_ENTRIES.find((g) => g.id === groupId)!;
  const rosterSections = rosterByUserForGroup(groupId);
  const enrichedSections = await enrichGroupRosterSections(rosterSections);

  return <WowGroupDetailView group={group} sections={enrichedSections} />;
}
