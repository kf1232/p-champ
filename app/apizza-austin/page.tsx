import type { Metadata } from "next";

import { APIZZA_TITLE, ApizzaScreen } from "@/components/apizza";
import { PORTAL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `${APIZZA_TITLE} · ${PORTAL_NAME}`,
  },
};

export default function ApizzaPage() {
  return <ApizzaScreen />;
}
