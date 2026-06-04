import { parseLocationsCsv } from "./parseLocationsCsv";

describe("parseLocationsCsv", () => {
  it("parses one address per line", () => {
    expect(
      parseLocationsCsv("123 Main St, Springfield, IL\n456 Oak Ave, Chicago, IL"),
    ).toEqual([
      "123 Main St, Springfield, IL",
      "456 Oak Ave, Chicago, IL",
    ]);
  });

  it("skips a single-column header row", () => {
    expect(
      parseLocationsCsv("address\n123 Main St, Springfield, IL"),
    ).toEqual(["123 Main St, Springfield, IL"]);
  });

  it("joins multi-column CSV rows into one address", () => {
    expect(parseLocationsCsv('"123 Main St","Springfield","IL"')).toEqual([
      "123 Main St, Springfield, IL",
    ]);
  });
});
