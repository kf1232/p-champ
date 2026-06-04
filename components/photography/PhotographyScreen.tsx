import { PhotographyContentGrid } from "./PhotographyContentGrid";

const PHOTOGRAPHY_DESCRIPTION = "Shared Lightroom gallery.";

export function PhotographyScreen() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-primary">
          Photography
        </h1>
        <p className="max-w-prose text-secondary">{PHOTOGRAPHY_DESCRIPTION}</p>
      </div>

      <PhotographyContentGrid />
    </>
  );
}
