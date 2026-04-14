/**
 * Pure planning logic for dex issue sync scripts — used by CLI and tests.
 */

import {
  parseMoveIdFromIssue,
  parsePokemonFormItemIdFromIssue,
  parseTypeKeyFromIssue,
  parseWorkItemKey,
} from "./parsers.mjs";

/** @param {string | undefined} a @param {string | undefined} b */
export function bodiesDiffer(a, b) {
  return (a ?? "").trim() !== (b ?? "").trim();
}

/**
 * @param {Set<string>} pending
 * @param {Array<{ number: number; title: string; body?: string }>} openIssues
 */
export function computeMoveSyncPlan(pending, openIssues) {
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

  assertNoCreateWhenTracked(toCreate, byMove, "move");
  return { toCreate, toClose, byMove };
}

/**
 * @param {Set<string>} pending
 * @param {Array<{ number: number; title: string; body?: string }>} openIssues
 */
export function computeTypeSyncPlan(pending, openIssues) {
  const byType = new Map();
  for (const issue of openIssues) {
    const typeKey = parseTypeKeyFromIssue(issue.title, issue.body);
    if (!typeKey) continue;
    if (!byType.has(typeKey)) byType.set(typeKey, []);
    byType.get(typeKey).push(issue.number);
  }

  const toCreate = [...pending].filter((id) => {
    const nums = byType.get(id);
    return !nums || nums.length === 0;
  });

  const toClose = [];
  for (const [typeKey, numbers] of byType) {
    numbers.sort((a, b) => a - b);
    if (pending.has(typeKey)) {
      for (let i = 1; i < numbers.length; i++) {
        toClose.push({ number: numbers[i], reason: "duplicate" });
      }
    } else {
      for (const n of numbers) {
        toClose.push({ number: n, reason: "completed" });
      }
    }
  }

  assertNoCreateWhenTracked(toCreate, byType, "type");
  return { toCreate, toClose, byType };
}

/**
 * @param {Map<string, { reasons: string[] }>} incomplete
 * @param {Array<{ number: number; title: string; body?: string }>} openIssues
 * @param {(itemId: string, reasons: string[]) => string} buildBody
 */
export function computePokemonFormSyncPlan(incomplete, openIssues, buildBody) {
  const byItem = new Map();
  for (const issue of openIssues) {
    const itemId = parsePokemonFormItemIdFromIssue(issue.title, issue.body);
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

  const toUpdate = [];
  for (const [itemId, issues] of byItem) {
    if (!incomplete.has(itemId)) continue;
    issues.sort((a, b) => a.number - b.number);
    const primary = issues[0];
    const state = incomplete.get(itemId);
    const newBody = buildBody(itemId, state.reasons);
    if (bodiesDiffer(primary.body, newBody)) {
      toUpdate.push({ number: primary.number, body: newBody });
    }
  }

  assertNoCreateWhenTracked(toCreate, byItem, "pokemon-form");

  return { toCreate, toClose, toUpdate, byItem };
}

/**
 * @param {Array<{ number: number; title: string; body?: string }>} openIssues
 */
export function computeCleanupDuplicateCloses(openIssues) {
  /** @type {Map<string, { number: number; title: string }[]>} */
  const byKey = new Map();
  let skipped = 0;

  for (const issue of openIssues) {
    const parsed = parseWorkItemKey(issue.title, issue.body);
    if (!parsed) {
      skipped++;
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

  return { toClose, skipped, distinctKeys: byKey.size };
}

/**
 * @param {string[]} toCreate
 * @param {Map<string, number[] | { number: number }[]>} byId
 * @param {string} label
 */
function assertNoCreateWhenTracked(toCreate, byId, label) {
  for (const id of toCreate) {
    const tracked = byId.get(id);
    if (!tracked?.length) continue;
    const nums = tracked.map((x) =>
      typeof x === "number" ? x : x.number,
    );
    throw new Error(
      `sync plan bug: would create duplicate ${label} issue for ${id} (already ${nums.map((n) => `#${n}`).join(", ")})`,
    );
  }
}
