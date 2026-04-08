import { Navigation } from "@/components/navigation";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

import { PlaceholderGrid } from "./PlaceholderGrid";

export function HomeScreen() {
  return (
    <div className="flex min-h-full flex-col">
      <Navigation />

      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            {SITE_NAME}
          </h1>
          <p className="max-w-prose text-black/70">{SITE_DESCRIPTION}</p>
        </div>

        <PlaceholderGrid />
      </main>
    </div>
  );
}

