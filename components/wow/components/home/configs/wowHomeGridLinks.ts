import { WOW_CHARACTER_PATH, WOW_GUILD_PATH } from "@/lib/site";

export type WowHomeGridLink = { href: string; label: string; ariaLabel: string };

/** WoW home grid tiles; `null` slots stay inactive placeholders. */
export const WOW_HOME_GRID_LINKS: (WowHomeGridLink | null)[] = [
  {
    href: WOW_CHARACTER_PATH,
    label: "Character",
    ariaLabel: "Go to Character tools",
  },
  {
    href: WOW_GUILD_PATH,
    label: "Guild",
    ariaLabel: "Go to Guild tools",
  },
];
