import { AppTileGrid } from "@/components/commons";
import {
  P_CHAMP_DEX_PATH,
  P_CHAMP_TEAM_BUILDER_PATH,
} from "@/lib/site";

/** Dex + Team Builder tiles; remaining cells are inactive placeholders. */
const GRID_LINKS = [
  { href: P_CHAMP_DEX_PATH, label: "Dex", ariaLabel: "Go to Dex" },
  {
    href: P_CHAMP_TEAM_BUILDER_PATH,
    label: "Team Builder",
    ariaLabel: "Go to Team Builder",
  },
];

export function PChampPlaceholderGrid() {
  return (
    <AppTileGrid ariaLabel="P-Champ feature grid" links={GRID_LINKS} />
  );
}
