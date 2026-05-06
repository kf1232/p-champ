/**
 * Battle.net WoW Game Data — GET /data/wow/search/realm (full index, no name filter).
 * Merges all pages into one body.
 */

import {
  getBattleNetClientCredentialsToken,
  WOW_API_HOST_BY_REGION,
  wowApiLocaleForRegion,
} from "@/lib/wow/battle-net/battleNetClientCredentials";

import { CLIENT_ERROR } from "./constants.js";

/**
 * @param {unknown} body
 * @returns {number}
 */
function readTotalPages(body) {
  if (!body || typeof body !== "object") return 1;
  const n = Number(/** @type {{ pageCount?: unknown }} */ (body).pageCount);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(100, Math.trunc(n));
}

/**
 * @param {unknown} body
 * @returns {unknown[]}
 */
function readResultsArray(body) {
  if (!body || typeof body !== "object") return [];
  const r = /** @type {{ results?: unknown }} */ (body).results;
  return Array.isArray(r) ? r : [];
}

/**
 * @param {string} host
 * @param {string} token
 * @param {string} namespace
 * @param {string} locale
 * @param {number} page
 * @returns {Promise<{ status: number; body: unknown }>}
 */
async function fetchRealmsIndexPage(host, token, namespace, locale, page) {
  const qs = new URLSearchParams();
  qs.set("namespace", namespace);
  qs.set("locale", locale);
  qs.set("orderby", "name");
  qs.set("_page", String(page));
  const url = `https://${host}/data/wow/search/realm?${qs}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const rawBody = await res.json().catch(() => null);
  return { status: res.status, body: rawBody };
}

/**
 * @param {{ region: string }} input
 * @returns {Promise<{ status: number; body: unknown }>}
 */
export async function getRealmsIndex(input) {
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

  const locale = wowApiLocaleForRegion(region);
  const namespace = `dynamic-${region}`;

  const first = await fetchRealmsIndexPage(
    host,
    token,
    namespace,
    locale,
    1,
  );

  if (first.status !== 200 || !first.body || typeof first.body !== "object") {
    return { status: first.status, body: first.body };
  }

  const totalPages = readTotalPages(first.body);
  const mergedResults = [...readResultsArray(first.body)];

  for (let p = 2; p <= totalPages; p++) {
    const next = await fetchRealmsIndexPage(
      host,
      token,
      namespace,
      locale,
      p,
    );
    if (next.status !== 200 || !next.body || typeof next.body !== "object") {
      break;
    }
    mergedResults.push(...readResultsArray(next.body));
  }

  const base = /** @type {Record<string, unknown>} */ (first.body);
  const out = {
    ...base,
    results: mergedResults,
    page: 1,
    pageCount: 1,
    pageSize: mergedResults.length,
  };

  return { status: 200, body: out };
}
