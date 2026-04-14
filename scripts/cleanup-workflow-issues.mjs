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

import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

const AUTOMATION_LABEL = "automation";

function gh(args, { json = false } = {}) {
  const out = execFileSync("gh", args, {
    encoding: "utf8",
    cwd: REPO_ROOT,
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (json) return JSON.parse(out || "[]");
  return out.trim();
}

/**
 * @returns {{ key: string; kind: "move" | "form" | "type" } | null}
 */
function parseWorkItemKey(title, body) {
  const t = title ?? "";
  const b = body ?? "";

  let m = b.match(/<!--\s*work-item:dex-move:(\w+)\s*-->/);
  if (m) return { key: `move:${m[1]}`, kind: "move" };

  m = b.match(/<!--\s*work-item:dex-pokemon-form:([\w-]+)\s*-->/);
  if (m) return { key: `form:${m[1]}`, kind: "form" };

  m = b.match(/<!--\s*work-item:dex-type:(\w+)\s*-->/);
  if (m) return { key: `type:${m[1]}`, kind: "type" };

  if (t.startsWith("Configure move: ")) {
    const rest = t.slice("Configure move: ".length).trim();
    if (/^\w+$/.test(rest)) return { key: `move:${rest}`, kind: "move" };
  }

  const tf = t.match(/^Configure Pokemon form: (\d+) \((\w+)\)$/);
  if (tf) return { key: `form:${tf[1]}-${tf[2]}`, kind: "form" };

  if (t.startsWith("Configure type: ")) {
    const rest = t.slice("Configure type: ".length).trim();
    if (/^\w+$/.test(rest)) return { key: `type:${rest}`, kind: "type" };
  }

  return null;
}

function listAutomationIssues() {
  return gh(
    [
      "issue",
      "list",
      "--state",
      "open",
      "--label",
      AUTOMATION_LABEL,
      "--json",
      "number,title,body",
      "--limit",
      "1000",
    ],
    { json: true },
  );
}

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
    gh(["auth", "status"]);
  } catch {
    console.error("GitHub CLI is not logged in. Run: gh auth login");
    process.exit(1);
  }

  const openIssues = listAutomationIssues();

  /** @type {Map<string, { number: number; title: string }[]>} */
  const byKey = new Map();
  let skipped = 0;

  for (const issue of openIssues) {
    const parsed = parseWorkItemKey(issue.title, issue.body);
    if (!parsed) {
      skipped++;
      console.warn(
        `Skip #${issue.number} (no dex work item in title/body): ${issue.title.slice(0, 60)}…`,
      );
      continue;
    }
    if (!byKey.has(parsed.key)) byKey.set(parsed.key, []);
    byKey.get(parsed.key).push({
      number: issue.number,
      title: issue.title,
    });
  }

  const toClose = [];
  for (const [key, rows] of byKey) {
    if (rows.length <= 1) continue;
    rows.sort((a, b) => a.number - b.number);
    const keep = rows[0];
    for (let i = 1; i < rows.length; i++) {
      toClose.push({
        number: rows[i].number,
        keepNumber: keep.number,
        key,
      });
    }
  }

  for (const { number, keepNumber, key } of toClose) {
    const msg = `Close duplicate #${number} for ${key} (keeping #${keepNumber})`;
    console.log(dryRun ? `[dry-run] would ${msg.toLowerCase()}` : msg);
    if (!dryRun) {
      gh(["issue", "close", String(number), "--reason", "not_planned"]);
    }
  }

  console.log(
    dryRun
      ? `\nDry run: would close ${toClose.length} duplicate issue(s); skipped ${skipped} unparseable; ${byKey.size} distinct work item(s).`
      : `\nDone: closed ${toClose.length} duplicate issue(s); skipped ${skipped} unparseable; ${byKey.size} distinct work item(s).`,
  );
}

main();
