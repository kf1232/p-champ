/**
 * @jest-environment node
 */
import { getTrimmedQueryParam } from "../queryParams.js";

describe("getTrimmedQueryParam", () => {
  describe("happy path", () => {
    it("returns a simple value unchanged when already trimmed", () => {
      expect(
        getTrimmedQueryParam(new URLSearchParams("region=us"), "region"),
      ).toBe("us");
    });

    it("strips leading and trailing ASCII whitespace but keeps inner spaces", () => {
      expect(
        getTrimmedQueryParam(
          new URLSearchParams("q=  inner%20spaces  "),
          "q",
        ),
      ).toBe("inner spaces");
    });

    it("keeps literal zero and the word false as non-empty strings", () => {
      expect(getTrimmedQueryParam(new URLSearchParams("n=0"), "n")).toBe("0");
      expect(
        getTrimmedQueryParam(new URLSearchParams("n=false"), "n"),
      ).toBe("false");
    });

    it("returns the first value when the key appears more than once", () => {
      const sp = new URLSearchParams("q=first&q=second&q=third");
      expect(getTrimmedQueryParam(sp, "q")).toBe("first");
    });

    it("decodes percent-encoding before trim (encoded inner space)", () => {
      expect(
        getTrimmedQueryParam(new URLSearchParams("q=a%20b"), "q"),
      ).toBe("a b");
    });
  });

  describe("failures (returns null)", () => {
    it("returns null when the key is absent", () => {
      expect(getTrimmedQueryParam(new URLSearchParams(), "q")).toBeNull();
      expect(
        getTrimmedQueryParam(new URLSearchParams("other=1"), "q"),
      ).toBeNull();
    });

    it("returns null for empty or whitespace-only values", () => {
      expect(getTrimmedQueryParam(new URLSearchParams("q="), "q")).toBeNull();
      expect(
        getTrimmedQueryParam(new URLSearchParams("q=   "), "q"),
      ).toBeNull();
      expect(
        getTrimmedQueryParam(new URLSearchParams("q=%20%09"), "q"),
      ).toBeNull();
      expect(
        getTrimmedQueryParam(new URLSearchParams("q=%0A%0D"), "q"),
      ).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("treats key lookup as case-sensitive (no match for wrong casing)", () => {
      expect(
        getTrimmedQueryParam(new URLSearchParams("Region=us"), "region"),
      ).toBeNull();
    });

    it("decodes + as space in query strings (URLSearchParams rules), then trims", () => {
      expect(
        getTrimmedQueryParam(new URLSearchParams("q=+hello+"), "q"),
      ).toBe("hello");
    });
  });
});
