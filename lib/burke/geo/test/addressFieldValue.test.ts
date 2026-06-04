import {
  addressFieldValuesEqual,
  emptyAddressFieldValue,
} from "../addressFieldValue";

describe("addressFieldValuesEqual", () => {
  it("treats matching fields as equal across object instances", () => {
    const a = {
      ...emptyAddressFieldValue(),
      query: "Main St",
      formatted: "Main St",
      placeId: "1",
      lat: 34,
      lon: -81,
    };
    const b = { ...a };
    expect(addressFieldValuesEqual(a, b)).toBe(true);
  });
});
