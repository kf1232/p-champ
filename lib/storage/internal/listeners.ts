const listenersByKey = new Map<string, Set<() => void>>();

function getListenerSet(key: string): Set<() => void> {
  let set = listenersByKey.get(key);
  if (!set) {
    set = new Set();
    listenersByKey.set(key, set);
  }
  return set;
}

export function subscribeStorageKey(
  key: string,
  listener: () => void,
): () => void {
  getListenerSet(key).add(listener);
  return () => {
    getListenerSet(key).delete(listener);
  };
}

export function emitStorageKey(key: string): void {
  getListenerSet(key).forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e: StorageEvent) => {
    if (e.key === null) {
      listenersByKey.forEach((set) => {
        set.forEach((listener) => listener());
      });
      return;
    }
    if (e.key && listenersByKey.has(e.key)) {
      emitStorageKey(e.key);
    }
  });
}
