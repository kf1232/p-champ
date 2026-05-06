/** Normalized guild profile summary (Game Data `/data/wow/guild/{realm}/{guild}`) for UI. */

import { rgbaToCss, type RgbaColor } from "../character/characterOverviewViewModels";

export type GuildProfileCrestSwatch = {
  label: string;
  rgba: { r: number; g: number; b: number; a: number };
};

export type GuildProfileResourceLink = {
  label: string;
  href: string;
};

export type GuildProfileDisplayModel = {
  name: string | null;
  guildId: string | null;
  realmName: string | null;
  realmSlug: string | null;
  factionName: string | null;
  memberCount: number | null;
  achievementPoints: number | null;
  createdAtMs: number | null;
  selfHref: string | null;
  crestSwatches: GuildProfileCrestSwatch[];
  resourceLinks: GuildProfileResourceLink[];
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

function readRgba(
  colorBlock: Record<string, unknown> | null,
): { r: number; g: number; b: number; a: number } | null {
  if (!colorBlock) return null;
  const rgba = readRecord(colorBlock.rgba);
  if (!rgba) return null;
  const r = readFiniteNumber(rgba.r);
  const g = readFiniteNumber(rgba.g);
  const b = readFiniteNumber(rgba.b);
  const a = readFiniteNumber(rgba.a);
  if (r === null || g === null || b === null || a === null) return null;
  return { r, g, b, a };
}

function pushCrestSwatch(
  out: GuildProfileCrestSwatch[],
  label: string,
  colorBlock: unknown,
) {
  const rgba = readRgba(readRecord(colorBlock));
  if (rgba) out.push({ label, rgba });
}

function readResourceLink(
  root: Record<string, unknown>,
  key: string,
  label: string,
): GuildProfileResourceLink | null {
  const block = readRecord(root[key]);
  if (!block) return null;
  const href = readString(block.href);
  if (!href) return null;
  return { label, href };
}

/**
 * Maps a stored or live guild summary JSON object into display fields.
 * Returns `null` when the payload is not a guild-shaped object (e.g. API error envelope).
 */
export function mapGuildProfileSummaryToDisplay(
  body: unknown,
): GuildProfileDisplayModel | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const o = body as Record<string, unknown>;

  if (typeof o.message === "string" && !("id" in o)) {
    return null;
  }

  const name = readString(o.name);
  const idRaw = o.id;
  const guildId =
    typeof idRaw === "number" && Number.isFinite(idRaw)
      ? String(idRaw)
      : typeof idRaw === "string" && idRaw.length > 0
        ? idRaw
        : null;

  const realm = readRecord(o.realm);
  const realmName = realm ? readString(realm.name) : null;
  const realmSlug = realm ? readString(realm.slug) : null;

  const faction = readRecord(o.faction);
  const factionName = faction ? readString(faction.name) : null;

  const memberCount = readFiniteNumber(o.member_count);
  const achievementPoints = readFiniteNumber(o.achievement_points);
  const createdAtMs = readFiniteNumber(o.created_timestamp);

  const linksRoot = readRecord(o._links);
  let selfHref: string | null = null;
  if (linksRoot) {
    const self = readRecord(linksRoot.self);
    selfHref = self ? readString(self.href) : null;
  }

  const crestSwatches: GuildProfileCrestSwatch[] = [];
  const crest = readRecord(o.crest);
  if (crest) {
    const emblem = readRecord(crest.emblem);
    if (emblem) pushCrestSwatch(crestSwatches, "Emblem", emblem.color);
    const border = readRecord(crest.border);
    if (border) pushCrestSwatch(crestSwatches, "Border", border.color);
    const background = readRecord(crest.background);
    if (background) pushCrestSwatch(crestSwatches, "Background", background.color);
  }

  const resourceLinks: GuildProfileResourceLink[] = [];
  const achievements = readResourceLink(
    o,
    "achievements",
    "Achievements",
  );
  if (achievements) resourceLinks.push(achievements);
  const activity = readResourceLink(o, "activity", "Activity");
  if (activity) resourceLinks.push(activity);

  if (!name && !guildId) return null;

  return {
    name,
    guildId,
    realmName,
    realmSlug,
    factionName,
    memberCount,
    achievementPoints,
    createdAtMs,
    selfHref,
    crestSwatches,
    resourceLinks,
  };
}

/** CSS custom properties for `--guild-crest-*` from a guild summary JSON (profile card + roster). */
export type GuildCrestThemeCssVars = Record<string, string>;

export function getGuildCrestThemeCssVars(
  summaryBody: unknown,
): GuildCrestThemeCssVars | undefined {
  const model = mapGuildProfileSummaryToDisplay(summaryBody);
  if (!model?.crestSwatches.length) return undefined;
  const vars: GuildCrestThemeCssVars = {};
  for (const s of model.crestSwatches) {
    const css = rgbaToCss(s.rgba as RgbaColor);
    if (s.label === "Emblem") vars["--guild-crest-emblem"] = css;
    else if (s.label === "Border") vars["--guild-crest-border"] = css;
    else if (s.label === "Background") vars["--guild-crest-background"] = css;
  }
  return Object.keys(vars).length > 0 ? vars : undefined;
}
