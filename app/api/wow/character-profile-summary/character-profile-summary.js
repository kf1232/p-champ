/**
 * Battle.net WoW Profile API — Character Profile Summary (root resource).
 *
 * GET /profile/wow/character/{realmSlug}/{characterName}
 * Docs: https://develop.battle.net/documentation/world-of-warcraft/profile-apis
 */

import {
  getBattleNetClientCredentialsToken,
  WOW_API_HOST_BY_REGION,
  wowApiLocaleForRegion,
} from "@/lib/wow/battleNetClientCredentials";

import { CLIENT_ERROR } from "./constants.js";

/**
 * @param {{ region: string; realmSlug: string; characterName: string }} input
 * @returns {Promise<{ status: number; body: unknown }>}
 */
export async function getCharacterProfileSummary(input) {
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

  const namespace = `profile-${region}`;
  const locale = wowApiLocaleForRegion(region);
  const realmEnc = encodeURIComponent(String(input.realmSlug).toLowerCase());
  const nameEnc = encodeURIComponent(String(input.characterName).toLowerCase());
  const qs = new URLSearchParams({ namespace, locale });
  const url = `https://${host}/profile/wow/character/${realmEnc}/${nameEnc}?${qs}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const body = await res.json().catch(() => null);
  return { status: res.status, body };
}
