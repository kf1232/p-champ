import { applyGeocodeResponseToRow } from "./applyGeocodeToRow";
import {
  parseRegionHintFromFormatted,
  queryLikelyNeedsRegionContext,
  withRegionContext,
} from "./regionGeocodeContext";
import type { GeocodeResponse, GeocodeRowApplyResult } from "./types";

/**
 * Resolve a row using cached geocode, then retry with city/state from the target
 * (mirrors how Google disambiguates "A to B" searches).
 */
export function applyGeocodeWithTargetContext(
  query: string,
  peekLookup: (q: string) => GeocodeResponse | null,
  targetFormatted: string | null,
): GeocodeRowApplyResult {
  const trimmed = query.trim();
  const primary = applyGeocodeResponseToRow(trimmed, peekLookup(trimmed));
  if (primary.status === "success" || !targetFormatted) {
    return primary;
  }

  const regionHint = parseRegionHintFromFormatted(targetFormatted);
  if (!regionHint || !queryLikelyNeedsRegionContext(trimmed)) {
    return primary;
  }

  const contextualQuery = withRegionContext(trimmed, regionHint);
  const contextual = applyGeocodeResponseToRow(
    trimmed,
    peekLookup(contextualQuery),
  );
  if (contextual.status !== "success") {
    return primary;
  }

  return {
    status: "success",
    value: {
      ...contextual.value,
      query: trimmed,
    },
  };
}
