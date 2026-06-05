import { AppPageIntro } from "@/components/commons";

import { PhotographyContentGrid } from "./PhotographyContentGrid";

const PHOTOGRAPHY_DESCRIPTION = "Shared Lightroom gallery.";

export function PhotographyScreen() {
  return (
    <>
      <AppPageIntro title="Photography" description={PHOTOGRAPHY_DESCRIPTION} />
      <PhotographyContentGrid />
    </>
  );
}
