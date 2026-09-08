import type { Metadata } from "next";

import { APIZZA_NAV_ORDER, ApizzaOrderScreen } from "@/components/apizza";
import { PORTAL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `${APIZZA_NAV_ORDER} · ${PORTAL_NAME}`,
  },
};

export default function ApizzaOrderPage() {
  return <ApizzaOrderScreen />;
}
