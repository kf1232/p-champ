/**
 * Shared helpers for WoW service localStorage maps (lookup indexes, id fields).
 * Not re-exported from `@/lib/wow` — import only from sibling modules in `storage/`.
 */

/** String-only record values, for lookup-key → Blizzard id maps in stored data. */
export function parseStringRecord(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === "string" && v.length > 0) out[k] = v;
  }
  return out;
}

/**
 * Reads `id` from a Blizzard Game Data JSON object (non-empty string, or finite
 * number coerced to string).
 */
export function extractBlizzardJsonEntityId(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const id = (body as { id?: unknown }).id;
  if (typeof id === "string" && id.length > 0) return id;
  if (typeof id === "number" && Number.isFinite(id)) return String(id);
  return null;
}
