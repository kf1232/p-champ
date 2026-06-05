/**
 * Scheduler data control: the only way UI code should read or write this tool's
 * persisted cache. Uses {@link appLocalStorage} under the hood.
 */

import "./registerAppStorage";

import {
  APP_STORAGE_KEYS,
  appLocalStorage,
  type EnvelopeStorageClient,
} from "@/lib/storage";

import { formatSchedulerCacheExport } from "./schedulerScopedData";
import type { SchedulerStoredData, SchedulerStorageParse } from "./types";

export type { SchedulerStoredData, SchedulerStorageParse };

export const SCHEDULER_LOCAL_STORAGE_KEY = APP_STORAGE_KEYS.scheduler;

const client: EnvelopeStorageClient = appLocalStorage(APP_STORAGE_KEYS.scheduler);

export const schedulerDataControl = {
  key: client.key,
  subscribe: client.subscribe,
  getSnapshot: client.getSnapshot,
  getServerSnapshot: client.getServerSnapshot,
  parseRaw: client.parseRaw,
  write: client.write,
  clear: client.clear,
};

export const subscribeSchedulerStorage = schedulerDataControl.subscribe;

export function getSchedulerStorageSnapshot(): string {
  return schedulerDataControl.getSnapshot();
}

export function getSchedulerStorageServerSnapshot(): string {
  return schedulerDataControl.getServerSnapshot();
}

export function parseSchedulerStorageRaw(raw: string): SchedulerStorageParse {
  return schedulerDataControl.parseRaw(raw);
}

export function writeSchedulerStoredData(data: SchedulerStoredData): void {
  schedulerDataControl.write(data);
}

export function clearSchedulerStoredData(): void {
  schedulerDataControl.clear();
}

export function exportSchedulerCacheDownloadBody(): string {
  const raw = getSchedulerStorageSnapshot();
  const parsed = parseSchedulerStorageRaw(raw);
  return formatSchedulerCacheExport(
    parsed.storedAt,
    parsed.data,
    SCHEDULER_LOCAL_STORAGE_KEY,
  );
}
