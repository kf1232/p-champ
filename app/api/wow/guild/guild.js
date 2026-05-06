/**
 * Battle.net WoW Game Data API — Guild.
 *
 * GET /data/wow/guild/{realmSlug}/{nameSlug}
 * Uses `namespace=profile-{region}` (matches Blizzard `self` links on this resource; `dynamic-*` can 404).
 * Docs: https://develop.battle.net/documentation/world-of-warcraft/game-data-api
 */

import {
  getBattleNetClientCredentialsToken,
  WOW_API_HOST_BY_REGION,
  wowApiLocaleForRegion,
} from "@/lib/wow/battleNetClientCredentials";

import { CLIENT_ERROR } from "./constants.js";

/**
 * @param {{
 *   region: string;
 *   realmSlug: string;
 *   nameSlug: string;
 *   namespace?: string;
 *   locale?: string;
 * }} input
 * @returns {Promise<{ status: number; body: unknown }>}
 */
export async function getGuild(input) {
  const region = String(input.region).toLowerCase();
  const host = WOW_API_HOST_BY_REGION[region];
  if (!host) {
    return {
      status: 400,
      body: { error: CLIENT_ERROR.UNSUPPORTED_REGION, region: input.region },
    };
  }

  const token = await getBattleNetClientCredentialsToken();
  if (!token) {
    return {
      status: 503,
      body: { error: CLIENT_ERROR.OAUTH_UNAVAILABLE },
    };
  }

  const namespace =
    typeof input.namespace === "string" && input.namespace.trim() !== ""
      ? input.namespace.trim()
      : `profile-${region}`;
  const locale =
    typeof input.locale === "string" && input.locale.trim() !== ""
      ? input.locale.trim()
      : wowApiLocaleForRegion(region);
  const realmEnc = encodeURIComponent(String(input.realmSlug).toLowerCase());
  const guildEnc = encodeURIComponent(String(input.nameSlug).toLowerCase());
  const qs = new URLSearchParams({ namespace, locale });
  const url = `https://${host}/data/wow/guild/${realmEnc}/${guildEnc}?${qs}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const body = await res.json().catch(() => null);
  return { status: res.status, body };
}
