import type { Metadata } from "next";

import { CharacterPlaceholderScreen } from "@/components/wow/components/character";
import "@/components/wow/components/character/styles/character.css";
import { PORTAL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `Character · WoW · ${PORTAL_NAME}`,
  },
};

export default function WowCharacterPage() {
  return <CharacterPlaceholderScreen />;
}
