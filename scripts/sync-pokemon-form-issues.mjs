#!/usr/bin/env node
/**
 * Syncs GitHub issues with incomplete `forms` entries in lib/dex/dexObject.ts.
 *
 * A form is **incomplete** when:
 * - `[FORM_IDS.*]: null`, or
 * - it is an object but `types` has no `TYPES.*` entries, or `moves` has no `MOVES.*` entries
 *   (e.g. stats filled in but `moves: []`).
 *
 * Open issues stay open until the form is fully filled; the issue body is **updated** when the
 * situation changes (null → partial object, or partial → different gaps).
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
 * First `[...]` after `fieldName:` in block; returns inner text or null if unparseable.
 */
function arrayLiteralAfterField(block, fieldName) {
  const re = new RegExp(`\\b${fieldName}:\\s*\\[`);
  const mi = block.search(re);
  if (mi === -1) return null;
  const tail = block.slice(mi);
  const bracketStart = tail.indexOf("[");
  if (bracketStart === -1) return null;
  let depth = 0;
  for (let k = bracketStart; k < tail.length; k++) {
    const ch = tail[k];
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) return tail.slice(bracketStart + 1, k);
    }
  }
  return null;
}

function arrayHasRef(inner, refPrefix) {
  if (inner == null) return false;
  return new RegExp(`\\b${refPrefix}\\w+`).test(inner);
}

/**
 * Reasons why this object literal is not a complete DexForm (empty list = complete).
 */
function analyzeFormObjectBlock(block) {
  const reasons = [];
  const typesInner = arrayLiteralAfterField(block, "types");
  const movesInner = arrayLiteralAfterField(block, "moves");

  if (typesInner === null) {
    reasons.push("Missing or invalid `types: [...]` array.");
  } else if (!arrayHasRef(typesInner, "TYPES.")) {
    reasons.push("`types` must include at least one `TYPES.*` reference.");
  }

  if (movesInner === null) {
    reasons.push("Missing or invalid `moves: [...]` array.");
  } else if (!arrayHasRef(movesInner, "MOVES.")) {
    reasons.push("`moves` must list at least one `MOVES.*` reference (array is empty or has no move ids).");
  }

  return reasons;
}

/**
 * From line index where `[FORM_IDS.x]: {` appears, collect brace-balanced `{...}` object text.
 */
function extractFormObjectBlock(lines, startLineIdx) {
  let depth = 0;
  let started = false;
  const parts = [];
  for (let j = startLineIdx; j < lines.length; j++) {
    const L = lines[j];
    parts.push(L);
    for (const c of L) {
      if (c === "{") {
        depth++;
        started = true;
      } else if (c === "}") {
        depth--;
        if (started && depth === 0) {
          return { block: parts.join("\n"), endLineIdx: j };
        }
      }
    }
  }
  return {
    block: parts.join("\n"),
    endLineIdx: lines.length - 1,
    unclosed: true,
  };
}

/**
 * Map itemId `${dex}-${formKey}` → { reasons: string[] } for every incomplete form.
 */
function scanDexObjectFile(content) {
  /** @type {Map<string, { reasons: string[] }>} */
  const incomplete = new Map();
  let currentDex = null;
  const lines = content.split("\n");
  const dexLine = /^\s*(\d+):\s*\{/;
  const formEntry =
    /^\s*(?:forms:\s*\{\s*)?\[FORM_IDS\.(\w+)\]\s*:\s*(null|\{)/;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const mDex = line.match(dexLine);
    if (mDex) currentDex = mDex[1];

    const mForm = line.match(formEntry);
    if (mForm && currentDex) {
      const formKey = mForm[1];
      const itemId = `${currentDex}-${formKey}`;
      if (mForm[2] === "null") {
        incomplete.set(itemId, {
          reasons: [
            "Slot is still `null` — replace with a `DexForm`: base stats, `types: [TYPES.*, …]`, and a non-empty `moves: [MOVES.*, …]` list.",
          ],
        });
        i++;
        continue;
      }

      const { block, endLineIdx, unclosed } = extractFormObjectBlock(lines, i);
      const reasons = unclosed
        ? [
            "Could not parse form object (unbalanced `{` / `}`). Fix syntax, then fill `types` and `moves`.",
          ]
        : analyzeFormObjectBlock(block);
      if (reasons.length > 0) incomplete.set(itemId, { reasons });
      i = endLineIdx + 1;
      continue;
    }
    i++;
  }
  return incomplete;
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
  const idx = itemId.indexOf("-");
  const dex = itemId.slice(0, idx);
  const formKey = itemId.slice(idx + 1);
  return `Configure Pokemon form: ${dex} (${formKey})`;
}

function bodyForItem(itemId, reasons) {
  const idx = itemId.indexOf("-");
  const dex = itemId.slice(0, idx);
  const formKey = itemId.slice(idx + 1);
  const bullets = reasons.map((r) => `- ${r}`).join("\n");
  return `${marker(itemId)}

National dex \`#${dex}\`, form \`${formKey}\` in \`${REL_PATH}\` is **not finished**.

${bullets}

**Done when:** the slot has a full \`DexForm\` with all stats, at least one \`TYPES.*\` in \`types\`, and at least one \`MOVES.*\` in \`moves\`.`;
}

function bodiesDiffer(a, b) {
  return (a ?? "").trim() !== (b ?? "").trim();
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
  const incomplete = scanDexObjectFile(content);

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
    byItem.get(itemId).push(issue);
  }

  const toCreate = [...incomplete.keys()].filter((id) => {
    const issues = byItem.get(id);
    return !issues || issues.length === 0;
  });

  const toClose = [];
  for (const [itemId, issues] of byItem) {
    const numbers = issues.map((x) => x.number).sort((a, b) => a - b);
    if (incomplete.has(itemId)) {
      for (let i = 1; i < numbers.length; i++) {
        toClose.push({ number: numbers[i], reason: "duplicate" });
      }
    } else {
      for (const n of numbers) {
        toClose.push({ number: n, reason: "completed" });
      }
    }
  }

  /** @type {{ number: number; body: string }[]} */
  const toUpdate = [];
  for (const [itemId, issues] of byItem) {
    if (!incomplete.has(itemId)) continue;
    issues.sort((a, b) => a.number - b.number);
    const primary = issues[0];
    const state = incomplete.get(itemId);
    const newBody = bodyForItem(itemId, state.reasons);
    if (bodiesDiffer(primary.body, newBody)) {
      toUpdate.push({ number: primary.number, body: newBody });
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
    const state = incomplete.get(itemId);
    const body = bodyForItem(itemId, state.reasons);

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

  for (const { number, body } of toUpdate) {
    console.log(`Update issue body #${number}`);
    if (!dryRun) {
      const dir = mkdtempSync(join(tmpdir(), "gh-form-edit-"));
      const bodyFile = join(dir, "body.md");
      writeFileSync(bodyFile, body, "utf8");
      gh(["issue", "edit", String(number), "--body-file", bodyFile]);
    }
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
      ? `\nDry run: ${labelNote}would create ${Math.min(toCreate.length, maxCreate)} issue(s), update ${toUpdate.length} issue(s), close ${toClose.length} issue(s).`
      : `\nDone: ${labelNote}created ${createCount} issue(s), updated ${toUpdate.length} issue(s), closed ${toClose.length} issue(s).`,
  );
}

main();
