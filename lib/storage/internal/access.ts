function browserLocalStorage(): Storage | null {
  if (typeof globalThis === "undefined") {
    return null;
  }
  const ls = (globalThis as { localStorage?: Storage }).localStorage;
  if (!ls || typeof ls.getItem !== "function") {
    return null;
  }
  return ls;
}

export function readStorageRaw(key: string): string | null {
  const ls = browserLocalStorage();
  if (!ls) {
    return null;
  }
  try {
    return ls.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorageRaw(key: string, value: string): void {
  const ls = browserLocalStorage();
  if (!ls) {
    return;
  }
  try {
    ls.setItem(key, value);
  } catch {
    /* ignore quota / private mode */
  }
}

export function removeStorageRaw(key: string): void {
  const ls = browserLocalStorage();
  if (!ls) {
    return;
  }
  try {
    ls.removeItem(key);
  } catch {
    /* ignore */
  }
}
