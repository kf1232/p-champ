import type { Metadata } from "next";

import { WowServiceHomeContent } from "@/components/wow/WowServiceHomeContent";
import { PORTAL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `WoW · ${PORTAL_NAME}`,
  },
};

export default function WowServicePage() {
  return <WowServiceHomeContent />;
}
