#!/usr/bin/env node
/**
 * Syncs GitHub issues with `moveObject` entries in lib/dex/moves.ts that are still `null`.
 *
 * Requires: GitHub CLI (`gh`) authenticated for this repo.
 *
 * Usage:
 *   node scripts/sync-move-issues.mjs
 *   node scripts/sync-move-issues.mjs --dry-run
 *   node scripts/sync-move-issues.mjs --max-create 5
 */

import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { getRepoSlug, gh as ghGlobal, ghR } from "./lib/dex-issue-sync/gh-repo.mjs";
import { listOpenDexIssuesMerged } from "./lib/dex-issue-sync/list-open-issues.mjs";
import { computeMoveSyncPlan } from "./lib/dex-issue-sync/plans.mjs";
import { parseMoveIdFromIssue } from "./lib/dex-issue-sync/parsers.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

const LABEL = "dex-move";
/** Applied to every issue this script creates or tracks so it is identifiable as automation-driven. */
const AUTOMATION_LABEL = "automation";
const REL_PATH = "lib/dex/moves.ts";

/** `gh issue list --search` fragment so we still see issues missing the category label but with a body marker. */
const BODY_MARKER_SEARCH = "work-item:dex-move in:body";

function marker(moveId) {
  return `<!-- work-item:dex-move:${moveId} -->`;
}

function ensureLabels(repo) {
  try {
    ghR(repo, REPO_ROOT, [
      "label",
      "create",
      LABEL,
      "--color",
      "0366D6",
      "--description",
      "Move still needs MoveRecord in moveObject (sync-move-issues)",
      "-f",
    ]);
  } catch {
    // exists
  }
  try {
    ghR(repo, REPO_ROOT, [
      "label",
      "create",
      AUTOMATION_LABEL,
      "--color",
      "5319E7",
      "--description",
      "Issues created or maintained by sync-move-issues / sync-pokemon-form-issues / sync-type-issues",
      "-f",
    ]);
  } catch {
    // exists
  }
}

function listOpenIssuesForMoves(repo) {
  return listOpenDexIssuesMerged(REPO_ROOT, repo, {
    label: LABEL,
    bodySearch: BODY_MARKER_SEARCH,
    titleSearchFragment: '"Configure move:"',
  });
}

function scanMovesFile(content) {
  const pending = new Set();
  const lineRe = /^\s*\[MOVES\.(\w+)\]\s*:\s*(null|\{)/;
  for (const line of content.split("\n")) {
    const m = line.match(lineRe);
    if (!m) continue;
    const id = m[1];
    if (m[2] === "null") pending.add(id);
  }
  return pending;
}

function parseArgs(argv) {
  let dryRun = false;
  let maxCreate = Infinity;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") dryRun = true;
    else if (a === "--max-create") {
      const n = Number(argv[++i]);
      if (!Number.isFinite(n) || n < 0) {
        console.error("Invalid --max-create value");
        process.exit(1);
      }
      maxCreate = n;
    } else if (a === "--help" || a === "-h") {
      console.log(`
Usage: node scripts/sync-move-issues.mjs [options]

Options:
  --dry-run          Print planned actions only
  --max-create N     Cap new issues (default: unlimited)
`);
      process.exit(0);
    }
  }
  return { dryRun, maxCreate };
}

function main() {
  const { dryRun, maxCreate } = parseArgs(process.argv.slice(2));

  try {
    ghGlobal(REPO_ROOT, ["auth", "status"]);
  } catch {
    console.error("GitHub CLI is not logged in. Run: gh auth login");
    process.exit(1);
  }

  const repo = getRepoSlug(REPO_ROOT);

  const absPath = join(REPO_ROOT, REL_PATH);
  const content = readFileSync(absPath, "utf8");
  const pending = scanMovesFile(content);

  ensureLabels(repo);
  const openIssues = listOpenIssuesForMoves(repo);

  let automationLabelCount = 0;
  for (const issue of openIssues) {
    const moveId = parseMoveIdFromIssue(issue.title, issue.body);
    if (!moveId) continue;
    const labelNames = (issue.labels ?? []).map((l) => l.name);
    if (!labelNames.includes(AUTOMATION_LABEL)) {
      console.log(`Add label "${AUTOMATION_LABEL}" to #${issue.number}`);
      if (!dryRun) {
        ghR(repo, REPO_ROOT, [
          "issue",
          "edit",
          String(issue.number),
          "--add-label",
          AUTOMATION_LABEL,
        ]);
      }
      automationLabelCount++;
    }
  }

  const { toCreate, toClose } = computeMoveSyncPlan(pending, openIssues);

  let createCount = 0;
  for (const moveId of toCreate) {
    if (createCount >= maxCreate) {
      console.warn(
        `Stopped creating issues after ${maxCreate} (--max-create). Remaining: ${toCreate.length - createCount}`,
      );
      break;
    }
    const title = `Configure move: ${moveId}`;
    const body = `${marker(moveId)}

\`moveObject['${moveId}']\` in \`${REL_PATH}\` is still \`null\`. Add a \`MoveRecord\` (name, category, power, accuracy, range) when you are ready to support this move.`;

    console.log(`Create issue: ${title}`);
    if (!dryRun) {
      const dir = mkdtempSync(join(tmpdir(), "gh-move-issue-"));
      const bodyFile = join(dir, "body.md");
      writeFileSync(bodyFile, body, "utf8");
      ghR(repo, REPO_ROOT, [
        "issue",
        "create",
        "--title",
        title,
        "--body-file",
        bodyFile,
        "--label",
        LABEL,
        "--label",
        AUTOMATION_LABEL,
      ]);
    }
    createCount++;
  }

  for (const { number, reason } of toClose) {
    const msg =
      reason === "duplicate"
        ? `Close duplicate #${number} (keeping another open issue for this move)`
        : `Close #${number} (move configured)`;
    console.log(msg);
    if (!dryRun) {
      const closeReason = reason === "duplicate" ? "not planned" : "completed";
      ghR(repo, REPO_ROOT, [
        "issue",
        "close",
        String(number),
        "--reason",
        closeReason,
      ]);
    }
  }

  const labelNote =
    automationLabelCount > 0
      ? `${dryRun ? "would add" : "added"} "${AUTOMATION_LABEL}" to ${automationLabelCount} open issue(s), `
      : "";
  console.log(
    dryRun
      ? `\nDry run: ${labelNote}would create ${Math.min(toCreate.length, maxCreate)} issue(s), close ${toClose.length} issue(s).`
      : `\nDone: ${labelNote}created ${createCount} issue(s), closed ${toClose.length} issue(s).`,
  );
}

main();
