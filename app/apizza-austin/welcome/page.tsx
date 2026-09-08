import type { Metadata } from "next";

import { ApizzaHero, APIZZA_NAV_WELCOME } from "@/components/apizza";
import { PORTAL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `${APIZZA_NAV_WELCOME} · ${PORTAL_NAME}`,
  },
};

export default function ApizzaWelcomePage() {
  return <ApizzaHero />;
}
