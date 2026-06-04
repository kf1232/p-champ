import type { Metadata } from "next";

import { BurkeScreen } from "@/components/burke";
import { PORTAL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `Burke · ${PORTAL_NAME}`,
  },
};

export default function BurkePage() {
  return <BurkeScreen />;
}
