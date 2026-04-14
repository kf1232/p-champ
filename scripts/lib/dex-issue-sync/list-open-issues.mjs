/**
 * Load open issues for dex sync scripts using:
 * 1) REST `/repos/{owner}/{repo}/issues` — paginated (not subject to `issue list` quirks)
 * 2) `gh issue list --search` — body marker text
 * 3) `gh search issues` — title prefix (catches issues missing the category label)
 */

import { gh, ghR } from "./gh-repo.mjs";
import { mergeIssuesByNumber } from "./merge-issues.mjs";

/** @param {Record<string, unknown>} i */
function normalizeRestIssue(i) {
  return {
    number: i.number,
    title: i.title ?? "",
    body: i.body ?? "",
    labels: (i.labels ?? []).map((l) =>
      typeof l === "string" ? { name: l } : { name: l.name },
    ),
  };
}

/**
 * Paginated open issues with a single label (REST; filters out PRs).
 * @param {string} cwd
 * @param {string} repoSlug `owner/name`
 * @param {string} label
 */
export function listOpenIssuesWithLabelRest(cwd, repoSlug, label) {
  const parts = repoSlug.split("/");
  const owner = parts[0];
  const name = parts[1];
  if (!owner || !name) {
    throw new Error(`Invalid repo slug: ${repoSlug}`);
  }

  const all = [];
  for (let page = 1; ; page++) {
    const path = `repos/${owner}/${name}/issues?state=open&labels=${encodeURIComponent(label)}&per_page=100&page=${page}&sort=created&direction=desc`;
    const batch = gh(cwd, ["api", path, "-H", "Accept: application/vnd.github+json"], {
      json: true,
    });
    if (!Array.isArray(batch) || batch.length === 0) break;
    for (const it of batch) {
      if (it.pull_request) continue;
      all.push(normalizeRestIssue(it));
    }
    if (batch.length < 100) break;
  }
  return all;
}

/**
 * @param {string} cwd
 * @param {string} repoSlug
 * @param {string} searchQuery passed to `gh issue list --search`
 */
export function listOpenIssuesIssueListSearch(cwd, repoSlug, searchQuery) {
  return ghR(
    repoSlug,
    cwd,
    [
      "issue",
      "list",
      "--state",
      "open",
      "--search",
      searchQuery,
      "--json",
      "number,title,body,labels",
      "--limit",
      "1000",
    ],
    { json: true },
  );
}

/**
 * GitHub issue search (title/body); `titleFragment` should include quotes if needed, e.g. '"Configure Pokemon form:"'
 * @param {string} cwd
 * @param {string} repoSlug
 * @param {string} titleFragment appended after `repo:… is:issue is:open`
 */
export function listOpenIssuesTitleSearch(cwd, repoSlug, titleFragment) {
  const q = `repo:${repoSlug} is:issue is:open ${titleFragment}`;
  try {
    const rows = gh(
      cwd,
      ["search", "issues", q, "--json", "number,title,body,labels", "--limit", "1000"],
      { json: true },
    );
    if (!Array.isArray(rows)) return [];
    return rows.map(normalizeRestIssue);
  } catch (e) {
    console.warn(
      `dex-issue-sync: gh search issues failed (${e instanceof Error ? e.message : e}); continuing without title search results.`,
    );
    return [];
  }
}

/**
 * @param {string} cwd
 * @param {string} repoSlug
 * @param {{ label: string; bodySearch?: string; titleSearchFragment?: string }} opts
 *   titleSearchFragment — e.g. '"Configure Pokemon form:"' (quoted for exact phrase)
 */
export function listOpenDexIssuesMerged(cwd, repoSlug, opts) {
  const { label, bodySearch, titleSearchFragment } = opts;
  const a = listOpenIssuesWithLabelRest(cwd, repoSlug, label);
  const b = bodySearch ? listOpenIssuesIssueListSearch(cwd, repoSlug, bodySearch) : [];
  const c = titleSearchFragment
    ? listOpenIssuesTitleSearch(cwd, repoSlug, titleSearchFragment)
    : [];
  return mergeIssuesByNumber(mergeIssuesByNumber(a, b), c);
}
