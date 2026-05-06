/**
 * Battle.net WoW Profile API — Character Equipment Summary.
 *
 * GET /profile/wow/character/{realmSlug}/{characterName}/equipment
 * Docs: https://develop.battle.net/documentation/world-of-warcraft/profile-apis
 */

import {
  getBattleNetClientCredentialsToken,
  WOW_API_HOST_BY_REGION,
  wowApiLocaleForRegion,
} from "@/lib/wow/battleNetClientCredentials";

import { CLIENT_ERROR } from "./constants.js";
import { applyBonusListDetailsToEquipmentBody } from "./character-equipment-bonus-list-enrich.js";
import { getCharacterEquipmentBonusListMap } from "./character-equipment-bonus-list-map.js";

/**
 * @param {{
 *   region: string;
 *   realmSlug: string;
 *   characterName: string;
 *   namespace?: string;
 *   locale?: string;
 * }} input
 * @returns {Promise<{ status: number; body: unknown }>}
 */
export async function getCharacterEquipment(input) {
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
  const nameEnc = encodeURIComponent(
    String(input.characterName).toLowerCase(),
  );
  const qs = new URLSearchParams({ namespace, locale });
  const url = `https://${host}/profile/wow/character/${realmEnc}/${nameEnc}/equipment?${qs}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const body = await res.json().catch(() => null);
  if (res.ok && body && typeof body === "object" && !Array.isArray(body)) {
    applyBonusListDetailsToEquipmentBody(
      body,
      getCharacterEquipmentBonusListMap(),
    );
  }
  return { status: res.status, body };
}
