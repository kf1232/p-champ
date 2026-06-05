import { AppPageIntro } from "@/components/commons";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

import { PChampPlaceholderGrid } from "./PChampPlaceholderGrid";

/** P-Champ landing at `/p-champ` — not the site portal (`/`). */
export function PChampHomeScreen() {
  return (
    <>
      <AppPageIntro title={SITE_NAME} description={SITE_DESCRIPTION} />
      <PChampPlaceholderGrid />
    </>
  );
}
