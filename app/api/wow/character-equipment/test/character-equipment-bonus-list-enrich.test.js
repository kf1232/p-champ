/**
 * @jest-environment node
 */
import { applyBonusListDetailsToEquipmentBody } from "../character-equipment-bonus-list-enrich.js";

describe("applyBonusListDetailsToEquipmentBody", () => {
  it("adds bonus_list_detail only on equipped_items entries with bonus_list", () => {
    const body = {
      equipped_items: [
        {
          slot: { type: "HEAD" },
          bonus_list: [1, 999999, "2"],
        },
        {
          slot: { type: "CHEST" },
          nested: { bonus_list: [3] },
        },
        {
          slot: { type: "HAND" },
        },
      ],
    };

    const map = {
      "1": { id: 1, tag: "Heroic" },
      "2": { id: 2, tag: "Pristine" },
      "3": { id: 3, itemLevel: { amount: 30 } },
    };

    applyBonusListDetailsToEquipmentBody(body, map);

    expect(body.equipped_items[0].bonus_list_detail).toHaveLength(3);
    expect(body.equipped_items[0].bonus_list_detail[0]).toEqual({
      id: 1,
      tag: "Heroic",
    });
    expect(body.equipped_items[0].bonus_list_detail[1]).toEqual({ key: 999999 });
    expect(body.equipped_items[0].bonus_list_detail[2]).toEqual({
      id: 2,
      tag: "Pristine",
    });

    expect(body.equipped_items[1].bonus_list_detail).toBeUndefined();
    expect(body.equipped_items[1].nested.bonus_list_detail).toBeUndefined();

    expect(body.equipped_items[2].bonus_list_detail).toBeUndefined();
  });

  it("uses { key: rawEntry } for non-numeric bonus_list entries", () => {
    const body = {
      equipped_items: [{ bonus_list: ["nope", null, {}] }],
    };
    applyBonusListDetailsToEquipmentBody(body, { "1": { id: 1 } });
    expect(body.equipped_items[0].bonus_list_detail).toEqual([
      { key: "nope" },
      { key: null },
      { key: {} },
    ]);
  });

  it("no-ops when body or equipped_items is wrong shape", () => {
    applyBonusListDetailsToEquipmentBody(null, { "1": {} });
    applyBonusListDetailsToEquipmentBody([], { "1": {} });
    applyBonusListDetailsToEquipmentBody({ equipped_items: null }, {
      "1": {},
    });
    applyBonusListDetailsToEquipmentBody({ equipped_items: "x" }, {
      "1": {},
    });
    expect(true).toBe(true);
  });
});
