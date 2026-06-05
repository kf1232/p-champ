import { AppPageIntro } from "@/components/commons";

import { BurkePlaceholderGrid } from "./BurkePlaceholderGrid";
import { BURKE_TITLE } from "./configs/burkeHomeCopy";

export function BurkeScreen() {
  return (
    <>
      <AppPageIntro title={BURKE_TITLE} />
      <BurkePlaceholderGrid />
    </>
  );
}
