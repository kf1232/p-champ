/**
 * Resolve the current GitHub repo and run `gh` with an explicit `-R owner/name`
 * so commands never target the wrong remote (fork vs upstream, wrong default, etc.).
 */

import { execFileSync } from "node:child_process";

/**
 * @param {string} cwd Git repo root (e.g. package root)
 * @returns {string} `owner/name`
 */
export function getRepoSlug(cwd) {
  try {
    const out = execFileSync(
      "gh",
      ["repo", "view", "--json", "nameWithOwner", "-q", ".nameWithOwner"],
      {
        encoding: "utf8",
        cwd,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    const s = (out ?? "").trim();
    if (!s) throw new Error("empty nameWithOwner");
    return s;
  } catch {
    throw new Error(
      "Could not resolve GitHub repository (gh repo view). Run inside a git clone with a remote, or set GH_REPO.",
    );
  }
}

/**
 * @param {string} cwd
 * @param {string[]} args gh args (no `gh` prefix)
 */
export function gh(cwd, args, { json = false } = {}) {
  const out = execFileSync("gh", args, {
    encoding: "utf8",
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (json) return JSON.parse(out || "[]");
  return out.trim();
}

/**
 * `gh -R owner/repo ...` for repo-scoped commands.
 * @param {string} repoSlug `owner/name`
 */
export function ghR(repoSlug, cwd, args, opts) {
  return gh(cwd, ["-R", repoSlug, ...args], opts);
}
