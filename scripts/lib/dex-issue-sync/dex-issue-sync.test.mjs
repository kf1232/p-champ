import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { mergeIssuesByNumber } from "./merge-issues.mjs";
import {
  computeCleanupDuplicateCloses,
  computeMoveSyncPlan,
  computePokemonFormSyncPlan,
  computeTypeSyncPlan,
} from "./plans.mjs";
import {
  parseMoveIdFromIssue,
  parsePokemonFormItemIdFromIssue,
  parseTypeKeyFromIssue,
  parseWorkItemKey,
} from "./parsers.mjs";

describe("parsers", () => {
  it("parses move id from body marker", () => {
    assert.equal(
      parseMoveIdFromIssue("x", "<!-- work-item:dex-move:ember -->"),
      "ember",
    );
  });

  it("parses move id from title", () => {
    assert.equal(parseMoveIdFromIssue("Configure move: ember", ""), "ember");
  });

  it("parses type key from body marker", () => {
    assert.equal(
      parseTypeKeyFromIssue("x", "<!-- work-item:dex-type:dragon -->"),
      "dragon",
    );
  });

  it("parses pokemon form item id from body marker (hyphenated)", () => {
    assert.equal(
      parsePokemonFormItemIdFromIssue(
        "t",
        "<!-- work-item:dex-pokemon-form:25-galar-zen -->",
      ),
      "25-galar-zen",
    );
  });

  it("parses pokemon form item id from title", () => {
    assert.equal(
      parsePokemonFormItemIdFromIssue(
        "Configure Pokemon form: 25 (galar-zen)",
        "",
      ),
      "25-galar-zen",
    );
  });

  it("parses pokemon form title with extra whitespace", () => {
    assert.equal(
      parsePokemonFormItemIdFromIssue(
        "Configure  Pokemon  form:  145  (  galarian  )",
        "",
      ),
      "145-galarian",
    );
  });

  it("parseWorkItemKey prefers body marker over title", () => {
    const r = parseWorkItemKey("wrong title", "<!-- work-item:dex-move:ember -->");
    assert.deepEqual(r, { key: "move:ember", kind: "move" });
  });
});

describe("mergeIssuesByNumber", () => {
  it("dedupes by number and merges labels", () => {
    const a = [
      {
        number: 1,
        title: "Configure move: ember",
        body: "x",
        labels: [{ name: "dex-move" }],
      },
    ];
    const b = [
      {
        number: 1,
        title: "Configure move: ember",
        body: "<!-- work-item:dex-move:ember -->",
        labels: [{ name: "automation" }],
      },
    ];
    const merged = mergeIssuesByNumber(a, b);
    assert.equal(merged.length, 1);
    const names = merged[0].labels.map((l) => l.name).sort();
    assert.deepEqual(names, ["automation", "dex-move"]);
  });
});

describe("computeMoveSyncPlan", () => {
  it("does not propose create when an open issue tracks the move (by marker)", () => {
    const pending = new Set(["ember"]);
    const openIssues = [
      {
        number: 10,
        title: "Configure move: ember",
        body: "<!-- work-item:dex-move:ember -->",
      },
    ];
    const { toCreate, toClose } = computeMoveSyncPlan(pending, openIssues);
    assert.deepEqual(toCreate, []);
    assert.deepEqual(toClose, []);
  });

  it("does not propose create when only body search would find the issue (label list simulated)", () => {
    const pending = new Set(["ember"]);
    const openIssues = [
      {
        number: 99,
        title: "Configure move: ember",
        body: `<!-- work-item:dex-move:ember -->

(no dex-move label in real GitHub — merge step fixes this)`,
      },
    ];
    const { toCreate } = computeMoveSyncPlan(pending, openIssues);
    assert.deepEqual(toCreate, []);
  });

  it("closes duplicate issue numbers for the same move", () => {
    const pending = new Set(["ember"]);
    const openIssues = [
      {
        number: 10,
        title: "Configure move: ember",
        body: "<!-- work-item:dex-move:ember -->",
      },
      {
        number: 20,
        title: "Configure move: ember",
        body: "<!-- work-item:dex-move:ember -->",
      },
    ];
    const { toCreate, toClose } = computeMoveSyncPlan(pending, openIssues);
    assert.deepEqual(toCreate, []);
    assert.deepEqual(toClose, [{ number: 20, reason: "duplicate" }]);
  });

  it("closes all when move is no longer pending", () => {
    const pending = new Set();
    const openIssues = [
      {
        number: 10,
        title: "Configure move: ember",
        body: "<!-- work-item:dex-move:ember -->",
      },
    ];
    const { toCreate, toClose } = computeMoveSyncPlan(pending, openIssues);
    assert.deepEqual(toCreate, []);
    assert.deepEqual(toClose, [{ number: 10, reason: "completed" }]);
  });
});

describe("computeTypeSyncPlan", () => {
  it("does not propose create when type is already tracked", () => {
    const pending = new Set(["dragon"]);
    const openIssues = [
      {
        number: 3,
        title: "Configure type: dragon",
        body: "<!-- work-item:dex-type:dragon -->",
      },
    ];
    const { toCreate, toClose } = computeTypeSyncPlan(pending, openIssues);
    assert.deepEqual(toCreate, []);
    assert.deepEqual(toClose, []);
  });
});

describe("computePokemonFormSyncPlan", () => {
  it("does not propose create when a form is already tracked", () => {
    const incomplete = new Map([
      ["1-base", { reasons: ["Missing types"] }],
    ]);
    const openIssues = [
      {
        number: 7,
        title: "Configure Pokemon form: 1 (base)",
        body: "<!-- work-item:dex-pokemon-form:1-base -->",
      },
    ];
    const { toCreate, toClose, toUpdate } = computePokemonFormSyncPlan(
      incomplete,
      openIssues,
      (itemId, reasons) => `<!-- work-item:dex-pokemon-form:${itemId} -->\n${reasons.join()}`,
    );
    assert.deepEqual(toCreate, []);
    assert.deepEqual(toClose, []);
    assert.equal(toUpdate.length, 1);
  });
});

describe("computeCleanupDuplicateCloses", () => {
  it("returns closes for duplicate keys", () => {
    const openIssues = [
      {
        number: 10,
        title: "Configure move: ember",
        body: "<!-- work-item:dex-move:ember -->",
      },
      {
        number: 20,
        title: "Configure move: ember",
        body: "<!-- work-item:dex-move:ember -->",
      },
    ];
    const { toClose, skipped, distinctKeys } =
      computeCleanupDuplicateCloses(openIssues);
    assert.equal(skipped, 0);
    assert.equal(distinctKeys, 1);
    assert.equal(toClose.length, 1);
    assert.equal(toClose[0].number, 20);
    assert.equal(toClose[0].keepNumber, 10);
  });
});
