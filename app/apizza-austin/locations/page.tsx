import type { Metadata } from "next";

import { APIZZA_NAV_LOCATIONS, ApizzaLocationsScreen } from "@/components/apizza";
import { PORTAL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `${APIZZA_NAV_LOCATIONS} · ${PORTAL_NAME}`,
  },
};

export default function ApizzaLocationsPage() {
  return <ApizzaLocationsScreen />;
}
