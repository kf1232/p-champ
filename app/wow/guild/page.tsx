import type { Metadata } from "next";

import { GuildPlaceholderScreen } from "@/components/wow/components/guild";
import "@/components/wow/components/guild/styles/guild.css";
import { PORTAL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `Guild · WoW · ${PORTAL_NAME}`,
  },
};

export default function WowGuildPage() {
  return <GuildPlaceholderScreen />;
}
