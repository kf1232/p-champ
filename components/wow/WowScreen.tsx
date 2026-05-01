import Link from "next/link";

import { PORTAL_HOME_PATH, PORTAL_NAME, wowGroupDetailPath } from "@/lib/site";

import { WowContentGrid } from "./WowContentGrid";
import { WowGroupGateModal } from "./WowGroupGateModal";

const WOW_SCREEN_DESCRIPTION =
  "Scheduled raid groups and roster counts for each weekly block.";

export type WowScreenGateGroup = {
  id: string;
  name: string;
  scheduleLabel: string;
};

type WowScreenProps = {
  gateGroup?: WowScreenGateGroup | null;
};

export function WowScreen({ gateGroup = null }: WowScreenProps) {
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
          <span className="wow-screen-breadcrumb-current">WoW</span>
        </div>
      </header>

      <main className="wow-screen-main">
        <div className="wow-screen-title-block">
          <h1 className="wow-screen-title">WoW</h1>
          <p className="wow-screen-description">{WOW_SCREEN_DESCRIPTION}</p>
        </div>

        <WowContentGrid />

        {gateGroup ? (
          <WowGroupGateModal
            groupId={gateGroup.id}
            groupName={gateGroup.name}
            scheduleLabel={gateGroup.scheduleLabel}
            afterSuccessHref={wowGroupDetailPath(gateGroup.id)}
          />
        ) : null}
      </main>
    </div>
  );
}
