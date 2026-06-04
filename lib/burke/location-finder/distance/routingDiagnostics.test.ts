import {
  buildProximityRoutingDiagnostics,
  hasDrivingRoutingIssues,
  inferLikelyRootCause,
  OFF_ROAD_SNAP_METERS,
} from "./routingDiagnostics";
import type { OsrmLegResult } from "./osrmTable";
import type { ResolvedLocation } from "./types";

const target: ResolvedLocation = {
  id: "target",
  formatted: "Target",
  lat: 43.1,
  lon: -87.9,
};

function dest(id: string, lat: number, lon: number): ResolvedLocation {
  return { id, formatted: id, lat, lon };
}

describe("inferLikelyRootCause", () => {
  it("flags geographic disconnect when most failures are no_road_route with low snap", () => {
    const unrouted = Array.from({ length: 90 }, (_, i) => ({
      id: `d${i}`,
      formatted: `Loc ${i}`,
      lat: 43.2,
      lon: -87.5,
      straightLineMiles: 8,
      failure: {
        code: "no_road_route" as const,
        snapDistanceMeters: 12,
      },
    }));
    const report = inferLikelyRootCause({
      submittedDestinationCount: 96,
      routedCount: 4,
      unrouted,
      failureCounts: { no_road_route: 90 },
      targetSnapDistanceMeters: 8,
    });
    expect(report.code).toBe("geographic_disconnect");
  });

  it("flags target off road when target snap is high", () => {
    const report = inferLikelyRootCause({
      submittedDestinationCount: 10,
      routedCount: 0,
      unrouted: [],
      failureCounts: {},
      targetSnapDistanceMeters: OFF_ROAD_SNAP_METERS + 50,
    });
    expect(report.code).toBe("target_geocode_off_road");
  });
});

describe("buildProximityRoutingDiagnostics", () => {
  it("includes straight-line miles on unrouted rows", () => {
    const destinations = [dest("a", 43.2, -87.5), dest("b", 43.3, -87.4)];
    const legs: OsrmLegResult[] = [
      {
        status: "routed",
        metrics: { miles: 5, minutes: 10, snapDistanceMeters: 4 },
      },
      { status: "unrouted", failure: { code: "no_road_route", snapDistanceMeters: 6 } },
    ];
    const d = buildProximityRoutingDiagnostics(
      target,
      destinations,
      legs,
      3,
    );
    expect(d.routedCount).toBe(1);
    expect(d.unroutedCount).toBe(1);
    expect(d.unrouted[0]?.straightLineMiles).toBeGreaterThan(0);
    expect(d.targetSnapDistanceMeters).toBe(3);
  });
});

describe("hasDrivingRoutingIssues", () => {
  it("is false when every destination routed", () => {
    const destinations = [dest("a", 43.2, -87.5)];
    const legs: OsrmLegResult[] = [
      {
        status: "routed",
        metrics: { miles: 5, minutes: 10, snapDistanceMeters: 4 },
      },
    ];
    const d = buildProximityRoutingDiagnostics(target, destinations, legs);
    expect(hasDrivingRoutingIssues(d)).toBe(false);
  });

  it("is true when any destination is unrouted", () => {
    const destinations = [dest("a", 43.2, -87.5)];
    const legs: OsrmLegResult[] = [
      { status: "unrouted", failure: { code: "no_road_route" } },
    ];
    const d = buildProximityRoutingDiagnostics(target, destinations, legs);
    expect(hasDrivingRoutingIssues(d)).toBe(true);
  });
});
