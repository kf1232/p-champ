import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  rosterByUserForGroup,
  WOW_GROUP_ENTRIES,
} from "@/components/wow/config/wowRosterConfig";
import { WowGroupRosterByUser } from "@/components/wow/WowGroupRosterByUser";
import { enrichGroupRosterSections } from "@/lib/wow/battleNetCharacterProfile";
import { wowGroupHasAccess } from "@/lib/wow/groupAuthServer";
import {
  PORTAL_HOME_PATH,
  PORTAL_NAME,
  WOW_GATE_SEARCH_PARAM,
  WOW_HOME_PATH,
} from "@/lib/site";

type PageProps = {
  params: Promise<{ groupId: string }>;
};

/** Resolve Battle.net ilvl/class at request time (needs env keys for live data). */
export const dynamic = "force-dynamic";

const groupIds = new Set(WOW_GROUP_ENTRIES.map((g) => g.id));

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

export default async function WowGroupDetailPage({ params }: PageProps) {
  const { groupId } = await params;
  if (!groupIds.has(groupId)) {
    notFound();
  }

  if (!(await wowGroupHasAccess(groupId))) {
    redirect(
      `${WOW_HOME_PATH}?${WOW_GATE_SEARCH_PARAM}=${encodeURIComponent(groupId)}`,
    );
  }

  const group = WOW_GROUP_ENTRIES.find((g) => g.id === groupId)!;
  const rosterSections = rosterByUserForGroup(groupId);
  const enrichedSections = await enrichGroupRosterSections(rosterSections);

  return (
    <div className="wow-screen-root">
      <header className="wow-screen-header">
        <div className="wow-screen-header-inner">
          <Link href={PORTAL_HOME_PATH} className="wow-screen-portal-link">
            {PORTAL_NAME}
          </Link>
          <span className="wow-screen-breadcrumb-sep" aria-hidden>
            /
          </span>
          <Link href={WOW_HOME_PATH} className="wow-screen-portal-link">
            WoW
          </Link>
          <span className="wow-screen-breadcrumb-sep" aria-hidden>
            /
          </span>
          <span className="wow-screen-breadcrumb-current">{group.name}</span>
        </div>
      </header>

      <main className="wow-screen-main">
        <div className="wow-screen-title-block">
          <h1 className="wow-screen-title">{group.name}</h1>
          <p className="wow-screen-description">{group.scheduleLabel}</p>
        </div>

        <WowGroupRosterByUser sections={enrichedSections} />
      </main>
    </div>
  );
}
