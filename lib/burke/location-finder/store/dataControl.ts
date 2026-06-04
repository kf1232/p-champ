/**
 * Location Finder data control: the only way UI/API code should read or write
 * this tool's persisted cache. Uses {@link appLocalStorage} under the hood.
 */

import "./registerAppStorage";

import {
  APP_STORAGE_KEYS,
  appLocalStorage,
  type EnvelopeStorageClient,
} from "@/lib/storage";

import { formatLocationFinderCacheExport } from "./locationFinderScopedData";
import type {
  LocationFinderStoredData,
  LocationFinderStorageParse,
} from "./types";

export type { LocationFinderStoredData, LocationFinderStorageParse };

export const LOCATION_FINDER_LOCAL_STORAGE_KEY =
  APP_STORAGE_KEYS.burkeLocationFinder;

const client: EnvelopeStorageClient = appLocalStorage(
  APP_STORAGE_KEYS.burkeLocationFinder,
);

/** Low-level envelope client; prefer the named helpers below in UI code. */
export const locationFinderDataControl = {
  key: client.key,
  subscribe: client.subscribe,
  getSnapshot: client.getSnapshot,
  getServerSnapshot: client.getServerSnapshot,
  parseRaw: client.parseRaw,
  write: client.write,
  clear: client.clear,
};

export const subscribeLocationFinderStorage =
  locationFinderDataControl.subscribe;

export function getLocationFinderStorageSnapshot(): string {
  return locationFinderDataControl.getSnapshot();
}

export function getLocationFinderStorageServerSnapshot(): string {
  return locationFinderDataControl.getServerSnapshot();
}

export function parseLocationFinderStorageRaw(
  raw: string,
): LocationFinderStorageParse {
  return locationFinderDataControl.parseRaw(raw);
}

export function writeLocationFinderStoredData(
  data: LocationFinderStoredData,
): void {
  locationFinderDataControl.write(data);
}

export function clearLocationFinderStoredData(): void {
  locationFinderDataControl.clear();
}

export function exportLocationFinderCacheDownloadBody(): string {
  const raw = getLocationFinderStorageSnapshot();
  const parsed = parseLocationFinderStorageRaw(raw);
  return formatLocationFinderCacheExport(
    parsed.storedAt,
    parsed.data,
    LOCATION_FINDER_LOCAL_STORAGE_KEY,
  );
}
