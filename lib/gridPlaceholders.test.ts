import {
  incompleteRowPaddingCellCount,
  tileGridTotalCellCount,
  trailingPlaceholderCellCount,
} from "./gridPlaceholders";

describe("incompleteRowPaddingCellCount", () => {
  it("pads a partial last row in a 3-column grid", () => {
    expect(incompleteRowPaddingCellCount(4, 3)).toBe(2);
  });

  it("returns 0 when the last row is full", () => {
    expect(incompleteRowPaddingCellCount(3, 3)).toBe(0);
  });
});

describe("trailingPlaceholderCellCount", () => {
  it("still appends a full trailing row for photography-style grids", () => {
    expect(trailingPlaceholderCellCount(4, 3)).toBe(5);
  });
});

describe("tileGridTotalCellCount", () => {
  it("pads a partial first row for two filled tiles (P-Champ / WoW)", () => {
    expect(tileGridTotalCellCount(2)).toBe(3);
  });

  it("pads a partial first row for one filled tile (Burke)", () => {
    expect(tileGridTotalCellCount(1)).toBe(3);
  });

  it("pads the last row for four filled tiles without an extra row below (portal)", () => {
    expect(tileGridTotalCellCount(4)).toBe(6);
  });

  it("uses exactly one row when filled tiles complete the row", () => {
    expect(tileGridTotalCellCount(3)).toBe(3);
  });
});
