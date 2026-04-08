import Link from "next/link";

type PlaceholderGridProps = {
  count?: number;
};

export function PlaceholderGrid({ count = 9 }: PlaceholderGridProps) {
  return (
    <section aria-label="Feature grid" className="mt-8">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <Link
            key={i}
            href={i === 0 ? "/dex" : "#"}
            aria-label={i === 0 ? "Go to Dex" : `Placeholder ${i + 1}`}
            className={[
              "flex aspect-square items-center justify-center rounded-lg border border-black/10 bg-white/60 text-sm font-medium",
              i === 0
                ? "text-black hover:bg-white/80 hover:border-black/20"
                : "text-black/40 pointer-events-none",
            ].join(" ")}
          >
            {i === 0 ? "Dex" : `Placeholder ${i + 1}`}
          </Link>
        ))}
      </div>
    </section>
  );
}
