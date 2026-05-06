/**
 * Blizzard guild URL name segment: trim, lowercase, spaces → hyphens.
 * Shared by API routes and client-side cache key matching.
 *
 * @param {unknown} raw
 * @returns {string}
 */
export function normalizeGuildNameSlugForApi(raw) {
  return String(raw ?? "").trim().toLowerCase().replace(/ +/g, "-");
}
