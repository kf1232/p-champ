import type { ProximityRoutingDiagnostics } from "../distance/routingDiagnostics";

import {
  findStoredProximityDrivingDiagnostics,
  findStoredProximityMetrics,
  makeProximityCacheKey,
  mergeProximityMatchesIntoLocationFinderData,
} from "./locationFinderProximityCache";

describe("makeProximityCacheKey", () => {
  it("is stable for the same inputs regardless of destination order", () => {
    const target = {
      id: "target",
      formatted: "Target St",
      lat: 34,
      lon: -81,
    };
    const a = {
      id: "a",
      formatted: "A St",
      lat: 34.1,
      lon: -81.1,
    };
    const b = {
      id: "b",
      formatted: "B St",
      lat: 34.2,
      lon: -81.2,
    };
    const threshold = { value: 30, unit: "drivingMiles" as const };

    expect(
      makeProximityCacheKey(target, [a, b], threshold),
    ).toBe(makeProximityCacheKey(target, [b, a], threshold));
  });
});

describe("driving diagnostics cache", () => {
  const target = {
    id: "target",
    formatted: "Target St",
    lat: 34,
    lon: -81,
  };
  const dest = {
    id: "a",
    formatted: "A St",
    lat: 34.1,
    lon: -81.1,
  };
  const threshold = { value: 30, unit: "drivingMiles" as const };
  const metrics = [{ id: "a", formatted: "A St", miles: 5, minutes: 10 }];
  const diagnostics: ProximityRoutingDiagnostics = {
    mode: "drivingMiles",
    target: { formatted: target.formatted, lat: target.lat, lon: target.lon },
    submittedDestinationCount: 1,
    routedCount: 0,
    unroutedCount: 1,
    failureCounts: { no_road_route: 1 },
    unrouted: [
      {
        id: "a",
        formatted: "A St",
        lat: 34.1,
        lon: -81.1,
        straightLineMiles: 8,
        failure: { code: "no_road_route" },
      },
    ],
    likelyRootCause: {
      code: "geographic_disconnect",
      title: "Mostly geographic disconnect",
      explanation: "e",
      suggestions: [],
    },
  };

  it("round-trips diagnostics with metrics", () => {
    const data = mergeProximityMatchesIntoLocationFinderData(
      {},
      target,
      [dest],
      threshold,
      [],
      metrics,
      diagnostics,
    );
    expect(findStoredProximityMetrics(data, target, [dest], threshold)).toEqual(
      metrics,
    );
    expect(
      findStoredProximityDrivingDiagnostics(data, target, [dest], threshold),
    ).toEqual(diagnostics);
  });

  it("returns undefined for metrics without paired diagnostics (legacy cache)", () => {
    const data = mergeProximityMatchesIntoLocationFinderData(
      {},
      target,
      [dest],
      threshold,
      [],
      metrics,
    );
    expect(findStoredProximityMetrics(data, target, [dest], threshold)).toEqual(
      metrics,
    );
    expect(
      findStoredProximityDrivingDiagnostics(data, target, [dest], threshold),
    ).toBeUndefined();
  });
});
