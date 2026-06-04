import {
  emptyProximityResultsSnapshot,
  getSnapshotForUnit,
  isSnapshotVisible,
} from "./proximityResultsByMode";

describe("isSnapshotVisible", () => {
  it("requires matching inputs snapshot and metrics or diagnostics", () => {
    const snapshot = {
      ...emptyProximityResultsSnapshot(),
      inputsSnapshot: "a",
      metrics: [{ id: "1", formatted: "X", miles: 1, minutes: 0 }],
      matches: [],
    };
    expect(isSnapshotVisible(snapshot, "a")).toBe(true);
    expect(isSnapshotVisible(snapshot, "b")).toBe(false);
    expect(
      isSnapshotVisible(
        { ...snapshot, inputsSnapshot: null },
        "a",
      ),
    ).toBe(false);
    expect(
      isSnapshotVisible(
        {
          ...snapshot,
          metrics: [],
          routingDiagnostics: {
            mode: "drivingMiles",
            target: { formatted: "T", lat: 0, lon: 0 },
            submittedDestinationCount: 1,
            routedCount: 0,
            unroutedCount: 1,
            failureCounts: { no_road_route: 1 },
            unrouted: [],
            likelyRootCause: {
              code: "geographic_disconnect",
              title: "t",
              explanation: "e",
              suggestions: [],
            },
          },
        },
        "a",
      ),
    ).toBe(true);
    expect(
      isSnapshotVisible(
        { ...snapshot, metrics: null, routingDiagnostics: null },
        "a",
      ),
    ).toBe(false);
  });
});

describe("getSnapshotForUnit", () => {
  it("returns straight-line bucket for miles", () => {
    const byMode = {
      straightLine: {
        ...emptyProximityResultsSnapshot(),
        matches: [{ id: "s", formatted: "S", miles: 1, minutes: 0 }],
      },
      driving: emptyProximityResultsSnapshot(),
    };
    expect(getSnapshotForUnit(byMode, "miles").matches?.[0]?.id).toBe("s");
    expect(getSnapshotForUnit(byMode, "drivingMiles").matches).toBeNull();
  });
});
