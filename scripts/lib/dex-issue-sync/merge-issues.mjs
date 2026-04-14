/**
 * Merge two `gh issue list --json` result arrays by issue number (dedupe).
 * When the same issue appears in both lists (label query + body search), labels are merged.
 */

/** @param {unknown} labels */
function normalizeLabels(labels) {
  if (!Array.isArray(labels)) return [];
  const byName = new Map();
  for (const L of labels) {
    if (L && typeof L === "object" && L.name) byName.set(L.name, L);
  }
  return [...byName.values()];
}

/**
 * @param {Array<{ number: number; title?: string; body?: string; labels?: unknown[] }>} a
 * @param {Array<{ number: number; title?: string; body?: string; labels?: unknown[] }>} b
 */
export function mergeIssuesByNumber(a, b) {
  const byNum = new Map();
  for (const issue of [...a, ...b]) {
    const n = issue.number;
    const prev = byNum.get(n);
    if (!prev) {
      byNum.set(n, {
        ...issue,
        labels: normalizeLabels(issue.labels),
      });
      continue;
    }
    const next = { ...prev, ...issue };
    next.labels = normalizeLabels([...prev.labels, ...normalizeLabels(issue.labels)]);
    const pb = prev.body ?? "";
    const nb = issue.body ?? "";
    next.body = nb.length >= pb.length ? nb : pb;
    byNum.set(n, next);
  }
  return [...byNum.values()];
}
