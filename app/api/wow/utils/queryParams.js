/**
 * Read a single query value, trimmed; treat missing or blank as absent.
 *
 * **Happy path**
 * - Key present with a non-empty value after trim → returns that string (leading/trailing
 *   whitespace removed, inner spaces kept).
 *
 * **Edge cases (all return `null`)**
 * - Key missing from `searchParams` (`URLSearchParams#get` is `null`).
 * - Value is empty (`?key=`) or only whitespace (`?key=   `), including encoded space/tab.
 * - Any value that trims to zero length.
 *
 * **Notes**
 * - Uses `String(raw)` so unexpected non-string values from callers still behave predictably.
 * - Does not validate semantics (e.g. region codes); callers own that.
 *
 * @param {URLSearchParams} searchParams
 * @param {string} key
 * @returns {string | null}
 */
export function getTrimmedQueryParam(searchParams, key) {
  const raw = searchParams.get(key);
  if (raw == null) {
    return null;
  }
  const trimmed = String(raw).trim();
  return trimmed.length > 0 ? trimmed : null;
}
