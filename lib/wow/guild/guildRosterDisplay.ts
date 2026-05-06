import { formatPlayableClassLabel } from "./playableClassNames";
import { parseRegionFromBlizzardCharacterResourceId } from "../storage/wowServiceCharacterProfiles";

/** Guild roster (`/data/wow/guild/{realm}/{guild}/roster`) → table-friendly rows. */

export type GuildRosterMemberRow = {
  name: string;
  level: number | null;
  rank: number | null;
  classId: number | null;
  /** Resolved from {@link classId} via `wowClassSpecCatalog.json`. */
  classDisplayName: string;
  factionType: string | null;
  /** Battle.net profile `key.href` (optional; used to infer region). */
  profileHref: string | null;
  /** Realm slug for `/wow/character` query (from `character.realm.slug`). */
  characterRealmSlug: string | null;
  /** Lowercase region id parsed from `profileHref` (e.g. `us`). */
  characterLookupRegion: string | null;
};

export type GuildRosterDisplayModel = {
  guildName: string | null;
  guildRealm: string | null;
  guildFaction: string | null;
  rosterSelfHref: string | null;
  memberTotal: number;
  rows: GuildRosterMemberRow[];
};

function readRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readString(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0) return null;
  return value;
}

function readFiniteNumber(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value;
}

function readNestedId(obj: unknown): number | null {
  const r = readRecord(obj);
  if (!r) return null;
  return readFiniteNumber(r.id);
}

function readProfileHref(character: Record<string, unknown>): string | null {
  const key = readRecord(character.key);
  return key ? readString(key.href) : null;
}

function parseMemberEntry(entry: unknown): GuildRosterMemberRow | null {
  const row = readRecord(entry);
  if (!row) return null;
  const ch = readRecord(row.character);
  if (!ch) return null;
  const name = readString(ch.name);
  if (!name) return null;

  const rankRaw = row.rank;
  const rank =
    typeof rankRaw === "number" && Number.isFinite(rankRaw)
      ? rankRaw
      : typeof rankRaw === "string" && /^\d+$/.test(rankRaw)
        ? Number(rankRaw)
        : null;

  const faction = readRecord(ch.faction);
  const factionType = faction ? readString(faction.type) : null;

  const classId = readNestedId(ch.playable_class);
  const chRealm = readRecord(ch.realm);
  const characterRealmSlug = chRealm ? readString(chRealm.slug) : null;
  const profileHref = readProfileHref(ch);
  const characterLookupRegion = profileHref
    ? parseRegionFromBlizzardCharacterResourceId(profileHref)
    : null;

  return {
    name,
    level: readFiniteNumber(ch.level),
    rank,
    classId,
    classDisplayName: formatPlayableClassLabel(classId),
    factionType,
    profileHref,
    characterRealmSlug,
    characterLookupRegion,
  };
}

function compareRosterRows(a: GuildRosterMemberRow, b: GuildRosterMemberRow): number {
  const ra = a.rank ?? 9999;
  const rb = b.rank ?? 9999;
  if (ra !== rb) return ra - rb;
  return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
}

/**
 * Maps a guild roster API payload into a sorted member list for UI.
 * Returns `null` when the body is not roster-shaped (e.g. error envelope only).
 */
export function mapGuildRosterPayloadToDisplay(
  body: unknown,
): GuildRosterDisplayModel | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const o = body as Record<string, unknown>;

  if (typeof o.message === "string" && !Array.isArray(o.members)) {
    return null;
  }

  const membersRaw = o.members;
  if (!Array.isArray(membersRaw)) return null;

  const guildBlock = readRecord(o.guild);
  const guildName = guildBlock ? readString(guildBlock.name) : null;
  const realm = guildBlock ? readRecord(guildBlock.realm) : null;
  const guildRealm = realm ? readString(realm.name) : null;
  const gf = guildBlock ? readRecord(guildBlock.faction) : null;
  const guildFaction = gf ? readString(gf.name) ?? readString(gf.type) : null;

  const links = readRecord(o._links);
  const self = links ? readRecord(links.self) : null;
  const rosterSelfHref = self ? readString(self.href) : null;

  const rows: GuildRosterMemberRow[] = [];
  for (const entry of membersRaw) {
    const parsed = parseMemberEntry(entry);
    if (parsed) rows.push(parsed);
  }
  rows.sort(compareRosterRows);

  return {
    guildName,
    guildRealm,
    guildFaction,
    rosterSelfHref,
    memberTotal: rows.length,
    rows,
  };
}
