import type { Metadata } from "next";

import { Guild } from "@/components/wow/components/guild";
import { PORTAL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `Guild · WoW · ${PORTAL_NAME}`,
  },
};

export default function WowGuildPage() {
  return <Guild />;
}
