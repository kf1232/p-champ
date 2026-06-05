"use client";

import { BurkeNav } from "@/components/burke/BurkeNavHeader";
import Navigation from "@/components/p-champ/Navigation";
import { PhotographyNav } from "@/components/photography/PhotographyNavHeader";
import { PortalNav } from "@/components/portal/PortalNav";
import { SchedulerNav } from "@/components/scheduler/SchedulerNav";
import { WowNav } from "@/components/wow/components/chrome/WowNavHeader";
import type { AppHeaderVariant } from "@/lib/appChrome";

/** Route-default inner header content (no chrome shell — `AppViewportHeader` owns that). */
export function renderDefaultAppHeaderContent(
  variant: AppHeaderVariant,
  wide: boolean,
) {
  switch (variant) {
    case "portal":
      return <PortalNav />;
    case "pChamp":
      return <Navigation wide={wide} />;
    case "burke":
      return <BurkeNav />;
    case "photography":
      return <PhotographyNav />;
    case "scheduler":
      return <SchedulerNav />;
    case "wow":
      return <WowNav />;
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}
