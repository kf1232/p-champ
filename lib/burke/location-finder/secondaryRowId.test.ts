import {
  INITIAL_SECONDARY_ROW_ID,
  nextSecondaryRowId,
} from "./secondaryRowId";

describe("nextSecondaryRowId", () => {
  it("starts after the initial row id", () => {
    expect(nextSecondaryRowId([{ id: INITIAL_SECONDARY_ROW_ID }])).toBe(
      "secondary-row-1",
    );
  });

  it("increments from the highest existing numeric suffix", () => {
    expect(
      nextSecondaryRowId([
        { id: "secondary-row-0" },
        { id: "secondary-row-2" },
      ]),
    ).toBe("secondary-row-3");
  });
});
