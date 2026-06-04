import {
  isDrivingDistanceUnit,
  isStraightLineDistanceUnit,
  normalizeDistanceUnit,
} from "./distanceUnit";

describe("normalizeDistanceUnit", () => {
  it("maps legacy minutes to driving miles", () => {
    expect(normalizeDistanceUnit("minutes")).toBe("drivingMiles");
  });

  it("keeps straight-line and driving miles", () => {
    expect(normalizeDistanceUnit("miles")).toBe("miles");
    expect(normalizeDistanceUnit("drivingMiles")).toBe("drivingMiles");
  });
});

describe("distance unit helpers", () => {
  it("classifies units", () => {
    expect(isStraightLineDistanceUnit("miles")).toBe(true);
    expect(isDrivingDistanceUnit("drivingMiles")).toBe(true);
    expect(isStraightLineDistanceUnit("drivingMiles")).toBe(false);
  });
});
