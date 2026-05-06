/**
 * View models for the WoW character overview UI — pure mapping from Blizzard-shaped JSON.
 */

export type CharacterOverviewInfoRow = {
  label: string;
  value: string;
};

export type RgbaColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type CharacterOverviewItemCard = {
  slotLabel: string;
  slotType: string;
  itemName: string;
  qualityLabel: string;
  qualityType: string | null;
  /** `bonus_list_detail` entries with a non-empty `tag` (serverside omitted). */
  itemSource: string | null;
  /** `bonus_list_detail` entries with `itemLevel.amount` + `upgrade.fullName` (serverside omitted); `fullName` only. */
  itemStage: string | null;
  /** From `level.value` or `level.display_string`. */
  itemLevel: string;
  /** `enchantments[].display_string`, truncated before `|A`. */
  enchant: string | null;
  /** `set.item_set.name` when present. */
  itemSet: string | null;
  /** This slot must show non-empty enchant text (weapon / armor / rings per rules). */
  slotExpectsEnchant: boolean;
  /** Required enchant missing or empty after processing. */
  enchantError: boolean;
  /** Joined `sockets[].item.name` when `sockets` is a non-empty array; missing gems use the same placeholder as other empty fields. */
  socketsDisplay: string | null;
  /** At least one socket entry had no usable `item.name`. */
  socketError: boolean;
};

export type CharacterOverviewMythicSummary = {
  characterLine: string | null;
  periodId: number | null;
  seasonIds: number[];
  currentRating: number | null;
  currentRatingColor: RgbaColor | null;
};

export type CharacterOverviewMythicRunRow = {
  dungeon: string;
  keystoneLevel: string;
  affixes: string;
  completed: string;
  duration: string;
  inTime: string;
  runRating: string | null;
  runRatingColor: RgbaColor | null;
};

export type CharacterOverviewSeasonHeader = {
  seasonId: number | null;
  mythicRating: number | null;
  mythicRatingColor: RgbaColor | null;
};

/**
 * Blizzard `slot.type` values rendered on item cards, in display order.
 * Matches: Head, Neck, Shoulders, Chest, Waist, Legs, Feet, Wrist, Hands,
 * Ring 1–2, Trinket 1–2, Back, Main Hand, Off Hand. Any other slot is omitted.
 */
const ALLOWED_ITEM_CARD_SLOT_TYPES_ORDER: readonly string[] = [
  "HEAD",
  "NECK",
  "SHOULDER",
  "CHEST",
  "WAIST",
  "LEGS",
  "FEET",
  "WRIST",
  "HANDS",
  "FINGER_1",
  "FINGER_2",
  "TRINKET_1",
  "TRINKET_2",
  "BACK",
  "MAIN_HAND",
  "OFF_HAND",
];

const ALLOWED_ITEM_CARD_SLOT_TYPE_SET: ReadonlySet<string> = new Set(
  ALLOWED_ITEM_CARD_SLOT_TYPES_ORDER,
);

/**
 * Equipment slots that must have enchant data (Blizzard `slot.type`).
 * Maps: WEAPON → MAIN_HAND + OFF_HAND, BOOTS → FEET, RING 1/2 → FINGER_1/2,
 * plus HEAD, SHOULDERS (SHOULDER), CHEST, LEGS.
 */
const SLOT_TYPES_REQUIRING_ENCHANT: ReadonlySet<string> = new Set([
  "MAIN_HAND",
  "OFF_HAND",
  "WEAPON",
  "HEAD",
  "SHOULDER",
  "CHEST",
  "LEGS",
  "FEET",
  "FINGER_1",
  "FINGER_2",
]);

function slotSortIndex(slotType: string): number {
  const i = ALLOWED_ITEM_CARD_SLOT_TYPES_ORDER.indexOf(slotType);
  return i === -1 ? 999 : i;
}

function readString(o: unknown, key: string): string | null {
  if (!o || typeof o !== "object" || Array.isArray(o)) return null;
  const v = (o as Record<string, unknown>)[key];
  return typeof v === "string" && v.length > 0 ? v : null;
}

function readNumber(o: unknown, key: string): number | null {
  if (!o || typeof o !== "object" || Array.isArray(o)) return null;
  const v = (o as Record<string, unknown>)[key];
  if (typeof v === "number" && Number.isFinite(v)) return v;
  return null;
}

function readBool(o: unknown, key: string): boolean | null {
  if (!o || typeof o !== "object" || Array.isArray(o)) return null;
  const v = (o as Record<string, unknown>)[key];
  return typeof v === "boolean" ? v : null;
}

function readNested(
  o: unknown,
  path: readonly string[],
): Record<string, unknown> | null {
  let cur: unknown = o;
  for (const key of path) {
    if (!cur || typeof cur !== "object" || Array.isArray(cur)) return null;
    cur = (cur as Record<string, unknown>)[key];
  }
  if (!cur || typeof cur !== "object" || Array.isArray(cur)) return null;
  return cur as Record<string, unknown>;
}

function formatTimestampMs(ms: number | null): string {
  if (ms === null || !Number.isFinite(ms)) return "—";
  try {
    return new Date(ms).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "—";
  }
}

function formatRunDurationMs(ms: number | null): string {
  if (ms === null || !Number.isFinite(ms) || ms < 0) return "—";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

function parseRgba(o: unknown): RgbaColor | null {
  if (!o || typeof o !== "object" || Array.isArray(o)) return null;
  const r = readNumber(o, "r");
  const g = readNumber(o, "g");
  const b = readNumber(o, "b");
  const a = readNumber(o, "a");
  if (r === null || g === null || b === null || a === null) return null;
  return { r, g, b, a };
}

function formatRatingOneDecimal(n: number): string {
  return (Math.round(n * 10) / 10).toFixed(1);
}

/**
 * Strip WoW icon suffix from enchant `display_string` (everything from `|A` onward).
 */
function stripEnchantDisplayString(raw: string): string {
  const idx = raw.indexOf("|A");
  return (idx === -1 ? raw : raw.slice(0, idx)).trimEnd();
}

function formatEnchantmentsForCard(arr: unknown): string | null {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const parts: string[] = [];
  for (const el of arr) {
    if (!el || typeof el !== "object" || Array.isArray(el)) continue;
    const ds = (el as Record<string, unknown>).display_string;
    if (typeof ds !== "string" || ds.length === 0) continue;
    const cleaned = stripEnchantDisplayString(ds);
    if (cleaned.length > 0) parts.push(cleaned);
  }
  if (parts.length === 0) return null;
  return parts.join(" · ");
}

/** Hyphen placeholder for missing item-card text (enchant, socket gem, level, etc.). */
const ITEM_CARD_MISSING_DISPLAY = "-" as const;

function mapSocketsForItemCard(it: Record<string, unknown>): {
  socketsDisplay: string | null;
  socketError: boolean;
} {
  const sockets = it.sockets;
  if (!Array.isArray(sockets) || sockets.length === 0) {
    return { socketsDisplay: null, socketError: false };
  }
  const segments: string[] = [];
  let socketError = false;
  for (const entry of sockets) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      segments.push(ITEM_CARD_MISSING_DISPLAY);
      socketError = true;
      continue;
    }
    const sock = entry as Record<string, unknown>;
    const item = sock.item;
    const gemName =
      item &&
      typeof item === "object" &&
      !Array.isArray(item) &&
      typeof (item as Record<string, unknown>).name === "string" &&
      ((item as Record<string, unknown>).name as string).trim().length > 0
        ? ((item as Record<string, unknown>).name as string).trim()
        : null;
    if (gemName !== null) {
      segments.push(gemName);
    } else {
      segments.push(ITEM_CARD_MISSING_DISPLAY);
      socketError = true;
    }
  }
  return {
    socketsDisplay: segments.join(" · "),
    socketError,
  };
}

/**
 * Split `bonus_list_detail` into item card fields (explicit API shapes only).
 */
function parseBonusListForItemCard(arr: unknown): {
  itemSource: string | null;
  itemStage: string | null;
} {
  const tags: string[] = [];
  const stages: string[] = [];
  if (!Array.isArray(arr)) {
    return { itemSource: null, itemStage: null };
  }
  for (const entry of arr) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const e = entry as Record<string, unknown>;
    if (e.serverside === true) continue;

    const itemLevel = e.itemLevel;
    const upgrade = e.upgrade;
    const amountRaw =
      itemLevel &&
      typeof itemLevel === "object" &&
      !Array.isArray(itemLevel)
        ? (itemLevel as Record<string, unknown>).amount
        : undefined;
    const fullNameRaw =
      upgrade &&
      typeof upgrade === "object" &&
      !Array.isArray(upgrade)
        ? (upgrade as Record<string, unknown>).fullName
        : undefined;

    const hasUpgradeRow =
      typeof amountRaw === "number" &&
      Number.isFinite(amountRaw) &&
      typeof fullNameRaw === "string" &&
      fullNameRaw.trim().length > 0;

    if (hasUpgradeRow) {
      stages.push(fullNameRaw.trim());
      continue;
    }

    const tagRaw = e.tag;
    if (typeof tagRaw === "string" && tagRaw.trim().length > 0) {
      tags.push(tagRaw.trim());
    }
  }

  return {
    itemSource: tags.length > 0 ? tags.join(" · ") : null,
    itemStage: stages.length > 0 ? stages.join(" · ") : null,
  };
}

function mapKeystoneAffixNames(arr: unknown): string {
  if (!Array.isArray(arr)) return "";
  const names: string[] = [];
  for (const el of arr) {
    const n = readString(el, "name");
    if (n) names.push(n);
  }
  return names.join(" · ");
}

function mapBestRunRow(run: unknown): CharacterOverviewMythicRunRow | null {
  if (!run || typeof run !== "object" || Array.isArray(run)) return null;
  const r = run as Record<string, unknown>;
  const dungeon = readNested(r, ["dungeon"]);
  const dungeonName = dungeon ? readString(dungeon, "name") : null;
  const kl = readNumber(r, "keystone_level");
  const levelStr =
    kl !== null && Number.isFinite(kl) ? `+${Math.floor(kl)}` : "—";
  const affixes = mapKeystoneAffixNames(r.keystone_affixes);
  const ts = readNumber(r, "completed_timestamp");
  const dur = readNumber(r, "duration");
  const it = readBool(r, "is_completed_within_time");
  const mr = readNested(r, ["mythic_rating"]);
  let runRating: string | null = null;
  let runRatingColor: RgbaColor | null = null;
  if (mr) {
    const rating = readNumber(mr, "rating");
    if (rating !== null && Number.isFinite(rating)) {
      runRating = formatRatingOneDecimal(rating);
      runRatingColor = parseRgba(mr.color);
    }
  }
  return {
    dungeon: dungeonName ?? "—",
    keystoneLevel: levelStr,
    affixes: affixes || "—",
    completed: formatTimestampMs(ts),
    duration: formatRunDurationMs(dur),
    inTime: it === true ? "Yes" : it === false ? "No" : "—",
    runRating,
    runRatingColor,
  };
}

export function mapProfileSummaryToCharacterInfoRows(
  payload: unknown,
): CharacterOverviewInfoRow[] {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return [];
  }
  const p = payload as Record<string, unknown>;
  const rows: CharacterOverviewInfoRow[] = [];

  const name = readString(p, "name");
  if (name) rows.push({ label: "Name", value: name });

  const realm = readNested(p, ["realm"]);
  if (realm) {
    const rn = readString(realm, "name");
    const rs = readString(realm, "slug");
    if (rn && rs) {
      rows.push({ label: "Realm", value: `${rn} (${rs})` });
    } else if (rn) {
      rows.push({ label: "Realm", value: rn });
    } else if (rs) {
      rows.push({ label: "Realm", value: rs });
    }
  }

  const faction = readNested(p, ["faction"]);
  const factionName = faction ? readString(faction, "name") : null;
  if (factionName) rows.push({ label: "Faction", value: factionName });

  const race = readNested(p, ["race"]);
  const raceName = race ? readString(race, "name") : null;
  if (raceName) rows.push({ label: "Race", value: raceName });

  const cc = readNested(p, ["character_class"]);
  const className = cc ? readString(cc, "name") : null;
  if (className) rows.push({ label: "Class", value: className });

  const spec = readNested(p, ["active_spec"]);
  const specName = spec ? readString(spec, "name") : null;
  if (specName) rows.push({ label: "Specialization", value: specName });

  const level = readNumber(p, "level");
  if (level !== null) {
    rows.push({ label: "Level", value: String(Math.floor(level)) });
  }

  const avgIlvl = readNumber(p, "average_item_level");
  if (avgIlvl !== null) {
    rows.push({
      label: "Item level (avg)",
      value: String(Math.floor(avgIlvl)),
    });
  }

  const eqIlvl = readNumber(p, "equipped_item_level");
  if (eqIlvl !== null) {
    rows.push({
      label: "Item level (equipped)",
      value: String(Math.floor(eqIlvl)),
    });
  }

  const lastLogin = readNumber(p, "last_login_timestamp");
  if (lastLogin !== null) {
    rows.push({
      label: "Last login",
      value: formatTimestampMs(lastLogin),
    });
  }

  const at = readNested(p, ["active_title"]);
  if (at) {
    const ds = readString(at, "display_string");
    if (ds) {
      const charName = name ?? "";
      const titleLine = ds.replace(/\{name\}/gi, charName);
      rows.push({ label: "Active title", value: titleLine });
    }
  }

  const guild = readNested(p, ["guild"]);
  if (guild) {
    const gn = readString(guild, "name");
    const grealm = readNested(guild, ["realm"]);
    const grn = grealm ? readString(grealm, "name") : null;
    const gf = readNested(guild, ["faction"]);
    const gfn = gf ? readString(gf, "name") : null;
    const parts: string[] = [];
    if (gn) parts.push(gn);
    if (grn) parts.push(grn);
    let guildVal = parts.join(" · ");
    if (gfn) guildVal = guildVal ? `${guildVal} · ${gfn}` : gfn;
    if (guildVal) rows.push({ label: "Guild", value: guildVal });
  }

  return rows;
}

export function mapEquipmentToItemCards(
  payload: unknown,
): CharacterOverviewItemCard[] {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return [];
  }
  const equipped = (payload as Record<string, unknown>).equipped_items;
  if (!Array.isArray(equipped)) return [];

  const rows: CharacterOverviewItemCard[] = [];
  for (const raw of equipped) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const it = raw as Record<string, unknown>;
    const slot = readNested(it, ["slot"]);
    const slotType = slot ? readString(slot, "type") ?? "" : "";
    if (!ALLOWED_ITEM_CARD_SLOT_TYPE_SET.has(slotType)) continue;

    const slotLabel =
      (slot && readString(slot, "name")) ||
      (slotType ? slotType.replace(/_/g, " ") : ITEM_CARD_MISSING_DISPLAY);
    const itemName = readString(it, "name") ?? ITEM_CARD_MISSING_DISPLAY;
    const quality = readNested(it, ["quality"]);
    const qualityLabel =
      (quality && readString(quality, "name")) ||
      (quality && readString(quality, "type")) ||
      ITEM_CARD_MISSING_DISPLAY;
    const qualityType = quality ? readString(quality, "type") : null;
    const levelObj = readNested(it, ["level"]);
    let itemLevel: string = ITEM_CARD_MISSING_DISPLAY;
    if (levelObj) {
      const lv = readNumber(levelObj, "value");
      const lds = readString(levelObj, "display_string");
      if (lv !== null) itemLevel = String(Math.floor(lv));
      else if (lds) itemLevel = lds;
    }

    const { itemSource, itemStage } = parseBonusListForItemCard(
      it.bonus_list_detail,
    );
    const enchant = formatEnchantmentsForCard(it.enchantments);

    const itemSetObj = readNested(it, ["set", "item_set"]);
    const itemSet =
      itemSetObj !== null ? readString(itemSetObj, "name") : null;

    const slotExpectsEnchant = SLOT_TYPES_REQUIRING_ENCHANT.has(slotType);
    const hasEnchant =
      enchant !== null &&
      typeof enchant === "string" &&
      enchant.trim().length > 0;
    const enchantError = slotExpectsEnchant && !hasEnchant;

    const { socketsDisplay, socketError } = mapSocketsForItemCard(it);

    rows.push({
      slotLabel,
      slotType: slotType || slotLabel,
      itemName,
      qualityLabel,
      qualityType,
      itemSource,
      itemStage,
      itemLevel,
      enchant,
      itemSet,
      slotExpectsEnchant,
      enchantError,
      socketsDisplay,
      socketError,
    });
  }

  rows.sort((a, b) => {
    const ai = slotSortIndex(a.slotType);
    const bi = slotSortIndex(b.slotType);
    if (ai !== bi) return ai - bi;
    return a.slotLabel.localeCompare(b.slotLabel, undefined, {
      sensitivity: "base",
    });
  });

  return rows;
}

export function mapMythicProfileToOverview(payload: unknown): {
  summary: CharacterOverviewMythicSummary | null;
  runs: CharacterOverviewMythicRunRow[];
} {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { summary: null, runs: [] };
  }
  const p = payload as Record<string, unknown>;
  const char = readNested(p, ["character"]);
  let characterLine: string | null = null;
  if (char) {
    const cn = readString(char, "name");
    const cr = readNested(char, ["realm"]);
    const crn = cr ? readString(cr, "name") : null;
    if (cn && crn) characterLine = `${cn} · ${crn}`;
    else if (cn) characterLine = cn;
  }

  const cp = readNested(p, ["current_period"]);
  let periodId: number | null = null;
  if (cp) {
    const per = readNested(cp, ["period"]);
    if (per) {
      const pid = readNumber(per, "id");
      periodId = pid !== null ? Math.floor(pid) : null;
    }
  }

  const seasonsRaw = p.seasons;
  const seasonIds: number[] = [];
  if (Array.isArray(seasonsRaw)) {
    for (const s of seasonsRaw) {
      const id = readNumber(s, "id");
      if (id !== null && Number.isFinite(id)) seasonIds.push(Math.floor(id));
    }
  }

  let currentRating: number | null = null;
  let currentRatingColor: RgbaColor | null = null;
  const cmr = readNested(p, ["current_mythic_rating"]);
  if (cmr) {
    const r = readNumber(cmr, "rating");
    if (r !== null && Number.isFinite(r)) {
      currentRating = r;
      currentRatingColor = parseRgba(cmr.color);
    }
  }

  const summary: CharacterOverviewMythicSummary = {
    characterLine,
    periodId,
    seasonIds,
    currentRating,
    currentRatingColor,
  };

  const runs: CharacterOverviewMythicRunRow[] = [];
  if (cp) {
    const br = cp.best_runs;
    if (Array.isArray(br)) {
      for (const run of br) {
        const row = mapBestRunRow(run);
        if (row) runs.push(row);
      }
    }
  }

  return { summary, runs };
}

export function mapSeasonDetailsToOverview(payload: unknown): {
  header: CharacterOverviewSeasonHeader | null;
  runs: CharacterOverviewMythicRunRow[];
} {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { header: null, runs: [] };
  }
  const p = payload as Record<string, unknown>;
  const season = readNested(p, ["season"]);
  const seasonId =
    season && readNumber(season, "id") !== null
      ? Math.floor(readNumber(season, "id")!)
      : null;
  let mythicRating: number | null = null;
  let mythicRatingColor: RgbaColor | null = null;
  const mr = readNested(p, ["mythic_rating"]);
  if (mr) {
    const r = readNumber(mr, "rating");
    if (r !== null && Number.isFinite(r)) {
      mythicRating = r;
      mythicRatingColor = parseRgba(mr.color);
    }
  }
  const header: CharacterOverviewSeasonHeader = {
    seasonId,
    mythicRating,
    mythicRatingColor,
  };

  const runs: CharacterOverviewMythicRunRow[] = [];
  const br = p.best_runs;
  if (Array.isArray(br)) {
    for (const run of br) {
      const row = mapBestRunRow(run);
      if (row) runs.push(row);
    }
  }

  return { header, runs };
}

export function rgbaToCss({ r, g, b, a }: RgbaColor): string {
  const alpha = a <= 1 ? a : a / 255;
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
}
