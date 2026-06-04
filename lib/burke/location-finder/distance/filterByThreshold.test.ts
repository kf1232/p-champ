import { filterByMilesThreshold } from "./filterByThreshold";
import type { ResolvedLocation } from "./types";

const target: ResolvedLocation = {
  id: "target",
  formatted: "Target",
  lat: 40.7128,
  lon: -74.006,
};

describe("filterByMilesThreshold", () => {
  it("returns destinations within the mile threshold", () => {
    const near: ResolvedLocation = {
      id: "near",
      formatted: "Near",
      lat: 40.8,
      lon: -74.0,
    };
    const far: ResolvedLocation = {
      id: "far",
      formatted: "Far",
      lat: 34.05,
      lon: -118.25,
    };

    const matches = filterByMilesThreshold(target, [near, far], 50);
    expect(matches.map((m) => m.id)).toEqual(["near"]);
  });
});
