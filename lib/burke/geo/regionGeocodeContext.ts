/**
 * Bulk secondaries are geocoded per line. Short queries (street only) miss the
 * regional context Google applies when you search "A to B".
 */

/** City / state / postal tail from a full formatted address (drops leading street). */
export function parseRegionHintFromFormatted(formatted: string): string | null {
  const parts = formatted
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  if (parts.length < 2) {
    return null;
  }
  const tail = parts.slice(1).join(", ");
  return tail.length >= 3 ? tail : null;
}

/** True when the user query has no comma-separated city/state (street-only). */
export function queryLikelyNeedsRegionContext(query: string): boolean {
  const parts = query
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  return parts.length <= 1;
}

export function withRegionContext(query: string, regionHint: string): string {
  const trimmed = query.trim();
  const hint = regionHint.trim();
  if (!trimmed || !hint) {
    return trimmed;
  }
  return `${trimmed}, ${hint}`;
}
