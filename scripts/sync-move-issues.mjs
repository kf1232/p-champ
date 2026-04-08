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

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

const LABEL = "dex-move";
/** Applied to every issue this script creates or tracks so it is identifiable as automation-driven. */
const AUTOMATION_LABEL = "automation";
const REL_PATH = "lib/dex/moves.ts";

function marker(moveId) {
  return `<!-- work-item:dex-move:${moveId} -->`;
}

function gh(args, { json = false } = {}) {
  const out = execFileSync("gh", args, {
    encoding: "utf8",
    cwd: REPO_ROOT,
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (json) return JSON.parse(out || "[]");
  return out.trim();
}

function ensureLabels() {
  try {
    gh([
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
    gh([
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

function listOpenIssues() {
  return gh(
    [
      "issue",
      "list",
      "--state",
      "open",
      "--label",
      LABEL,
      "--json",
      "number,title,body,labels",
      "--limit",
      "1000",
    ],
    { json: true },
  );
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

function parseMoveIdFromIssue(title, body) {
  const fromBody = body?.match(/<!--\s*work-item:dex-move:(\w+)\s*-->/);
  if (fromBody) return fromBody[1];
  if (title.startsWith("Configure move: ")) {
    const rest = title.slice("Configure move: ".length).trim();
    if (/^\w+$/.test(rest)) return rest;
  }
  return null;
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
    gh(["auth", "status"]);
  } catch {
    console.error("GitHub CLI is not logged in. Run: gh auth login");
    process.exit(1);
  }

  const absPath = join(REPO_ROOT, REL_PATH);
  const content = readFileSync(absPath, "utf8");
  const pending = scanMovesFile(content);

  ensureLabels();
  const openIssues = listOpenIssues();

  let automationLabelCount = 0;
  for (const issue of openIssues) {
    const moveId = parseMoveIdFromIssue(issue.title, issue.body);
    if (!moveId) continue;
    const labelNames = (issue.labels ?? []).map((l) => l.name);
    if (!labelNames.includes(AUTOMATION_LABEL)) {
      console.log(`Add label "${AUTOMATION_LABEL}" to #${issue.number}`);
      if (!dryRun) {
        gh([
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

  const byMove = new Map();
  for (const issue of openIssues) {
    const moveId = parseMoveIdFromIssue(issue.title, issue.body);
    if (!moveId) continue;
    if (!byMove.has(moveId)) byMove.set(moveId, []);
    byMove.get(moveId).push(issue.number);
  }

  const toCreate = [...pending].filter((id) => {
    const nums = byMove.get(id);
    return !nums || nums.length === 0;
  });

  const toClose = [];
  for (const [moveId, numbers] of byMove) {
    numbers.sort((a, b) => a - b);
    if (pending.has(moveId)) {
      for (let i = 1; i < numbers.length; i++) {
        toClose.push({ number: numbers[i], reason: "duplicate" });
      }
    } else {
      for (const n of numbers) {
        toClose.push({ number: n, reason: "completed" });
      }
    }
  }

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
      gh([
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
      const closeReason = reason === "duplicate" ? "not_planned" : "completed";
      gh(["issue", "close", String(number), "--reason", closeReason]);
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
