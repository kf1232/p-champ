import { emptyAddressFieldValue } from "../addressFieldValue";
import {
  countAddressStatuses,
  deriveAddressFieldStatus,
  groupSecondaryRowsByEffectiveStatus,
  shouldEmitAddressFieldStatusChange,
} from "../addressFieldStatus";

describe("deriveAddressFieldStatus", () => {
  it("returns success when address is resolved", () => {
    expect(
      deriveAddressFieldStatus(
        {
          query: "123 Main St",
          formatted: "123 Main St, Columbia, SC",
          placeId: "1",
          lat: 34,
          lon: -81,
        },
        "123 Main St",
        0,
        true,
      ),
    ).toBe("success");
  });

  it("returns warning when suggestions exist but not selected", () => {
    expect(
      deriveAddressFieldStatus(
        emptyAddressFieldValue(),
        "123 Main St, Columbia",
        2,
        true,
      ),
    ).toBe("warning");
  });

  it("returns error when lookup settled with no suggestions", () => {
    expect(
      deriveAddressFieldStatus(
        emptyAddressFieldValue(),
        "123 Main St, Columbia",
        0,
        true,
      ),
    ).toBe("error");
  });

  it("returns idle while lookup is pending", () => {
    expect(
      deriveAddressFieldStatus(
        emptyAddressFieldValue(),
        "123 Main St, Columbia",
        0,
        false,
      ),
    ).toBe("idle");
  });
});

describe("shouldEmitAddressFieldStatusChange", () => {
  it("suppresses transient idle while parent row is warning and lookup pending", () => {
    expect(
      shouldEmitAddressFieldStatusChange("idle", null, "warning", {
        lookupSettled: false,
      }),
    ).toBe(false);
  });

  it("emits idle when lookup settled even if parent was warning", () => {
    expect(
      shouldEmitAddressFieldStatusChange("idle", "warning", "warning", {
        lookupSettled: true,
      }),
    ).toBe(true);
  });

  it("skips when next matches parent row status", () => {
    expect(
      shouldEmitAddressFieldStatusChange("warning", null, "warning", {
        lookupSettled: true,
      }),
    ).toBe(false);
  });
});

describe("groupSecondaryRowsByEffectiveStatus", () => {
  it("orders sections warning, error, success, then idle", () => {
    const rows = [
      { id: "a", value: emptyAddressFieldValue(), status: "success" as const },
      {
        id: "b",
        value: { ...emptyAddressFieldValue(), query: "x" },
        status: "error" as const,
      },
      {
        id: "c",
        value: { ...emptyAddressFieldValue(), query: "y" },
        status: "warning" as const,
      },
      { id: "d", value: emptyAddressFieldValue(), status: "idle" as const },
    ];

    const sections = groupSecondaryRowsByEffectiveStatus(rows);

    expect(sections.map((s) => s.key)).toEqual([
      "warning",
      "error",
      "success",
      "idle",
    ]);
    expect(sections[0]!.rows.map((r) => r.id)).toEqual(["c"]);
    expect(sections[1]!.rows.map((r) => r.id)).toEqual(["b"]);
    expect(sections[2]!.rows.map((r) => r.id)).toEqual(["a"]);
    expect(sections[3]!.label).toBeNull();
    expect(sections[3]!.rows.map((r) => r.id)).toEqual(["d"]);
  });
});

describe("countAddressStatuses", () => {
  it("counts success, warning, and error rows", () => {
    expect(
      countAddressStatuses([
        { status: "success" },
        { status: "success" },
        { status: "warning" },
        { status: "error" },
        { status: "idle" },
      ]),
    ).toEqual({ success: 2, warning: 1, error: 1 });
  });
});
