import type { RawFlagStorageClient } from "../types";
import { readStorageRaw, removeStorageRaw, writeStorageRaw } from "./access";
import { emitStorageKey, subscribeStorageKey } from "./listeners";

const ENABLED_VALUE = "1";

export function createRawFlagStorageClient(key: string): RawFlagStorageClient {
  return {
    key,
    subscribe: (listener) => subscribeStorageKey(key, listener),
    read: () => readStorageRaw(key) === ENABLED_VALUE,
    write: (enabled) => {
      if (enabled) {
        writeStorageRaw(key, ENABLED_VALUE);
      } else {
        removeStorageRaw(key);
      }
      emitStorageKey(key);
    },
    clear: () => {
      removeStorageRaw(key);
      emitStorageKey(key);
    },
  };
}
