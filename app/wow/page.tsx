import type { Metadata } from "next";

import Link from "next/link";

import { PORTAL_HOME_PATH, PORTAL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `WoW · ${PORTAL_NAME}`,
  },
};

export default function WowPage() {
  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-zinc-50 to-white">
      <header className="border-b border-black/10 bg-white/50 px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-2 text-sm">
          <Link
            href={PORTAL_HOME_PATH}
            className="font-medium text-black/60 hover:text-black"
          >
            {PORTAL_NAME}
          </Link>
          <span className="text-black/35" aria-hidden>
            /
          </span>
          <span className="font-medium text-black">WoW</span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-16">
        <h1 className="text-4xl font-semibold tracking-tight text-black">
          Hello world
        </h1>
        <p className="mt-3 text-lg text-black/65">
          WoW service — placeholder page.
        </p>
      </main>
    </div>
  );
}
