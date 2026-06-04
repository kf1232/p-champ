import "@/lib/burke/location-finder/store/registerAppStorage";

import { LOCATION_FINDER_GEOCODE_RESPONSES_KEY } from "@/lib/burke/location-finder/store/locationFinderCacheKeys";

import { APP_STORAGE_KEYS, appLocalStorage } from "./index";

function installMockLocalStorage(): void {
  const store = new Map<string, string>();
  const mock = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => store.clear(),
  };
  Object.defineProperty(globalThis, "localStorage", {
    value: mock,
    configurable: true,
    writable: true,
  });
}

describe("appLocalStorage", () => {
  beforeEach(() => {
    installMockLocalStorage();
    localStorage.clear();
  });

  it("exposes envelope storage for wow service", () => {
    const client = appLocalStorage(APP_STORAGE_KEYS.wowService);
    client.write({ foo: "bar" });
    expect(localStorage.getItem(APP_STORAGE_KEYS.wowService)).toContain("foo");
    const parsed = client.parseRaw(client.getSnapshot());
    expect(parsed.data).toEqual({ foo: "bar" });
    expect(parsed.storedAt).toEqual(expect.any(Number));
  });

  it("isolates keys via the registry", () => {
    appLocalStorage(APP_STORAGE_KEYS.selectedGame).write("champions");
    appLocalStorage(APP_STORAGE_KEYS.wowDebugRawPanels).write(true);
    expect(appLocalStorage(APP_STORAGE_KEYS.selectedGame).read()).toBe(
      "champions",
    );
    expect(appLocalStorage(APP_STORAGE_KEYS.wowDebugRawPanels).read()).toBe(
      true,
    );
  });

  it("reads wow v1 envelope payloads", () => {
    const storedAt = Date.now();
    localStorage.setItem(
      APP_STORAGE_KEYS.wowService,
      JSON.stringify({
        v: 1,
        storedAt,
        data: { characterProfiles: { "us-test": { id: 1 } } },
      }),
    );
    const client = appLocalStorage(APP_STORAGE_KEYS.wowService);
    const parsed = client.parseRaw(client.getSnapshot());
    expect(parsed.storedAt).toBe(storedAt);
    expect(parsed.data).toEqual({ characterProfiles: { "us-test": { id: 1 } } });
  });

  it("registers Burke Location Finder envelope client", () => {
    const client = appLocalStorage(APP_STORAGE_KEYS.burkeLocationFinder);
    const payload = { [LOCATION_FINDER_GEOCODE_RESPONSES_KEY]: { "test key": {} } };
    client.write(payload);
    expect(localStorage.getItem(APP_STORAGE_KEYS.burkeLocationFinder)).toContain(
      '"tool":"burke-location-finder"',
    );
    expect(client.parseRaw(client.getSnapshot()).data).toEqual(payload);
  });

  it("expires wow service payloads past TTL", () => {
    const client = appLocalStorage(APP_STORAGE_KEYS.wowService);
    localStorage.setItem(
      APP_STORAGE_KEYS.wowService,
      JSON.stringify({
        v: 1,
        storedAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
        data: { stale: true },
      }),
    );
    expect(client.getSnapshot()).toBe("");
    expect(localStorage.getItem(APP_STORAGE_KEYS.wowService)).toBeNull();
  });
});
