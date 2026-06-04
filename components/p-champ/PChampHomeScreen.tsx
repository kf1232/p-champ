import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

import { PChampPlaceholderGrid } from "./PChampPlaceholderGrid";

/** P-Champ landing at `/p-champ` — not the site portal (`/`). */
export function PChampHomeScreen() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-primary">
          {SITE_NAME}
        </h1>
        <p className="max-w-prose text-secondary">{SITE_DESCRIPTION}</p>
      </div>

      <PChampPlaceholderGrid />
    </>
  );
}
