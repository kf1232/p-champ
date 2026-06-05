import { AppPageIntro, AppTileGrid } from "@/components/commons";
import {
  BURKE_HOME_PATH,
  P_CHAMP_HOME_PATH,
  PHOTOGRAPHY_HOME_PATH,
  SCHEDULER_HOME_PATH,
  WOW_HOME_PATH,
} from "@/lib/site";

import {
  PORTAL_DESCRIPTION,
  PORTAL_TITLE,
} from "./portalHomeCopy";

const PORTAL_FEATURE_LINKS = [
  { href: P_CHAMP_HOME_PATH, label: "P-Champ" },
  { href: PHOTOGRAPHY_HOME_PATH, label: "Photography" },
  { href: SCHEDULER_HOME_PATH, label: "Scheduler" },
  { href: WOW_HOME_PATH, label: "WoW" },
  { href: BURKE_HOME_PATH, label: "Burke" },
];

export function PortalHomeScreen() {
  return (
    <>
      <AppPageIntro
        title={PORTAL_TITLE}
        description={PORTAL_DESCRIPTION}
        centered
      />

      <AppTileGrid
        ariaLabel="Features"
        links={PORTAL_FEATURE_LINKS}
        sectionClassName="mx-auto mt-0 w-full max-w-3xl"
      />
    </>
  );
}
