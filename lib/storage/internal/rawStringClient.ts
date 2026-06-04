import type { RawStringStorageClient } from "../types";
import { readStorageRaw, removeStorageRaw, writeStorageRaw } from "./access";
import { emitStorageKey, subscribeStorageKey } from "./listeners";

export function createRawStringStorageClient(
  key: string,
): RawStringStorageClient {
  return {
    key,
    subscribe: (listener) => subscribeStorageKey(key, listener),
    read: () => readStorageRaw(key),
    write: (value) => {
      writeStorageRaw(key, value);
      emitStorageKey(key);
    },
    clear: () => {
      removeStorageRaw(key);
      emitStorageKey(key);
    },
  };
}
