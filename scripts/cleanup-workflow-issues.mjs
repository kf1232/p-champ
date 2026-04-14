#!/usr/bin/env node
/**
 * Ensures at most one open GitHub issue per dex automation work item (move, pokemon
 * form, or type). When multiple open issues reference the same record, keeps the
 * lowest issue number and closes the rest as duplicates.
 *
 * Uses the same `<!-- work-item:dex-... -->` markers and title patterns as the
 * sync-*-issues scripts so grouping matches what those scripts expect.
 *
 * Requires: GitHub CLI (`gh`) authenticated for this repo.
 *
 * Usage:
 *   node scripts/cleanup-workflow-issues.mjs
 *   node scripts/cleanup-workflow-issues.mjs --dry-run
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { computeCleanupDuplicateCloses } from "./lib/dex-issue-sync/plans.mjs";
import { getRepoSlug, gh as ghGlobal, ghR } from "./lib/dex-issue-sync/gh-repo.mjs";
import { listOpenIssuesWithLabelRest } from "./lib/dex-issue-sync/list-open-issues.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

const AUTOMATION_LABEL = "automation";

function parseArgs(argv) {
  let dryRun = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") dryRun = true;
    else if (a === "--help" || a === "-h") {
      console.log(`
Usage: node scripts/cleanup-workflow-issues.mjs [options]

Options:
  --dry-run    Print planned closes only (no gh issue close)
`);
      process.exit(0);
    }
  }
  return { dryRun };
}

function main() {
  const { dryRun } = parseArgs(process.argv.slice(2));

  try {
    ghGlobal(REPO_ROOT, ["auth", "status"]);
  } catch {
    console.error("GitHub CLI is not logged in. Run: gh auth login");
    process.exit(1);
  }

  const repo = getRepoSlug(REPO_ROOT);
  const openIssues = listOpenIssuesWithLabelRest(REPO_ROOT, repo, AUTOMATION_LABEL);

  const { toClose, skipped, distinctKeys } =
    computeCleanupDuplicateCloses(openIssues);

  for (const { number, keepNumber, key } of toClose) {
    const msg = `Close duplicate #${number} for ${key} (keeping #${keepNumber})`;
    console.log(dryRun ? `[dry-run] would ${msg.toLowerCase()}` : msg);
    if (!dryRun) {
      ghR(repo, REPO_ROOT, [
        "issue",
        "close",
        String(number),
        "--reason",
        "not planned",
      ]);
    }
  }

  console.log(
    dryRun
      ? `\nDry run: would close ${toClose.length} duplicate issue(s); skipped ${skipped} unparseable; ${distinctKeys} distinct work item(s).`
      : `\nDone: closed ${toClose.length} duplicate issue(s); skipped ${skipped} unparseable; ${distinctKeys} distinct work item(s).`,
  );
}

main();
