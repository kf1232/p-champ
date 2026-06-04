import {
  reconcileColorSchemeFromDocument,
  resolveColorScheme,
} from "./colorScheme";
import {
  readColorSchemeCookieValue,
  resolveColorSchemeFromCookieHeader,
} from "./colorSchemeCookie";

describe("resolveColorScheme", () => {
  it("defaults to light", () => {
    expect(resolveColorScheme(null)).toBe("light");
    expect(resolveColorScheme("")).toBe("light");
    expect(resolveColorScheme("system")).toBe("light");
  });

  it("accepts light and dark", () => {
    expect(resolveColorScheme("light")).toBe("light");
    expect(resolveColorScheme("dark")).toBe("dark");
  });
});

describe("reconcileColorSchemeFromDocument", () => {
  const originalDocument = global.document;

  afterEach(() => {
    Object.defineProperty(global, "document", {
      value: originalDocument,
      configurable: true,
    });
  });

  it("syncs storage and cookie to the document attribute when they drift", () => {
    const writes: string[] = [];
    let stored: string | null = "light";
    let cookie = "p-champ-color-scheme=light";

    Object.defineProperty(global, "document", {
      value: {
        documentElement: {
          getAttribute: () => "dark",
          setAttribute: jest.fn(),
        },
        cookie,
      },
      configurable: true,
    });

    Object.defineProperty(global.document, "cookie", {
      get: () => cookie,
      set: (value: string) => {
        cookie = value;
      },
      configurable: true,
    });

    reconcileColorSchemeFromDocument(
      () => stored,
      (value) => {
        stored = value;
        writes.push(value);
      },
    );

    expect(stored).toBe("dark");
    expect(writes).toEqual(["dark"]);
    expect(cookie).toContain("p-champ-color-scheme=dark");
  });

  it("no-ops when storage and cookie already match the document", () => {
    let stored: string | null = "light";
    const cookie = "p-champ-color-scheme=light";

    Object.defineProperty(global, "document", {
      value: {
        documentElement: {
          getAttribute: () => "light",
          setAttribute: jest.fn(),
        },
        cookie,
      },
      configurable: true,
    });

    reconcileColorSchemeFromDocument(
      () => stored,
      (value) => {
        stored = value;
      },
    );

    expect(stored).toBe("light");
  });
});

describe("colorSchemeCookie", () => {
  it("reads scheme from cookie header", () => {
    expect(readColorSchemeCookieValue("p-champ-color-scheme=dark")).toBe("dark");
    expect(
      readColorSchemeCookieValue("other=1; p-champ-color-scheme=light; x=2"),
    ).toBe("light");
  });

  it("resolves cookie header to color scheme", () => {
    expect(resolveColorSchemeFromCookieHeader(undefined)).toBe("light");
    expect(resolveColorSchemeFromCookieHeader("p-champ-color-scheme=dark")).toBe(
      "dark",
    );
  });
});
