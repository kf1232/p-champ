import { makeProximityCacheKey } from "./locationFinderProximityCache";

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
    const threshold = { value: 30, unit: "minutes" as const };

    expect(
      makeProximityCacheKey(target, [a, b], threshold),
    ).toBe(makeProximityCacheKey(target, [b, a], threshold));
  });
});
