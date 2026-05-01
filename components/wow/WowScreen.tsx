import {
  PORTAL_HOME_PATH,
  PORTAL_NAME,
  wowGroupDetailPath,
} from "@/lib/site";

import { WowContentGrid } from "./components/WowContentGrid";
import { WowGroupGateModal } from "./components/WowGroupGateModal";
import { WowScreenShell } from "./components/WowScreenShell";
import { WowScreenTitleBlock } from "./components/WowScreenTitleBlock";
import { resolveWowGateGroup } from "./lib/resolveWowGateGroup";

const WOW_SCREEN_DESCRIPTION =
  "Scheduled raid groups and roster counts for each weekly block.";

type WowScreenProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function WowScreen({ searchParams }: WowScreenProps) {
  const sp = (await searchParams) ?? {};
  const gateGroup = resolveWowGateGroup(sp);

  return (
    <WowScreenShell
      breadcrumbItems={[
        { label: PORTAL_NAME, href: PORTAL_HOME_PATH },
        { label: "WoW" },
      ]}
    >
      <WowScreenTitleBlock title="WoW" description={WOW_SCREEN_DESCRIPTION} />

      <WowContentGrid />

      {gateGroup ? (
        <WowGroupGateModal
          groupId={gateGroup.id}
          groupName={gateGroup.name}
          scheduleLabel={gateGroup.scheduleLabel}
          afterSuccessHref={wowGroupDetailPath(gateGroup.id)}
        />
      ) : null}
    </WowScreenShell>
  );
}
