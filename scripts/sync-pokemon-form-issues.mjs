#!/usr/bin/env node
/**
 * Syncs GitHub issues with `forms` entries in lib/dex/dexObject.ts that are still `null`.
 * Each top-level dex entry is `N: { ... }`; form lines use `[FORM_IDS.<key>]: null` or `{`.
 *
 * Requires: GitHub CLI (`gh`) authenticated for this repo.
 *
 * Usage:
 *   node scripts/sync-pokemon-form-issues.mjs
 *   node scripts/sync-pokemon-form-issues.mjs --dry-run
 *   node scripts/sync-pokemon-form-issues.mjs --max-create 5
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

const LABEL = "dex-pokemon-form";
/** Applied to every issue this script creates or tracks so it is identifiable as automation-driven. */
const AUTOMATION_LABEL = "automation";
const REL_PATH = "lib/dex/dexObject.ts";

function marker(itemId) {
  return `<!-- work-item:dex-pokemon-form:${itemId} -->`;
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
      "1D76DB",
      "--description",
      "Pokemon form still needs DexForm in dexObject (sync-pokemon-form-issues)",
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

/**
 * Pending form slots: `[FORM_IDS.x]: null` (or same on `forms: { ... }` line).
 * Item id: `${dexNumber}-${formKey}`.
 */
function scanDexObjectFile(content) {
  const pending = new Set();
  let currentDex = null;
  const dexLine = /^\s*(\d+):\s*\{/;
  const formEntry =
    /^\s*(?:forms:\s*\{\s*)?\[FORM_IDS\.(\w+)\]\s*:\s*(null|\{)/;

  for (const line of content.split("\n")) {
    const mDex = line.match(dexLine);
    if (mDex) currentDex = mDex[1];

    const mForm = line.match(formEntry);
    if (mForm && currentDex) {
      const formKey = mForm[1];
      const itemId = `${currentDex}-${formKey}`;
      if (mForm[2] === "null") pending.add(itemId);
    }
  }
  return pending;
}

function parseItemIdFromIssue(title, body) {
  const fromBody = body?.match(
    /<!--\s*work-item:dex-pokemon-form:([\w-]+)\s*-->/,
  );
  if (fromBody) return fromBody[1];
  const m = title.match(/^Configure Pokemon form: (\d+) \((\w+)\)$/);
  if (m) return `${m[1]}-${m[2]}`;
  return null;
}

function titleForItem(itemId) {
  const i = itemId.indexOf("-");
  const dex = itemId.slice(0, i);
  const formKey = itemId.slice(i + 1);
  return `Configure Pokemon form: ${dex} (${formKey})`;
}

function bodyForItem(itemId) {
  const i = itemId.indexOf("-");
  const dex = itemId.slice(0, i);
  const formKey = itemId.slice(i + 1);
  return `${marker(itemId)}

National dex \`#${dex}\`, form \`${formKey}\`: \`forms\` in \`${REL_PATH}\` still has \`null\` for this form. Add a \`DexForm\` (stats, types, moves).`;
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
Usage: node scripts/sync-pokemon-form-issues.mjs [options]

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
  const pending = scanDexObjectFile(content);

  ensureLabels();
  const openIssues = listOpenIssues();

  let automationLabelCount = 0;
  for (const issue of openIssues) {
    const itemId = parseItemIdFromIssue(issue.title, issue.body);
    if (!itemId) continue;
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

  const byItem = new Map();
  for (const issue of openIssues) {
    const itemId = parseItemIdFromIssue(issue.title, issue.body);
    if (!itemId) continue;
    if (!byItem.has(itemId)) byItem.set(itemId, []);
    byItem.get(itemId).push(issue.number);
  }

  const toCreate = [...pending].filter((id) => {
    const nums = byItem.get(id);
    return !nums || nums.length === 0;
  });

  const toClose = [];
  for (const [itemId, numbers] of byItem) {
    numbers.sort((a, b) => a - b);
    if (pending.has(itemId)) {
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
  for (const itemId of toCreate) {
    if (createCount >= maxCreate) {
      console.warn(
        `Stopped creating issues after ${maxCreate} (--max-create). Remaining: ${toCreate.length - createCount}`,
      );
      break;
    }
    const title = titleForItem(itemId);
    const body = bodyForItem(itemId);

    console.log(`Create issue: ${title}`);
    if (!dryRun) {
      const dir = mkdtempSync(join(tmpdir(), "gh-form-issue-"));
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
        ? `Close duplicate #${number} (keeping another open issue for this form)`
        : `Close #${number} (form configured)`;
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
