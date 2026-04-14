import Link from "next/link";

type PlaceholderGridProps = {
  count?: number;
};

export function PlaceholderGrid({ count = 9 }: PlaceholderGridProps) {
  return (
    <section aria-label="Feature grid" className="mt-8">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: count }).map((_, i) => {
          const isDex = i === 0;
          const isTeamBuilder = i === 1;
          const isActive = isDex || isTeamBuilder;
          const href = isDex ? "/dex" : isTeamBuilder ? "/team-builder" : "#";
          const label = isDex
            ? "Dex"
            : isTeamBuilder
              ? "Team Builder"
              : `Placeholder ${i + 1}`;
          const ariaLabel = isDex
            ? "Go to Dex"
            : isTeamBuilder
              ? "Go to Team Builder"
              : `Placeholder ${i + 1}`;

          return (
            <Link
              key={i}
              href={href}
              aria-label={ariaLabel}
              className={[
                "flex aspect-square items-center justify-center rounded-lg border border-black/10 bg-white/60 text-sm font-medium",
                isActive
                  ? "text-black hover:bg-white/80 hover:border-black/20"
                  : "pointer-events-none text-black/40",
              ].join(" ")}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
