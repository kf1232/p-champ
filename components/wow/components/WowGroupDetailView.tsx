import type { WowCharacterForDisplay } from "@/lib/wow/battleNetCharacterProfile";
import {
  PORTAL_HOME_PATH,
  PORTAL_NAME,
  WOW_HOME_PATH,
} from "@/lib/site";

import type { WowGroupEntry, WowUserEntry } from "../config/wowRosterConfig";
import { WowGroupRosterByUser } from "./WowGroupRosterByUser";
import { WowScreenShell } from "./WowScreenShell";
import { WowScreenTitleBlock } from "./WowScreenTitleBlock";

type WowGroupDetailViewProps = {
  group: Pick<WowGroupEntry, "name" | "scheduleLabel">;
  sections: readonly {
    user: WowUserEntry;
    characters: readonly WowCharacterForDisplay[];
  }[];
};

export function WowGroupDetailView({
  group,
  sections,
}: WowGroupDetailViewProps) {
  return (
    <WowScreenShell
      breadcrumbItems={[
        { label: PORTAL_NAME, href: PORTAL_HOME_PATH },
        { label: "WoW", href: WOW_HOME_PATH },
        { label: group.name },
      ]}
    >
      <WowScreenTitleBlock
        title={group.name}
        description={group.scheduleLabel}
      />
      <WowGroupRosterByUser sections={sections} />
    </WowScreenShell>
  );
}
