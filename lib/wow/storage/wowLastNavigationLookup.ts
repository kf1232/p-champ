/**

 * Remembers the last successful character / guild lookup so revisiting

 * `/wow/character` or `/wow/guild` without query params can restore the form

 * and cached payloads from `WowServiceStorageProvider`.

 */



import { APP_STORAGE_KEYS, appLocalStorage } from "@/lib/storage";



import {

  WOW_PROFILE_API_REGIONS,

  type WowProfileApiRegionId,

} from "../battle-net/battleNetProfileRegions";



export const WOW_LAST_CHARACTER_LOOKUP_STORAGE_KEY =

  APP_STORAGE_KEYS.wowLastCharacterLookup;



export const WOW_LAST_GUILD_LOOKUP_STORAGE_KEY =

  APP_STORAGE_KEYS.wowLastGuildLookup;



export type WowLastCharacterLookup = {

  region: WowProfileApiRegionId;

  realmSlug: string;

  characterName: string;

};



export type WowLastGuildLookup = {

  region: WowProfileApiRegionId;

  realmSlug: string;

  nameSlug: string;

};



function isWowProfileRegionId(value: string): value is WowProfileApiRegionId {

  return WOW_PROFILE_API_REGIONS.some((r) => r.value === value);

}



function readJson(raw: string | null): unknown {

  if (!raw) return null;

  try {

    return JSON.parse(raw) as unknown;

  } catch {

    return null;

  }

}



export function readLastCharacterLookup(): WowLastCharacterLookup | null {

  const raw = appLocalStorage(

    APP_STORAGE_KEYS.wowLastCharacterLookup,

  ).read();

  const parsed = readJson(raw);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {

    return null;

  }

  const o = parsed as Record<string, unknown>;

  const region = o.region;

  const realmSlug =

    typeof o.realmSlug === "string" ? o.realmSlug.trim() : "";

  const characterName =

    typeof o.characterName === "string" ? o.characterName.trim() : "";

  if (

    typeof region !== "string" ||

    !isWowProfileRegionId(region) ||

    !realmSlug ||

    !characterName

  ) {

    return null;

  }

  return { region, realmSlug, characterName };

}



export function writeLastCharacterLookup(

  entry: WowLastCharacterLookup,

): void {

  const realmSlug = entry.realmSlug.trim();

  const characterName = entry.characterName.trim();

  if (!realmSlug || !characterName) return;

  if (!isWowProfileRegionId(entry.region)) return;

  appLocalStorage(APP_STORAGE_KEYS.wowLastCharacterLookup).write(

    JSON.stringify({

      region: entry.region,

      realmSlug,

      characterName,

    }),

  );

}



export function readLastGuildLookup(): WowLastGuildLookup | null {

  const raw = appLocalStorage(APP_STORAGE_KEYS.wowLastGuildLookup).read();

  const parsed = readJson(raw);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {

    return null;

  }

  const o = parsed as Record<string, unknown>;

  const region = o.region;

  const realmSlug =

    typeof o.realmSlug === "string" ? o.realmSlug.trim() : "";

  const nameSlug =

    typeof o.nameSlug === "string" ? o.nameSlug.trim() : "";

  if (

    typeof region !== "string" ||

    !isWowProfileRegionId(region) ||

    !realmSlug ||

    !nameSlug

  ) {

    return null;

  }

  return { region, realmSlug, nameSlug };

}



export function writeLastGuildLookup(entry: WowLastGuildLookup): void {

  const realmSlug = entry.realmSlug.trim();

  const nameSlug = entry.nameSlug.trim();

  if (!realmSlug || !nameSlug) return;

  if (!isWowProfileRegionId(entry.region)) return;

  appLocalStorage(APP_STORAGE_KEYS.wowLastGuildLookup).write(

    JSON.stringify({

      region: entry.region,

      realmSlug,

      nameSlug,

    }),

  );

}

