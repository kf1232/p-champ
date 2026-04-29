import type { Metadata } from "next";

import { PhotographyScreen } from "@/components/photography";
import { PORTAL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `Photography · ${PORTAL_NAME}`,
  },
};

export default function PhotographyPage() {
  return <PhotographyScreen />;
}
