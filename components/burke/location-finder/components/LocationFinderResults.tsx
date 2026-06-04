import type { DistanceUnit, ProximityMatch } from "@/lib/burke/location-finder/distance/types";

type LocationFinderResultsProps = {
  unit: DistanceUnit;
  matches: ProximityMatch[];
};

function formatDistance(match: ProximityMatch, unit: DistanceUnit): string {
  if (unit === "minutes") {
    return `${Math.round(match.minutes)} min`;
  }
  return `${match.miles.toFixed(1)} mi`;
}

export function LocationFinderResults({
  unit,
  matches,
}: LocationFinderResultsProps) {
  if (matches.length === 0) {
    return (
      <section className="mt-8 rounded-lg border border-black/10 bg-white/50 px-4 py-3">
        <p className="text-sm text-black/70">No secondary locations in range.</p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-lg border border-black/10 bg-white/50 px-4 py-3">
      <ul className="flex flex-col gap-2">
        {matches.map((match) => (
          <li
            key={match.id}
            className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-black"
          >
            <span>{match.formatted}</span>
            <span className="tabular-nums text-black/55">
              {formatDistance(match, unit)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
