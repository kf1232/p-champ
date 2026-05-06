import type { WowServiceStoredData } from "./wowServiceLocalStorage";

export const WOW_SERVICE_REALM_SEARCH_KEY = "realmSearch" as const;

export function readCachedRealmBrowsePayload(
  data: WowServiceStoredData,
  region: string,
): unknown | null {
  const r = region.toLowerCase().trim();
  if (!r) return null;
  const raw = data[WOW_SERVICE_REALM_SEARCH_KEY];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const body = (raw as Record<string, unknown>)[r];
  return body ?? null;
}

export function mergeRealmBrowseIntoWowServiceData(
  prev: WowServiceStoredData,
  region: string,
  body: unknown,
): WowServiceStoredData {
  const r = region.toLowerCase().trim();
  if (!r) return prev;
  const raw = prev[WOW_SERVICE_REALM_SEARCH_KEY];
  const map: Record<string, unknown> =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? { ...(raw as Record<string, unknown>) }
      : {};
  map[r] = body;
  return {
    ...prev,
    [WOW_SERVICE_REALM_SEARCH_KEY]: map,
  };
}
