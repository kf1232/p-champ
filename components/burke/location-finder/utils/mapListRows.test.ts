import { pinIdsForMapTier, resultsListRows } from "./mapListRows";
import type { ProximityMatch } from "@/lib/burke";

const threshold = { value: 25, unit: "miles" as const };

const metrics: ProximityMatch[] = [
  { id: "a", formatted: "A", miles: 5, minutes: 0 },
  { id: "b", formatted: "B", miles: 12, minutes: 0 },
  { id: "c", formatted: "C", miles: 40, minutes: 0 },
];

const matches = metrics.filter((row) => row.miles <= 25);

describe("resultsListRows", () => {
  it("returns in-range matches when no pins are selected", () => {
    expect(resultsListRows(matches, metrics, threshold, new Set())).toEqual(
      matches,
    );
  });

  it("returns only active pins that are visible on the map", () => {
    const active = new Set(["b"]);
    expect(resultsListRows(matches, metrics, threshold, active)).toEqual([
      metrics[1],
    ]);
  });
});

describe("pinIdsForMapTier", () => {
  it("groups visible metrics by marker tier", () => {
    expect(pinIdsForMapTier(metrics, threshold, "green")).toEqual(["a"]);
    expect(pinIdsForMapTier(metrics, threshold, "yellow")).toEqual(["b"]);
    expect(pinIdsForMapTier(metrics, threshold, "black")).toEqual(["c"]);
  });
});
