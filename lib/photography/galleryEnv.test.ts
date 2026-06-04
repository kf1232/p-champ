import {
  normalizeShareUrlForRedirect,
  parseGalleryKeyedEnvJson,
} from "./galleryEnv";

describe("parseGalleryKeyedEnvJson", () => {
  it("parses valid keyed JSON", () => {
    const map = parseGalleryKeyedEnvJson(
      JSON.stringify({ album1: "secret", album2: "other" }),
    );
    expect(map?.get("album1")).toBe("secret");
    expect(map?.get("album2")).toBe("other");
  });

  it("returns null for empty or invalid JSON", () => {
    expect(parseGalleryKeyedEnvJson(undefined)).toBeNull();
    expect(parseGalleryKeyedEnvJson("")).toBeNull();
    expect(parseGalleryKeyedEnvJson("not json")).toBeNull();
    expect(parseGalleryKeyedEnvJson(JSON.stringify([]))).toBeNull();
  });

  it("ignores entries with empty keys or values", () => {
    const map = parseGalleryKeyedEnvJson(
      JSON.stringify({ "": "x", ok: "", bad: 1 }),
    );
    expect(map).toBeNull();
  });
});

describe("normalizeShareUrlForRedirect", () => {
  it("allows http and https URLs", () => {
    expect(normalizeShareUrlForRedirect("https://example.com/path")).toBe(
      "https://example.com/path",
    );
    expect(normalizeShareUrlForRedirect("http://example.com")).toBe(
      "http://example.com/",
    );
  });

  it("rejects non-http schemes and invalid URLs", () => {
    expect(normalizeShareUrlForRedirect("javascript:alert(1)")).toBeNull();
    expect(normalizeShareUrlForRedirect("not-a-url")).toBeNull();
  });
});
