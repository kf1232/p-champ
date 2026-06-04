import {
  incompleteRowPaddingCellCount,
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
