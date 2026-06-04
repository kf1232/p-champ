import {
  dedupeResolvedLocations,
  expandProximityMatches,
  expandProximityRoutingDiagnostics,
} from "./dedupeResolvedLocations";
import type { ProximityRoutingDiagnostics } from "./routingDiagnostics";
import type { ProximityMatch, ResolvedLocation } from "./types";

function loc(
  id: string,
  lat: number,
  lon: number,
  formatted = id,
): ResolvedLocation {
  return { id, formatted, lat, lon };
}

describe("dedupeResolvedLocations", () => {
  it("keeps first row and marks later identical coordinates as duplicates", () => {
    const a = loc("a", 34, -81, "5900 Broad River Road");
    const b = loc("b", 34, -81, "5900 Broad River Road");
    const c = loc("c", 34.1, -81.1, "Other");

    const result = dedupeResolvedLocations([a, b, c]);
    expect(result.unique).toHaveLength(2);
    expect(result.unique.map((r) => r.id)).toEqual(["a", "c"]);
    expect(result.duplicateInputIds).toEqual(["b"]);
    expect(result.canonicalIdByInputId.get("b")).toBe("a");
  });
});

describe("expandProximityMatches", () => {
  it("copies canonical metrics onto duplicate input ids", () => {
    const shared = "5900 Broad River Road";
    const { unique, canonicalIdByInputId } = dedupeResolvedLocations([
      loc("a", 34, -81, shared),
      loc("b", 34, -81, shared),
    ]);
    const canonical: ProximityMatch[] = [
      { id: "a", formatted: shared, miles: 10, minutes: 15 },
    ];
    const expanded = expandProximityMatches(
      canonical,
      [loc("a", 34, -81, shared), loc("b", 34, -81, shared)],
      canonicalIdByInputId,
    );
    expect(expanded).toHaveLength(2);
    expect(expanded[0]?.miles).toBe(10);
    expect(expanded[1]?.id).toBe("b");
    expect(expanded[1]?.miles).toBe(10);
    expect(unique).toHaveLength(1);
  });
});

describe("expandProximityRoutingDiagnostics", () => {
  it("recomputes counts and failure breakdown for duplicate input rows", () => {
    const shared = "5900 Broad River Road";
    const a = loc("a", 34, -81, shared);
    const b = loc("b", 34, -81, shared);
    const { canonicalIdByInputId } = dedupeResolvedLocations([a, b]);

    const canonical: ProximityRoutingDiagnostics = {
      mode: "drivingMiles",
      target: { formatted: "Target", lat: 34, lon: -81 },
      submittedDestinationCount: 1,
      routedCount: 0,
      unroutedCount: 1,
      failureCounts: { no_road_route: 1 },
      unrouted: [
        {
          id: "a",
          formatted: shared,
          lat: 34,
          lon: -81,
          straightLineMiles: 5,
          failure: { code: "no_road_route", snapDistanceMeters: 10 },
        },
      ],
      likelyRootCause: {
        code: "unknown",
        title: "t",
        explanation: "e",
        suggestions: [],
      },
    };

    const expanded = expandProximityRoutingDiagnostics(
      canonical,
      [a, b],
      canonicalIdByInputId,
    );

    expect(expanded.submittedDestinationCount).toBe(2);
    expect(expanded.routedCount).toBe(0);
    expect(expanded.unroutedCount).toBe(2);
    expect(expanded.unrouted).toHaveLength(2);
    expect(expanded.failureCounts.no_road_route).toBe(2);
    expect(expanded.likelyRootCause.code).toBe("geographic_disconnect");
  });
});
