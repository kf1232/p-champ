import type { Metadata } from "next";

import { Home } from "@/components/wow/components/home";
import { PORTAL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `WoW · ${PORTAL_NAME}`,
  },
};

export default function WowServicePage() {
  return <Home />;
}
