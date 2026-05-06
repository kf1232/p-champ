import {
  mapEquipmentToItemCards,
  mapMythicProfileToOverview,
  mapProfileSummaryToCharacterInfoRows,
  mapSeasonDetailsToOverview,
  rgbaToCss,
} from "./characterOverviewViewModels";

describe("mapProfileSummaryToCharacterInfoRows", () => {
  it("maps core fields and title placeholder", () => {
    const rows = mapProfileSummaryToCharacterInfoRows({
      name: "Flojob",
      realm: { name: "Emerald Dream", slug: "emerald-dream" },
      faction: { name: "Horde" },
      race: { name: "Blood Elf" },
      character_class: { name: "Paladin" },
      active_spec: { name: "Retribution" },
      level: 90,
      average_item_level: 260,
      equipped_item_level: 259,
      last_login_timestamp: 1777737506000,
      active_title: {
        display_string: "the Kingslayer {name}",
      },
      guild: {
        name: "WE ARE RATS",
        realm: { name: "Mal'Ganis" },
        faction: { name: "Horde" },
      },
    });
    const byLabel = Object.fromEntries(rows.map((r) => [r.label, r.value]));
    expect(byLabel.Name).toBe("Flojob");
    expect(byLabel.Realm).toBe("Emerald Dream");
    expect(byLabel["Active title"]).toBe("the Kingslayer Flojob");
    expect(byLabel.Guild).toContain("WE ARE RATS");
    expect(byLabel.Guild).toContain("Mal'Ganis");
  });

  it("returns empty for non-object", () => {
    expect(mapProfileSummaryToCharacterInfoRows(null)).toEqual([]);
  });
});

describe("mapEquipmentToItemCards", () => {
  it("only renders allowed equipment slot types (excludes shirt, tabard, etc.)", () => {
    const rows = mapEquipmentToItemCards({
      equipped_items: [
        {
          slot: { type: "BODY", name: "Shirt" },
          name: "Fine Cloth Shirt",
          quality: { name: "Common", type: "COMMON" },
        },
        {
          slot: { type: "TABARD", name: "Tabard" },
          name: "Guild Tabard",
          quality: { name: "Common", type: "COMMON" },
        },
        {
          slot: { type: "HEAD", name: "Head" },
          name: "Helm",
          quality: { name: "Epic", type: "EPIC" },
        },
      ],
    });
    expect(rows).toHaveLength(1);
    expect(rows[0].slotType).toBe("HEAD");
  });

  it("sorts by slot and maps item source from bonus tags (skips serverside and key-only)", () => {
    const rows = mapEquipmentToItemCards({
      equipped_items: [
        {
          slot: { type: "FEET", name: "Feet" },
          name: "Boots",
          quality: { name: "Epic", type: "EPIC" },
          level: { value: 272 },
          bonus_list_detail: [
            { id: 6652, serverside: true },
            { id: 13440, tag: "Mythic+" },
            { key: 13338 },
          ],
        },
        {
          slot: { type: "HEAD", name: "Head" },
          name: "Helm",
          quality: { name: "Epic", type: "EPIC" },
          level: { display_string: "Item Level 270" },
        },
      ],
    });
    expect(rows.map((r) => r.slotType)).toEqual(["HEAD", "FEET"]);
    expect(rows[0].itemName).toBe("Helm");
    expect(rows[0].itemSource).toBeNull();
    expect(rows[0].itemStage).toBeNull();
    expect(rows[1].itemSource).toBe("Mythic+");
    expect(rows[1].itemStage).toBeNull();
  });

  it("maps item stage from upgrade.fullName when itemLevel.amount and fullName are present", () => {
    const rows = mapEquipmentToItemCards({
      equipped_items: [
        {
          slot: { type: "HEAD", name: "Head" },
          name: "Helm",
          quality: { name: "Epic", type: "EPIC" },
          bonus_list_detail: [
            { id: 6652, serverside: true },
            { id: 13440, tag: "Mythic+" },
            { key: 13338 },
            {
              id: 12797,
              itemLevel: { amount: 272, priority: 0, squishEra: 2 },
              upgrade: {
                fullName: "Hero 5/6",
                name: "Hero",
                level: 5,
                max: 6,
              },
              quality: 4,
            },
          ],
        },
      ],
    });
    const c = rows[0];
    expect(c.itemSource).toBe("Mythic+");
    expect(c.itemStage).toBe("Hero 5/6");
  });

  it("does not populate source or stage for partial bonus rows", () => {
    const onlyIlvl = mapEquipmentToItemCards({
      equipped_items: [
        {
          slot: { type: "HEAD", name: "Head" },
          name: "Helm",
          quality: { name: "Epic", type: "EPIC" },
          bonus_list_detail: [
            { id: 999, itemLevel: { amount: 300, priority: 0, squishEra: 2 } },
          ],
        },
      ],
    })[0];
    expect(onlyIlvl.itemSource).toBeNull();
    expect(onlyIlvl.itemStage).toBeNull();

    const onlyName = mapEquipmentToItemCards({
      equipped_items: [
        {
          slot: { type: "HEAD", name: "Head" },
          name: "Helm",
          quality: { name: "Epic", type: "EPIC" },
          bonus_list_detail: [{ upgrade: { fullName: "Hero 1/6" } }],
        },
      ],
    })[0];
    expect(onlyName.itemSource).toBeNull();
    expect(onlyName.itemStage).toBeNull();
  });

  it("uses tag for source when tag shares an object with id", () => {
    const c = mapEquipmentToItemCards({
      equipped_items: [
        {
          slot: { type: "HEAD", name: "Head" },
          name: "Helm",
          quality: { name: "Epic", type: "EPIC" },
          bonus_list_detail: [{ id: 13440, tag: "Mythic+" }],
        },
      ],
    })[0];
    expect(c.itemSource).toBe("Mythic+");
    expect(c.itemStage).toBeNull();
  });

  it("reads set.item_set.name and strips enchant icon suffix", () => {
    const c = mapEquipmentToItemCards({
      equipped_items: [
        {
          slot: { type: "HEAD", name: "Head" },
          name: "Coif",
          quality: { name: "Epic", type: "EPIC" },
          level: { value: 280 },
          set: {
            item_set: {
              name: "Luminant Verdict's Vestments",
              id: 1985,
            },
            display_string: "Set (4/5)",
          },
          enchantments: [
            {
              display_string:
                "Enchanted: Empowered Blessing |A:Professions-ChatIcon-Quality-12:20:20|a",
            },
          ],
        },
      ],
    })[0];
    expect(c.itemSet).toBe("Luminant Verdict's Vestments");
    expect(c.enchant).toBe("Enchanted: Empowered Blessing");
  });

  it("flags enchantError when a required slot has no enchant", () => {
    const head = mapEquipmentToItemCards({
      equipped_items: [
        {
          slot: { type: "HEAD", name: "Head" },
          name: "Helm",
          quality: { name: "Epic", type: "EPIC" },
        },
      ],
    })[0];
    expect(head.slotExpectsEnchant).toBe(true);
    expect(head.enchantError).toBe(true);
    expect(head.enchant).toBeNull();

    const headOk = mapEquipmentToItemCards({
      equipped_items: [
        {
          slot: { type: "HEAD", name: "Head" },
          name: "Helm",
          quality: { name: "Epic", type: "EPIC" },
          enchantments: [{ display_string: "Enchanted: Test" }],
        },
      ],
    })[0];
    expect(headOk.enchantError).toBe(false);
    expect(headOk.enchant).toBe("Enchanted: Test");

    const feet = mapEquipmentToItemCards({
      equipped_items: [
        {
          slot: { type: "FEET", name: "Feet" },
          name: "Boots",
          quality: { name: "Epic", type: "EPIC" },
        },
      ],
    })[0];
    expect(feet.slotExpectsEnchant).toBe(true);
    expect(feet.enchantError).toBe(true);
  });

  it("does not require enchant on slots outside the weapon/armor/ring list", () => {
    const c = mapEquipmentToItemCards({
      equipped_items: [
        {
          slot: { type: "WRIST", name: "Wrist" },
          name: "Bracers",
          quality: { name: "Epic", type: "EPIC" },
        },
      ],
    })[0];
    expect(c.slotExpectsEnchant).toBe(false);
    expect(c.enchantError).toBe(false);
  });

  it("does not require enchant on off-hand (not enchantable)", () => {
    const off = mapEquipmentToItemCards({
      equipped_items: [
        {
          slot: { type: "OFF_HAND", name: "Off Hand" },
          name: "Tome of Power",
          quality: { name: "Epic", type: "EPIC" },
        },
      ],
    })[0];
    expect(off.slotExpectsEnchant).toBe(false);
    expect(off.enchantError).toBe(false);
  });

  it("maps sockets from sockets[].item.name and flags empty gems", () => {
    const ok = mapEquipmentToItemCards({
      equipped_items: [
        {
          slot: { type: "NECK", name: "Neck" },
          name: "Amulet",
          quality: { name: "Epic", type: "EPIC" },
          sockets: [
            {
              socket_type: { type: "PRISMATIC", name: "Prismatic Socket" },
              item: { name: "Flawless Deadly Amethyst", id: 240898 },
            },
          ],
        },
      ],
    })[0];
    expect(ok.socketsDisplay).toBe("Flawless Deadly Amethyst");
    expect(ok.socketError).toBe(false);

    const empty = mapEquipmentToItemCards({
      equipped_items: [
        {
          slot: { type: "NECK", name: "Neck" },
          name: "Amulet",
          quality: { name: "Epic", type: "EPIC" },
          sockets: [
            {
              socket_type: { type: "PRISMATIC", name: "Prismatic Socket" },
            },
          ],
        },
      ],
    })[0];
    expect(empty.socketsDisplay).toBe("-");
    expect(empty.socketError).toBe(true);

    const mixed = mapEquipmentToItemCards({
      equipped_items: [
        {
          slot: { type: "NECK", name: "Neck" },
          name: "Amulet",
          quality: { name: "Epic", type: "EPIC" },
          sockets: [
            { item: { name: "Gem A", id: 1 } },
            { item: { id: 2 } },
          ],
        },
      ],
    })[0];
    expect(mixed.socketsDisplay).toBe(
      "Gem A · -",
    );
    expect(mixed.socketError).toBe(true);
  });

  it("returns empty without equipped_items", () => {
    expect(mapEquipmentToItemCards({})).toEqual([]);
  });
});

describe("mapMythicProfileToOverview", () => {
  it("extracts summary and best_runs", () => {
    const { summary, runs } = mapMythicProfileToOverview({
      character: {
        name: "Flojob",
        realm: { name: "Emerald Dream" },
      },
      current_period: {
        period: { id: 1061 },
        best_runs: [
          {
            dungeon: { name: "Pit of Saron" },
            keystone_level: 11,
            keystone_affixes: [{ name: "Tyrannical" }],
            completed_timestamp: 1777739471000,
            duration: 1569524,
            is_completed_within_time: true,
            mythic_rating: { rating: 339.80157, color: { r: 255, g: 128, b: 0, a: 1 } },
          },
        ],
      },
      seasons: [{ id: 5 }, { id: 17 }],
      current_mythic_rating: {
        rating: 2775.6182,
        color: { r: 255, g: 128, b: 0, a: 1 },
      },
    });
    expect(summary?.periodId).toBe(1061);
    expect(summary?.seasonIds).toEqual([5, 17]);
    expect(summary?.currentRating).toBeCloseTo(2775.6182);
    expect(runs).toHaveLength(1);
    expect(runs[0].dungeon).toBe("Pit of Saron");
    expect(runs[0].keystoneLevel).toBe("+11");
    expect(runs[0].inTime).toBe("Yes");
    expect(runs[0].runRating).toBe("339.8");
  });
});

describe("mapSeasonDetailsToOverview", () => {
  it("extracts season header and runs", () => {
    const { header, runs } = mapSeasonDetailsToOverview({
      season: { id: 17 },
      mythic_rating: {
        rating: 2425.9739,
        color: { r: 163, g: 53, b: 238, a: 1 },
      },
      best_runs: [
        {
          dungeon: { name: "Dungeon" },
          keystone_level: 10,
          keystone_affixes: [],
          completed_timestamp: 1777737506000,
          duration: 1415950,
          is_completed_within_time: false,
        },
      ],
    });
    expect(header?.seasonId).toBe(17);
    expect(header?.mythicRating).toBeCloseTo(2425.9739);
    expect(runs).toHaveLength(1);
    expect(runs[0].inTime).toBe("No");
  });
});

describe("rgbaToCss", () => {
  it("normalizes alpha when a is 0-1", () => {
    expect(rgbaToCss({ r: 255, g: 0, b: 0, a: 1 })).toBe(
      "rgba(255, 0, 0, 1)",
    );
  });
});
