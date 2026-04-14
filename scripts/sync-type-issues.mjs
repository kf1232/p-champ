#!/usr/bin/env node
/**
 * Syncs GitHub issues with `TYPES` entries in lib/dex/types.ts whose
 * `typeAtkModifier` / `typeDefModifier` objects are incomplete until each
 * includes `[TYPE_NAMES.<key>]: <multiplier>` for every key in `TYPE_NAMES`
 * (use `1` for neutrals). Only this computed-key form is detected (not string
 * keys like `"dragon": 2`).
 *
 * Requires: GitHub CLI (`gh`) authenticated for this repo.
 *
 * Usage:
 *   node scripts/sync-type-issues.mjs
 *   node scripts/sync-type-issues.mjs --dry-run
 *   node scripts/sync-type-issues.mjs --max-create 5
 */

import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { getRepoSlug, gh as ghGlobal, ghR } from "./lib/dex-issue-sync/gh-repo.mjs";
import { listOpenDexIssuesMerged } from "./lib/dex-issue-sync/list-open-issues.mjs";
import { computeTypeSyncPlan } from "./lib/dex-issue-sync/plans.mjs";
import { parseTypeKeyFromIssue } from "./lib/dex-issue-sync/parsers.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

const LABEL = "dex-type";
/** Applied to every issue this script creates or tracks so it is identifiable as automation-driven. */
const AUTOMATION_LABEL = "automation";
const REL_PATH = "lib/dex/types.ts";

const BODY_MARKER_SEARCH = "work-item:dex-type in:body";

function marker(typeKey) {
  return `<!-- work-item:dex-type:${typeKey} -->`;
}

function ensureLabels(repo) {
  try {
    ghR(repo, REPO_ROOT, [
      "label",
      "create",
      LABEL,
      "--color",
      "B60205",
      "--description",
      "Pokémon type still needs matchup rows in TYPES (sync-type-issues)",
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

function listOpenIssuesForTypes(repo) {
  return listOpenDexIssuesMerged(REPO_ROOT, repo, {
    label: LABEL,
    bodySearch: BODY_MARKER_SEARCH,
    titleSearchFragment: '"Configure type:"',
  });
}

/** Extract `{ ... }` body of `export const NAME = ...` (brace-balanced). */
function extractBracedObjectBody(content, startMark) {
  const i = content.indexOf(startMark);
  if (i === -1) return null;
  let j = i + startMark.length;
  while (j < content.length && content[j] !== "{") j++;
  if (j >= content.length || content[j] !== "{") return null;
  let depth = 0;
  const open = j;
  for (; j < content.length; j++) {
    const c = content[j];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return content.slice(open + 1, j);
    }
  }
  return null;
}

function extractTypesObjectBody(content) {
  return extractBracedObjectBody(content, "export const TYPES = ");
}

/** All canonical type name strings from `export const TYPE_NAMES = { ... }`. */
function parseAllTypeNames(content) {
  const inner = extractBracedObjectBody(content, "export const TYPE_NAMES = ");
  if (!inner) return null;
  const names = new Set();
  const lineRe = /^\s*(\w+)\s*:\s*"([^"]+)"/gm;
  let m;
  while ((m = lineRe.exec(inner)) !== null) {
    names.add(m[1]);
  }
  return names;
}

/**
 * First `{ ... }` object after `fieldName:` (brace-balanced), e.g. the modifier map only.
 * Ignores text after that object (extra fields, closing `},`, etc.).
 */
function extractObjectAfterField(block, fieldName) {
  const startMark = `${fieldName}:`;
  const i = block.indexOf(startMark);
  if (i === -1) return null;
  let j = i + startMark.length;
  while (j < block.length && /\s/.test(block[j])) j++;
  if (block[j] !== "{") return null;
  let depth = 0;
  const open = j;
  for (; j < block.length; j++) {
    const c = block[j];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return block.slice(open, j + 1);
    }
  }
  return null;
}

/** Collect `TYPE_NAMES.<key>` property keys inside a modifier `{ ... }` string. */
function parseModifierKeysInObjectLiteral(objText) {
  const set = new Set();
  const re = /\[TYPE_NAMES\.(\w+)\]\s*:\s*[\d.]+/g;
  let m;
  while ((m = re.exec(objText)) !== null) {
    set.add(m[1]);
  }
  return set;
}

function isTypeModifierComplete(block, allTypeKeys) {
  const atkObj = extractObjectAfterField(block, "typeAtkModifier");
  const defObj = extractObjectAfterField(block, "typeDefModifier");
  if (!atkObj || !defObj) return false;
  const atkKeys = parseModifierKeysInObjectLiteral(atkObj);
  const defKeys = parseModifierKeysInObjectLiteral(defObj);
  for (const k of allTypeKeys) {
    if (!atkKeys.has(k) || !defKeys.has(k)) return false;
  }
  return true;
}

/**
 * Pending types: missing any `[TYPE_NAMES.key]:` entry for some `TYPE_NAMES` key in atk or def.
 */
function scanTypesFile(content) {
  const pending = new Set();
  const allTypeKeys = parseAllTypeNames(content);
  if (!allTypeKeys || allTypeKeys.size === 0) {
    console.warn(`Could not parse TYPE_NAMES in ${REL_PATH}`);
    return pending;
  }
  const inner = extractTypesObjectBody(content);
  if (!inner) {
    console.warn(`Could not parse TYPES object in ${REL_PATH}`);
    return pending;
  }
  const blocks = inner.split(/\n(?=  \w+: \{)/);
  for (const block of blocks) {
    const km = block.match(/^\s*(\w+): \{/);
    if (!km) continue;
    const key = km[1];
    if (!isTypeModifierComplete(block, allTypeKeys)) pending.add(key);
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
Usage: node scripts/sync-type-issues.mjs [options]

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
  const pending = scanTypesFile(content);

  ensureLabels(repo);
  const openIssues = listOpenIssuesForTypes(repo);

  let automationLabelCount = 0;
  for (const issue of openIssues) {
    const typeKey = parseTypeKeyFromIssue(issue.title, issue.body);
    if (!typeKey) continue;
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

  const { toCreate, toClose } = computeTypeSyncPlan(pending, openIssues);

  let createCount = 0;
  for (const typeKey of toCreate.sort()) {
    if (createCount >= maxCreate) {
      console.warn(
        `Stopped creating issues after ${maxCreate} (--max-create). Remaining: ${toCreate.length - createCount}`,
      );
      break;
    }
    const title = `Configure type: ${typeKey}`;
    const body = `${marker(typeKey)}

\`TYPES.${typeKey}\` in \`${REL_PATH}\` must include \`[TYPE_NAMES.<key>]: <multiplier>\` for **every** key in \`TYPE_NAMES\` in both \`typeAtkModifier\` and \`typeDefModifier\` objects (use \`1\` for neutrals).`;

    console.log(`Create issue: ${title}`);
    if (!dryRun) {
      const dir = mkdtempSync(join(tmpdir(), "gh-type-issue-"));
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
        ? `Close duplicate #${number} (keeping another open issue for this type)`
        : `Close #${number} (type configured)`;
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
