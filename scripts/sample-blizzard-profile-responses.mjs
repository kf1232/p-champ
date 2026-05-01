/**
 * One-off / diagnostic: GET Battle.net WoW Profile + Game Data responses using
 * BATTLENET_CLIENT_ID / BATTLENET_CLIENT_SECRET from `.env` (does not print secrets).
 * Usage: node scripts/sample-blizzard-profile-responses.mjs [region] [realm] [character]
 *
 * Use output to verify Zod schemas in `lib/wow/schemas/battleNetApiSchemas.ts`.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadDotEnv() {
  const p = path.join(root, ".env");
  if (!fs.existsSync(p)) {
    return {};
  }
  const text = fs.readFileSync(p, "utf8");
  const out = {};
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) {
      continue;
    }
    const eq = t.indexOf("=");
    if (eq <= 0) {
      continue;
    }
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[k] = v;
  }
  return out;
}

const HOST_BY_REGION = {
  us: "us.api.blizzard.com",
  eu: "eu.api.blizzard.com",
  kr: "kr.api.blizzard.com",
  tw: "tw.api.blizzard.com",
};

async function main() {
  const env = { ...loadDotEnv(), ...process.env };
  const id = env.BATTLENET_CLIENT_ID;
  const secret = env.BATTLENET_CLIENT_SECRET;
  if (!id || !secret) {
    console.error("Missing BATTLENET_CLIENT_ID / BATTLENET_CLIENT_SECRET in .env");
    process.exit(1);
  }

  const region = (process.argv[2] || "us").toLowerCase();
  const realm = process.argv[3] || "emerald-dream";
  const character = process.argv[4] || "flojob";

  const host = HOST_BY_REGION[region];
  if (!host) {
    console.error("Unsupported region:", region);
    process.exit(1);
  }

  const basic = Buffer.from(`${id}:${secret}`).toString("base64");
  const tokRes = await fetch("https://oauth.battle.net/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });
  const tokJson = await tokRes.json().catch(() => ({}));
  if (!tokRes.ok) {
    console.error("Token request failed", tokRes.status, tokJson);
    process.exit(1);
  }
  const token = tokJson.access_token;

  const locale =
    region === "eu" ? "en_GB" : "en_US";

  const profileQs = new URLSearchParams({
    namespace: `profile-${region}`,
    locale,
  });
  const realmEnc = encodeURIComponent(realm.toLowerCase());
  const nameEnc = encodeURIComponent(character.toLowerCase());

  const charUrl = `https://${host}/profile/wow/character/${realmEnc}/${nameEnc}?${profileQs}`;
  const charRes = await fetch(charUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const charBody = await charRes.json().catch(() => ({}));

  console.log("=== GET character profile (root resource) ===");
  console.log("URL pattern: /profile/wow/character/{realm}/{name}");
  console.log("HTTP", charRes.status);
  console.log(JSON.stringify(charBody, null, 2));

  const idxQs = new URLSearchParams({
    namespace: `dynamic-${region}`,
    locale,
  });
  const idxUrl = `https://${host}/data/wow/mythic-keystone/season/index?${idxQs}`;
  const idxRes = await fetch(idxUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const idxBody = await idxRes.json().catch(() => ({}));

  console.log("\n=== GET mythic-keystone season index (Game Data) ===");
  console.log("URL pattern: /data/wow/mythic-keystone/season/index");
  console.log("HTTP", idxRes.status);
  console.log(JSON.stringify(idxBody, null, 2));

  let seasonId = idxBody?.current_season?.id;
  const href = idxBody?.current_season?.key?.href;
  if (seasonId == null && typeof href === "string") {
    const m = /\/mythic-keystone\/season\/(\d+)/.exec(href);
    if (m) {
      seasonId = Number(m[1]);
    }
  }
  if (seasonId == null && Array.isArray(idxBody?.seasons)) {
    const ids = idxBody.seasons
      .map((s) => s?.id)
      .filter((x) => typeof x === "number");
    if (ids.length) {
      seasonId = Math.max(...ids);
    }
  }

  if (seasonId == null) {
    console.log("\n(no season id resolved — skipping keystone season profile)");
    return;
  }

  const seasonQs = new URLSearchParams({
    namespace: `profile-${region}`,
    locale,
  });
  const seasonUrl = `https://${host}/profile/wow/character/${realmEnc}/${nameEnc}/mythic-keystone-profile/season/${seasonId}?${seasonQs}`;
  const seasonRes = await fetch(seasonUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const seasonBody = await seasonRes.json().catch(() => ({}));

  console.log("\n=== GET mythic-keystone-profile season (Profile) ===");
  console.log(
    "URL pattern: /profile/wow/character/{realm}/{name}/mythic-keystone-profile/season/{seasonId}",
  );
  console.log("HTTP", seasonRes.status);
  console.log(JSON.stringify(seasonBody, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
