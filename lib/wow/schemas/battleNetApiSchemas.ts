/**
 * Zod runtime schemas for Battle.net JSON this app consumes.
 *
 * **Why:** The WoW Profile API returns large, evolving objects. These schemas
 * document and validate only the fields we read, with `.passthrough()` so
 * unknown Blizzard fields do not break parsing. If Blizzard changes a *type* we
 * rely on, `safeParse` fails loudly instead of failing silently.
 *
 * **Ground truth:** Run `npm run wow:sample-api` (uses `.env` credentials) to
 * print live responses for a sample character and refresh expectations.
 *
 * **Docs** (paths can move — cross-check the developer portal):
 * - Battle.net OAuth: `https://develop.battle.net/documentation/battle-net/oauth-apis`
 * - WoW Profile: `https://develop.battle.net/documentation/world-of-warcraft/profile-apis`
 *
 * **Live checks (US retail sample):** Root character JSON includes
 * `equipped_item_level`, `average_item_level`, `character_class`, and
 * `mythic_keystone_profile: { href }` — it does **not** include root `mythic_rating`.
 * Season rating is on `GET .../mythic-keystone-profile/season/{id}` as root
 * `mythic_rating: { color?, rating }` and `best_runs` (per-dungeon bests for the season).
 */
import { type ZodError, z } from "zod";

/**
 * `mythic_rating` object shape from Profile API (when present), e.g. keystone season.
 * May include a `color` object for UI — we only use `rating` in app code.
 */
export const blizzardMythicRatingObjectSchema = z
  .object({
    rating: z.number().optional(),
    color: z
      .object({
        r: z.number(),
        g: z.number(),
        b: z.number(),
        a: z.number(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

export type BlizzardMythicRatingObject = z.infer<
  typeof blizzardMythicRatingObjectSchema
>;

/**
 * `GET /profile/wow/character/{realm}/{character}?namespace=profile-*`
 *
 * Blizzard returns many keys; we validate typing for fields we read. Root body
 * exposes item levels and class; M+ summary rating is usually **not** here — see
 * `mythic_keystone_profile.href` and the keystone season resource. Root `name` matches
 * the in-game character when present.
 */
export const blizzardCharacterProfileSummarySchema = z
  .object({
    /** Display name — same resource used for ilvl/class. */
    name: z.string().optional(),
    equipped_item_level: z.number().optional(),
    average_item_level: z.number().optional(),
    character_class: z
      .object({
        name: z.string().optional(),
        id: z.number().optional(),
      })
      .passthrough()
      .optional(),
    mythic_rating: blizzardMythicRatingObjectSchema.optional(),
    mythic_keystone_profile: z
      .object({
        href: z.string(),
      })
      .passthrough()
      .optional(),
    _links: z.unknown().optional(),
  })
  .passthrough();

export type BlizzardCharacterProfileSummary = z.infer<
  typeof blizzardCharacterProfileSummarySchema
>;

/**
 * Successful `POST https://oauth.battle.net/token` (client_credentials).
 */
export const battleNetOAuthTokenSuccessSchema = z
  .object({
    access_token: z.string().min(1),
    token_type: z.string().optional(),
    expires_in: z.number().int().nonnegative().optional(),
    scope: z.string().optional(),
  })
  .passthrough();

export type BattleNetOAuthTokenSuccess = z.infer<
  typeof battleNetOAuthTokenSuccessSchema
>;

/**
 * `GET .../mythic-keystone-profile/season/{seasonId}?namespace=profile-*`
 * Root includes `season`, `mythic_rating`, `best_runs`, `character`, `_links`.
 */
export const blizzardMythicKeystoneSeasonProfileSchema = z
  .object({
    season: z
      .object({
        id: z.number().optional(),
      })
      .passthrough()
      .optional(),
    mythic_rating: blizzardMythicRatingObjectSchema.optional(),
    best_runs: z.array(z.unknown()).optional(),
    character: z.unknown().optional(),
    _links: z.unknown().optional(),
  })
  .passthrough();

export type BlizzardMythicKeystoneSeasonProfile = z.infer<
  typeof blizzardMythicKeystoneSeasonProfileSchema
>;

/** One row from `best_runs` on the season keystone profile (Profile API). */
const mythicKeystoneBestRunEntrySchema = z
  .object({
    keystone_level: z.number().optional(),
    is_completed_within_time: z.boolean().optional(),
    dungeon: z
      .object({
        name: z.string().optional(),
        id: z.number().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

export type WowMythicBestRunForDisplay = {
  readonly dungeonName: string;
  /** Journal instance id when API provides it — optional map in `mythicDungeonShortLabel.ts`. */
  readonly dungeonId?: number;
  readonly keystoneLevel: number;
  readonly completedInTime: boolean;
};

/**
 * Maps `best_runs` from `GET .../mythic-keystone-profile/season/{id}` into UI rows
 * (same underlying data as the armory mythic keystone page).
 */
export function mythicBestRunsForDisplayFromSeason(
  data: BlizzardMythicKeystoneSeasonProfile,
): WowMythicBestRunForDisplay[] {
  const raw = data.best_runs;
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: WowMythicBestRunForDisplay[] = [];
  for (const item of raw) {
    const parsed = mythicKeystoneBestRunEntrySchema.safeParse(item);
    if (!parsed.success) {
      continue;
    }
    const lvl = parsed.data.keystone_level;
    if (typeof lvl !== "number" || Number.isNaN(lvl)) {
      continue;
    }
    const name = parsed.data.dungeon?.name?.trim() || "Dungeon";
    const did = parsed.data.dungeon?.id;
    out.push({
      dungeonName: name,
      dungeonId: typeof did === "number" && !Number.isNaN(did) ? did : undefined,
      keystoneLevel: lvl,
      completedInTime: parsed.data.is_completed_within_time === true,
    });
  }
  out.sort(
    (a, b) =>
      b.keystoneLevel - a.keystoneLevel ||
      a.dungeonName.localeCompare(b.dungeonName),
  );
  return out;
}

/**
 * `GET /data/wow/mythic-keystone/season/index?namespace=dynamic-*`
 * — used to resolve the active season id for Profile keystone calls.
 */
export const mythicKeystoneSeasonIndexSchema = z
  .object({
    _links: z.unknown().optional(),
    current_season: z
      .object({
        id: z.number().optional(),
        key: z
          .object({
            href: z.string(),
          })
          .passthrough()
          .optional(),
      })
      .passthrough()
      .optional(),
    seasons: z
      .array(
        z
          .object({
            id: z.number().optional(),
          })
          .passthrough(),
      )
      .optional(),
  })
  .passthrough();

export type MythicKeystoneSeasonIndex = z.infer<
  typeof mythicKeystoneSeasonIndexSchema
>;

function mythicSeasonIdFromHref(href: string): number | null {
  const m = /\/mythic-keystone\/season\/(\d+)/.exec(href);
  if (!m) {
    return null;
  }
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

/** Prefer `current_season.id`; else parse `current_season.key.href`; else max `seasons[].id`. */
export function mythicSeasonIdFromIndex(data: MythicKeystoneSeasonIndex): number | null {
  const cs = data.current_season;
  if (cs) {
    if (typeof cs.id === "number" && !Number.isNaN(cs.id)) {
      return cs.id;
    }
    const href = cs.key?.href;
    if (typeof href === "string") {
      const fromHref = mythicSeasonIdFromHref(href);
      if (fromHref !== null) {
        return fromHref;
      }
    }
  }
  const ids =
    data.seasons
      ?.map((s) => s.id)
      .filter((id): id is number => typeof id === "number" && !Number.isNaN(id)) ?? [];
  if (ids.length === 0) {
    return null;
  }
  return Math.max(...ids);
}

export function formatZodErrorBrief(err: ZodError): string {
  return err.issues
    .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("; ");
}
