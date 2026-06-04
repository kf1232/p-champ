import {
  isWithinMapDisplayCap,
  markerTierForDistance,
  markerTierFromProximityPercent,
  markerTierLegendLabel,
  MAP_MAX_PROXIMITY_PERCENT,
  proximityPercent,
} from "./proximityMarkerTier";

describe("proximityPercent", () => {
  it("expresses distance as a percent of threshold", () => {
    expect(proximityPercent(1, 5)).toBe(20);
    expect(proximityPercent(6, 5)).toBe(120);
  });
});

describe("markerTierFromProximityPercent", () => {
  it("maps bands to marker colors", () => {
    expect(markerTierFromProximityPercent(20)).toBe("green");
    expect(markerTierFromProximityPercent(24.9)).toBe("green");
    expect(markerTierFromProximityPercent(25)).toBe("yellow");
    expect(markerTierFromProximityPercent(49)).toBe("yellow");
    expect(markerTierFromProximityPercent(50)).toBe("orange");
    expect(markerTierFromProximityPercent(74)).toBe("orange");
    expect(markerTierFromProximityPercent(75)).toBe("red");
    expect(markerTierFromProximityPercent(99)).toBe("red");
    expect(markerTierFromProximityPercent(100)).toBe("black");
    expect(markerTierFromProximityPercent(120)).toBe("black");
  });
});

describe("markerTierLegendLabel", () => {
  it("formats upper band as ≤ N%", () => {
    expect(markerTierLegendLabel("green")).toBe("≤ 25%");
    expect(markerTierLegendLabel("yellow")).toBe("≤ 50%");
    expect(markerTierLegendLabel("orange")).toBe("≤ 75%");
    expect(markerTierLegendLabel("red")).toBe("≤ 100%");
    expect(markerTierLegendLabel("black")).toBe("≤ 200%");
  });
});

describe("markerTierForDistance", () => {
  it("matches user examples", () => {
    expect(markerTierForDistance(1, 5)).toBe("green");
    expect(markerTierForDistance(6, 5)).toBe("black");
  });
});

describe("isWithinMapDisplayCap", () => {
  it(`shows POIs up to ${MAP_MAX_PROXIMITY_PERCENT}% of threshold`, () => {
    expect(isWithinMapDisplayCap(49, 25)).toBe(true);
    expect(isWithinMapDisplayCap(50, 25)).toBe(true);
    expect(isWithinMapDisplayCap(50.1, 25)).toBe(false);
    expect(isWithinMapDisplayCap(51, 25)).toBe(false);
  });
});
