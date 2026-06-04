import { nextComboboxHighlight } from "./comboboxHighlight";

describe("nextComboboxHighlight", () => {
  it("returns -1 when list is empty", () => {
    expect(nextComboboxHighlight(0, 0, "down")).toBe(-1);
  });

  it("wraps down at end", () => {
    expect(nextComboboxHighlight(2, 3, "down")).toBe(0);
  });

  it("wraps up at start", () => {
    expect(nextComboboxHighlight(0, 3, "up")).toBe(2);
  });
});
