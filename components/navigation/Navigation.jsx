"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SITE_NAME } from "@/lib/site";

export default function Navigation({ title = SITE_NAME }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isDex = pathname === "/dex";

  return (
    <header className="w-full border-b border-black/10 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-semibold tracking-tight text-black hover:opacity-80"
          aria-label={`${title} (Home)`}
        >
          {title}
        </Link>

        <nav aria-label="Primary navigation" className="flex items-center gap-4">
          <Link
            href="/"
            className={[
              "text-sm font-medium",
              isHome ? "text-black" : "text-black/70 hover:text-black",
            ].join(" ")}
            aria-current={isHome ? "page" : undefined}
          >
            Home
          </Link>
          <Link
            href="/dex"
            className={[
              "text-sm font-medium",
              isDex ? "text-black" : "text-black/70 hover:text-black",
            ].join(" ")}
            aria-current={isDex ? "page" : undefined}
          >
            Dex
          </Link>
        </nav>
      </div>
    </header>
  );
}
