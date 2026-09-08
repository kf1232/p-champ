import type { Metadata } from "next";

import { ApizzaAbout, APIZZA_ABOUT_HEADING } from "@/components/apizza";
import { PORTAL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `${APIZZA_ABOUT_HEADING} · ${PORTAL_NAME}`,
  },
};

export default function ApizzaAboutPage() {
  return <ApizzaAbout />;
}
