/**
 * Battle.net OAuth (client credentials) + regional WoW API hosts.
 * Server-only. Env: `BATTLENET_CLIENT_ID`, `BATTLENET_CLIENT_SECRET` (see `.env.example`).
 * https://develop.battle.net/documentation/guides/using-oauth/client-credentials-flow
 */

const OAUTH_TOKEN_URL = "https://oauth.battle.net/token";

/** Regional hostname for `https://{host}/profile/...` and `/data/wow/...`. */
export const WOW_API_HOST_BY_REGION: Readonly<Record<string, string>> = {
  us: "us.api.blizzard.com",
  eu: "eu.api.blizzard.com",
  kr: "kr.api.blizzard.com",
  tw: "tw.api.blizzard.com",
  cn: "gateway.battlenet.com.cn",
};

const LOCALE_BY_REGION: Readonly<Record<string, string>> = {
  us: "en_US",
  eu: "en_GB",
  kr: "ko_KR",
  tw: "zh_TW",
  cn: "zh_CN",
};

export function wowApiLocaleForRegion(region: string): string {
  return LOCALE_BY_REGION[region.toLowerCase()] ?? "en_US";
}

/** Returns a bearer access token, or `null` if env is missing or token exchange fails. */
export async function getBattleNetClientCredentialsToken(): Promise<string | null> {
  const id = process.env.BATTLENET_CLIENT_ID?.trim();
  const secret = process.env.BATTLENET_CLIENT_SECRET?.trim();
  if (!id || !secret) {
    return null;
  }

  const credentials = Buffer.from(`${id}:${secret}`, "utf8").toString("base64");

  const res = await fetch(OAUTH_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as { access_token?: unknown };
  return typeof data.access_token === "string" ? data.access_token : null;
}
