/**
 * Short labels for Mythic+ dungeon chips (Profile API `dungeon.name`, optional `dungeon.id`).
 * Extend `SHORT_BY_DUNGEON_ID` using ids from `npm run wow:sample-api` when you want
 * locale-proof labels. Unknown names fall back to a compact acronym.
 */

/** Blizzard `dungeon.id` on keystone `best_runs` (journal instance id) → chip heading. */
const SHORT_BY_DUNGEON_ID: Readonly<Record<number, string>> = {};

/** Normalized en_US `dungeon.name` → chip heading. */
const SHORT_BY_DUNGEON_NAME: Readonly<Record<string, string>> = {
  "mists of tirna scithe": "Mists",
  "the necrotic wake": "NW",
  "de other side": "DOS",
  "halls of atonement": "HoA",
  "theater of pain": "ToP",
  "sanguine depths": "SD",
  "spires of ascension": "SoA",
  "plaguefall": "PF",
  "ruby life pools": "RLP",
  "the nokhud offensive": "NO",
  "the azure vault": "AV",
  "uldaman: legacy of tyr": "Uldaman",
  "brackenhide hollow": "Bracken",
  "halls of infusion": "HoI",
  "algeth'ar academy": "AA",
  "neltharus": "Nelth",
  "freehold": "FH",
  "atal'dazar": "AD",
  "waycrest manor": "WM",
  "the underrot": "UR",
  "tol dagor": "TD",
  "shrine of the storm": "SotS",
  "siege of boralus": "SoB",
  "the motherlode!!": "ML",
  "the motherlode": "ML",
  "mechagon workshop": "Workshop",
  "operation: mechagon - workshop": "Workshop",
  "grim batol": "GB",
  "black rook hold": "BRH",
  "everbloom": "EB",
  "throne of the tides": "ToT",
  "ara-kara, city of echoes": "Ara-Kara",
  "city of threads": "Threads",
  "the stonevault": "Stonevault",
  "the dawnbreaker": "Dawnbreaker",
  "cinderbrew meadery": "Cinderbrew",
  "darkflame cleft": "Cleft",
  "priory of the sacred flame": "Priory",
  "the rookery": "Rookery",
  "operation: floodgate": "Floodgate",
  "operation: floodgate!!": "Floodgate",
  "seat of the triumvirate": "SoT",
  "pit of saron": "PoS",
  "skyreach": "Skyreach",
  "magister's terrace": "MT",
};

function normalizeDungeonName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[""]/g, '"');
}

function acronymShortLabel(fullName: string): string {
  const cleaned = fullName.replace(/['']/g, " ");
  const STOP = new Set([
    "the",
    "of",
    "a",
    "an",
    "and",
    "in",
    "on",
    "for",
    "to",
  ]);
  const words = cleaned
    .split(/[\s\-–—,:]+/)
    .map((w) => w.replace(/[^a-z0-9']/gi, ""))
    .filter((w) => w.length > 0);
  const sig = words.filter((w) => !STOP.has(w.toLowerCase()));
  if (sig.length === 0) {
    return fullName.length <= 7 ? fullName : `${fullName.slice(0, 6)}…`;
  }
  if (sig.length === 1) {
    const w = sig[0];
    return w.length <= 8 ? w : `${w.slice(0, 7)}…`;
  }
  const acronym = sig
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 4);
  return acronym.length >= 2 ? acronym : sig[0].slice(0, 6);
}

/**
 * Heading text for a keystone chip (short). Use `dungeonName` for `title` / tooltips.
 */
export function mythicDungeonChipShortLabel(
  dungeonName: string,
  dungeonId?: number,
): string {
  const trimmed = dungeonName.trim();
  if (!trimmed) {
    return "…";
  }
  if (typeof dungeonId === "number" && !Number.isNaN(dungeonId)) {
    const byId = SHORT_BY_DUNGEON_ID[dungeonId];
    if (byId) {
      return byId;
    }
  }
  const key = normalizeDungeonName(trimmed);
  const byName = SHORT_BY_DUNGEON_NAME[key];
  if (byName) {
    return byName;
  }
  return acronymShortLabel(trimmed);
}
