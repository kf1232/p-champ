import "@/lib/burke/location-finder/store/registerAppStorage";
import "@/lib/scheduler/registerAppStorage";

import { LOCATION_FINDER_GEOCODE_RESPONSES_KEY } from "@/lib/burke";

import { APP_STORAGE_KEYS, appLocalStorage } from "./index";

type MockStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

function createMockLocalStorage(): MockStorage {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => store.clear(),
  };
}

let mockStorage: MockStorage;

function installMockLocalStorage(): void {
  mockStorage = createMockLocalStorage();
  Object.defineProperty(globalThis, "localStorage", {
    value: mockStorage,
    configurable: true,
    writable: true,
  });
}

describe("appLocalStorage", () => {
  beforeEach(() => {
    installMockLocalStorage();
    mockStorage.clear();
  });

  it("exposes envelope storage for wow service", () => {
    const client = appLocalStorage(APP_STORAGE_KEYS.wowService);
    client.write({ foo: "bar" });
    expect(mockStorage.getItem(APP_STORAGE_KEYS.wowService)).toContain("foo");
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
    mockStorage.setItem(
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
    expect(mockStorage.getItem(APP_STORAGE_KEYS.burkeLocationFinder)).toContain(
      '"tool":"burke-location-finder"',
    );
    expect(client.parseRaw(client.getSnapshot()).data).toEqual(payload);
  });

  it("registers Scheduler envelope client", () => {
    const client = appLocalStorage(APP_STORAGE_KEYS.scheduler);
    const payload = { calendarSelectedCalendarId: "primary" };
    client.write(payload);
    expect(mockStorage.getItem(APP_STORAGE_KEYS.scheduler)).toContain(
      '"tool":"scheduler"',
    );
    expect(client.parseRaw(client.getSnapshot()).data).toEqual(payload);
  });

  it("expires wow service payloads past TTL", () => {
    const client = appLocalStorage(APP_STORAGE_KEYS.wowService);
    mockStorage.setItem(
      APP_STORAGE_KEYS.wowService,
      JSON.stringify({
        v: 1,
        storedAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
        data: { stale: true },
      }),
    );
    expect(client.getSnapshot()).toBe("");
    expect(mockStorage.getItem(APP_STORAGE_KEYS.wowService)).toBeNull();
  });
});
