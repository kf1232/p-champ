/**
 * Parses JSON env values shaped as `{ [albumId]: string }` (non-empty keys and values).
 * Keys must match `PhotographyAlbumEntry.id` in `photographyAlbumEntries.ts`.
 */
export function parseGalleryKeyedEnvJson(
  raw: string | undefined,
): Map<string, string> | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return null;
    }
    const map = new Map<string, string>();
    for (const [k, v] of Object.entries(parsed)) {
      if (
        typeof k === "string" &&
        k.length > 0 &&
        typeof v === "string" &&
        v.length > 0
      ) {
        map.set(k, v);
      }
    }
    return map.size > 0 ? map : null;
  } catch {
    return null;
  }
}

/** Ensures the URL is suitable for redirect (http/https only). */
export function normalizeShareUrlForRedirect(raw: string): string | null {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    return u.href;
  } catch {
    return null;
  }
}
