"use client";

import "./character-lookup.css";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { useSearchParams } from "next/navigation";

import { useWowCacheRailViewportInset } from "@/components/wow/hooks/useWowCacheRailViewportInset";
import { useWowServiceStorage } from "@/components/wow/components/providers/WowServiceStorageProvider";
import { CharacterOverviewSegments } from "../overview";
import {
  RealmSlugPicker,
  WowRawJsonDataPanel,
} from "@/components/wow/components/common";
import {
  CHARACTER_PROFILE_SUMMARY_API_PATH,
  CHARACTER_PROFILE_SUMMARY_QUERY,
} from "@/lib/wow/api/characterProfileSummaryApi";
import {
  type WowServiceStoredData,
  WOW_SERVICE_CHARACTER_PROFILES_KEY,
  extractCharacterProfileSummaryId,
  findStoredCharacterProfileSummary,
  findStoredCharacterEquipment,
  findStoredCharacterMythicKeystoneProfile,
  findStoredCharacterMythicKeystoneSeasonDetails,
  extractCharacterProfileSummaryStripFields,
  extractCharacterProfileSummaryStripFormPick,
  hasStoredCharacterEquipmentForSummaryId,
  hasStoredCharacterMythicKeystoneForSummaryId,
  hasStoredCharacterMythicKeystoneSeasonDetailsForSummaryId,
  makeCharacterProfileLookupKey,
  mergeCharacterProfileSummaryIntoWowServiceData,
  mergeCharacterEquipmentIntoWowServiceData,
  mergeCharacterMythicKeystoneProfileIntoWowServiceData,
  mergeCharacterMythicKeystoneSeasonDetailsIntoWowServiceData,
  readLastCharacterLookup,
  writeLastCharacterLookup,
} from "@/lib/wow";
import { CHARACTER_EQUIPMENT_API_PATH } from "@/lib/wow/api/characterEquipmentApi";
import { CHARACTER_MYTHIC_KEYSTONE_PROFILE_API_PATH } from "@/lib/wow/api/characterMythicKeystoneProfileApi";
import {
  CHARACTER_MYTHIC_KEYSTONE_DEFAULT_SEASON_ID,
  CHARACTER_MYTHIC_KEYSTONE_SEASON_DETAILS_API_PATH,
  CHARACTER_MYTHIC_KEYSTONE_SEASON_DETAILS_QUERY,
} from "@/lib/wow/api/characterMythicKeystoneSeasonDetailsApi";
import {
  WOW_PROFILE_API_REGIONS,
  type WowProfileApiRegionId,
} from "@/lib/wow/battle-net/battleNetProfileRegions";

type RemoteResult =
  | { lookupKey: string; kind: "not-found" }
  | {
      lookupKey: string;
      kind: "success-remote";
      profile: unknown;
      equipment: unknown | null;
      equipmentError: string | null;
      mythic: unknown | null;
      mythicError: string | null;
      seasonDetails: unknown | null;
      seasonDetailsError: string | null;
    };

function currentLookupKey(
  region: WowProfileApiRegionId,
  realmSlug: string,
  characterName: string,
): string | null {
  const realm = realmSlug.trim();
  const name = characterName.trim();
  if (!realm || !name) return null;
  return makeCharacterProfileLookupKey(region, realm, name);
}

function isWowProfileRegionId(value: string): value is WowProfileApiRegionId {
  return WOW_PROFILE_API_REGIONS.some((r) => r.value === value);
}

function buildCharacterProfileQueryParams(
  region: WowProfileApiRegionId,
  realmSlug: string,
  characterName: string,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set(
    CHARACTER_PROFILE_SUMMARY_QUERY.region,
    region.toLowerCase(),
  );
  params.set(
    CHARACTER_PROFILE_SUMMARY_QUERY.realmSlug,
    realmSlug.trim(),
  );
  params.set(
    CHARACTER_PROFILE_SUMMARY_QUERY.characterName,
    characterName.trim(),
  );
  return params;
}

function LookupHistoryIconMythic() {
  return (
    <svg
      className="character-lookup-history-icon-svg"
      viewBox="0 0 20 20"
      width={18}
      height={18}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M10 2.5 13.5 8H6.5L10 2.5Zm-6 6h12L10 17.5 4 8.5Z"
      />
    </svg>
  );
}

function LookupHistoryIconEquipment() {
  return (
    <svg
      className="character-lookup-history-icon-svg"
      viewBox="0 0 20 20"
      width={18}
      height={18}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M10 3c-2.5 0-4.5 1.6-4.5 3.5V9c0 .5.2 1 .5 1.4L6 16h8l.5-5.6c.3-.4.5-.9.5-1.4V6.5C15 4.6 13 3 10 3Zm0 2c1.4 0 2.5.7 2.5 1.5V8H7.5V6.5C7.5 5.7 8.6 5 10 5Z"
      />
    </svg>
  );
}

function LookupHistoryIconSeason() {
  return (
    <svg
      className="character-lookup-history-icon-svg"
      viewBox="0 0 20 20"
      width={18}
      height={18}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M5 4h10v2H5V4Zm0 3.5h10v2H5v-2Zm0 3.5h6v2H5v-2Zm7 0h3v6H5v-2h7v-4Z"
      />
    </svg>
  );
}

/** One row per cached character profile in lookup history. */
function CharacterLookupHistoryStripRecord({
  data,
  payload,
  onDoubleClickPick,
}: {
  data: WowServiceStoredData;
  payload: unknown;
  onDoubleClickPick: () => void;
}) {
  const { name, characterClassName, level } =
    extractCharacterProfileSummaryStripFields(payload);
  const summaryId = extractCharacterProfileSummaryId(payload);
  const mythicCached =
    summaryId !== null &&
    hasStoredCharacterMythicKeystoneForSummaryId(data, summaryId);
  const equipmentCached =
    summaryId !== null &&
    hasStoredCharacterEquipmentForSummaryId(data, summaryId);
  const seasonCached =
    summaryId !== null &&
    hasStoredCharacterMythicKeystoneSeasonDetailsForSummaryId(
      data,
      summaryId,
      CHARACTER_MYTHIC_KEYSTONE_DEFAULT_SEASON_ID,
    );
  return (
    <div
      className="character-lookup-history-record"
      title="Double-click to load in the form and submit"
      onDoubleClick={(e) => {
        e.preventDefault();
        onDoubleClickPick();
      }}
    >
      <div className="character-lookup-history-name">{name}</div>
      <div className="character-lookup-history-meta">
        {characterClassName} - Level {level}
      </div>
      <div className="character-lookup-history-icons" role="group" aria-label="Cached payloads">
        <span
          className={
            mythicCached
              ? "character-lookup-history-icon character-lookup-history-icon--active"
              : "character-lookup-history-icon character-lookup-history-icon--muted"
          }
          title={
            mythicCached
              ? "Mythic Keystone Data"
              : "Mythic Keystone data not in lookup history"
          }
        >
          <LookupHistoryIconMythic />
        </span>
        <span
          className={
            equipmentCached
              ? "character-lookup-history-icon character-lookup-history-icon--active"
              : "character-lookup-history-icon character-lookup-history-icon--muted"
          }
          title={
            equipmentCached
              ? "Equipment Data"
              : "Equipment data not in lookup history"
          }
        >
          <LookupHistoryIconEquipment />
        </span>
        <span
          className={
            seasonCached
              ? "character-lookup-history-icon character-lookup-history-icon--active"
              : "character-lookup-history-icon character-lookup-history-icon--muted"
          }
          title={
            seasonCached
              ? "Season Details Data"
              : "Season details data not in lookup history"
          }
        >
          <LookupHistoryIconSeason />
        </span>
      </div>
    </div>
  );
}

export function CharacterProfileLookupForm() {
  const searchParams = useSearchParams();
  const { data, setData } = useWowServiceStorage();
  const formRef = useRef<HTMLFormElement>(null);
  const cacheRailRef = useRef<HTMLElement>(null);
  const [region, setRegion] = useState<WowProfileApiRegionId>("us");
  const [realmSlug, setRealmSlug] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remoteResult, setRemoteResult] = useState<RemoteResult | null>(null);

  useWowCacheRailViewportInset(cacheRailRef);

  useEffect(() => {
    const r = searchParams.get(CHARACTER_PROFILE_SUMMARY_QUERY.region);
    const realm = searchParams
      .get(CHARACTER_PROFILE_SUMMARY_QUERY.realmSlug)
      ?.trim();
    const name = searchParams
      .get(CHARACTER_PROFILE_SUMMARY_QUERY.characterName)
      ?.trim();

    queueMicrotask(() => {
      if (realm && name) {
        if (r && isWowProfileRegionId(r)) {
          setRegion(r);
        }
        setRealmSlug(realm);
        setCharacterName(name);
        writeLastCharacterLookup({
          region: r && isWowProfileRegionId(r) ? r : "us",
          realmSlug: realm,
          characterName: name,
        });
        return;
      }
      const last = readLastCharacterLookup();
      if (!last) return;
      setRegion(last.region);
      setRealmSlug(last.realmSlug);
      setCharacterName(last.characterName);
    });
  }, [searchParams]);

  const lookupKey = useMemo(
    () => currentLookupKey(region, realmSlug, characterName),
    [region, realmSlug, characterName],
  );

  const cachedBody = useMemo(() => {
    if (!lookupKey) return null;
    return findStoredCharacterProfileSummary(
      data,
      region,
      realmSlug.trim(),
      characterName.trim(),
    );
  }, [data, region, realmSlug, characterName, lookupKey]);

  const cachedMythic = useMemo(() => {
    if (!lookupKey) return null;
    return findStoredCharacterMythicKeystoneProfile(
      data,
      region,
      realmSlug.trim(),
      characterName.trim(),
    );
  }, [data, region, realmSlug, characterName, lookupKey]);

  const cachedEquipment = useMemo(() => {
    if (!lookupKey) return null;
    return findStoredCharacterEquipment(
      data,
      region,
      realmSlug.trim(),
      characterName.trim(),
    );
  }, [data, region, realmSlug, characterName, lookupKey]);

  const cachedSeasonDetails = useMemo(() => {
    if (!lookupKey) return null;
    return findStoredCharacterMythicKeystoneSeasonDetails(
      data,
      region,
      realmSlug.trim(),
      characterName.trim(),
      CHARACTER_MYTHIC_KEYSTONE_DEFAULT_SEASON_ID,
    );
  }, [data, region, realmSlug, characterName, lookupKey]);

  const remoteForKey = useMemo(() => {
    if (!lookupKey || !remoteResult || remoteResult.lookupKey !== lookupKey) {
      return null;
    }
    return remoteResult;
  }, [lookupKey, remoteResult]);

  const view = useMemo(() => {
    if (!lookupKey) return { kind: "idle" as const };
    if (remoteForKey?.kind === "not-found") return { kind: "not-found" as const };
    if (remoteForKey?.kind === "success-remote") {
      return {
        kind: "success-remote" as const,
        profile: remoteForKey.profile,
        equipment: remoteForKey.equipment,
        equipmentError: remoteForKey.equipmentError,
        mythic: remoteForKey.mythic,
        mythicError: remoteForKey.mythicError,
        seasonDetails: remoteForKey.seasonDetails,
        seasonDetailsError: remoteForKey.seasonDetailsError,
      };
    }
    if (cachedBody !== null) {
      return {
        kind: "success-local" as const,
        profile: cachedBody,
        equipment: cachedEquipment,
        mythic: cachedMythic,
        seasonDetails: cachedSeasonDetails,
      };
    }
    return { kind: "idle" as const };
  }, [
    lookupKey,
    remoteForKey,
    cachedBody,
    cachedEquipment,
    cachedMythic,
    cachedSeasonDetails,
  ]);

  useEffect(() => {
    if (view.kind !== "success-remote" && view.kind !== "success-local") {
      return;
    }
    if (!currentLookupKey(region, realmSlug, characterName)) return;
    writeLastCharacterLookup({
      region,
      realmSlug: realmSlug.trim(),
      characterName: characterName.trim(),
    });
  }, [view.kind, region, realmSlug, characterName]);

  const characterProfileSummaryStripRecords = useMemo(() => {
    const raw = data[WOW_SERVICE_CHARACTER_PROFILES_KEY];
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return [];
    const map = raw as Record<string, unknown>;
    return Object.keys(map)
      .sort()
      .map((storageId) => ({
        storageId,
        payload: map[storageId],
      }));
  }, [data]);

  const applyStripRecordPick = useCallback((payload: unknown) => {
    const pick = extractCharacterProfileSummaryStripFormPick(payload);
    if (!pick.characterName || !pick.realmSlug) return;
    if (
      pick.regionFromResource &&
      isWowProfileRegionId(pick.regionFromResource)
    ) {
      setRegion(pick.regionFromResource);
    }
    setRealmSlug(pick.realmSlug);
    setCharacterName(pick.characterName);
    setRemoteResult(null);
    setError(null);
    window.setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 0);
  }, []);

  const runRemoteFetch = useCallback(async (): Promise<void> => {
    const key = currentLookupKey(region, realmSlug, characterName);
    if (!key) return;
    const params = buildCharacterProfileQueryParams(
      region,
      realmSlug,
      characterName,
    );
    const res = await fetch(
      `${CHARACTER_PROFILE_SUMMARY_API_PATH}?${params}`,
      { method: "GET" },
    );
    const body: unknown = await res.json().catch(() => null);

    if (!res.ok || !body) {
      if (res.status === 404) {
        setRemoteResult({ lookupKey: key, kind: "not-found" });
        return;
      }
      const errMsg =
        body &&
        typeof body === "object" &&
        "error" in body &&
        typeof (body as { error: unknown }).error === "string"
          ? (body as { error: string }).error
          : `Request failed (${res.status})`;
      setError(errMsg);
      return;
    }

    const summaryId = extractCharacterProfileSummaryId(body);
    let mythic: unknown | null = null;
    let mythicError: string | null = null;
    let seasonDetails: unknown | null = null;
    let seasonDetailsError: string | null = null;
    let equipment: unknown | null = null;
    let equipmentError: string | null = null;

    if (summaryId) {
      const seasonParams = new URLSearchParams(params);
      seasonParams.set(
        CHARACTER_MYTHIC_KEYSTONE_SEASON_DETAILS_QUERY.seasonId,
        CHARACTER_MYTHIC_KEYSTONE_DEFAULT_SEASON_ID,
      );

      const [mythicRes, seasonRes, equipmentRes] = await Promise.all([
        fetch(`${CHARACTER_MYTHIC_KEYSTONE_PROFILE_API_PATH}?${params}`, {
          method: "GET",
        }),
        fetch(
          `${CHARACTER_MYTHIC_KEYSTONE_SEASON_DETAILS_API_PATH}?${seasonParams}`,
          { method: "GET" },
        ),
        fetch(`${CHARACTER_EQUIPMENT_API_PATH}?${params}`, {
          method: "GET",
        }),
      ]);

      const mythicBody: unknown = await mythicRes.json().catch(() => null);
      if (mythicRes.ok && mythicBody) {
        mythic = mythicBody;
      } else {
        mythicError =
          mythicBody &&
          typeof mythicBody === "object" &&
          "error" in mythicBody &&
          typeof (mythicBody as { error: unknown }).error === "string"
            ? (mythicBody as { error: string }).error
            : `Mythic Keystone request failed (${mythicRes.status})`;
      }

      const seasonBody: unknown = await seasonRes.json().catch(() => null);
      if (seasonRes.ok && seasonBody) {
        seasonDetails = seasonBody;
      } else {
        seasonDetailsError =
          seasonBody &&
          typeof seasonBody === "object" &&
          "error" in seasonBody &&
          typeof (seasonBody as { error: unknown }).error === "string"
            ? (seasonBody as { error: string }).error
            : `Mythic Keystone season request failed (${seasonRes.status})`;
      }

      const equipmentBody: unknown = await equipmentRes
        .json()
        .catch(() => null);
      if (equipmentRes.ok && equipmentBody) {
        equipment = equipmentBody;
      } else {
        equipmentError =
          equipmentBody &&
          typeof equipmentBody === "object" &&
          "error" in equipmentBody &&
          typeof (equipmentBody as { error: unknown }).error === "string"
            ? (equipmentBody as { error: string }).error
            : `Equipment request failed (${equipmentRes.status})`;
      }

      setData((prev) => {
        let next = mergeCharacterProfileSummaryIntoWowServiceData(
          prev,
          summaryId,
          body,
          key,
        );
        if (equipment !== null) {
          next = mergeCharacterEquipmentIntoWowServiceData(
            next,
            summaryId,
            equipment,
          );
        }
        if (mythic !== null) {
          next = mergeCharacterMythicKeystoneProfileIntoWowServiceData(
            next,
            summaryId,
            mythic,
          );
        }
        if (seasonDetails !== null) {
          next = mergeCharacterMythicKeystoneSeasonDetailsIntoWowServiceData(
            next,
            summaryId,
            CHARACTER_MYTHIC_KEYSTONE_DEFAULT_SEASON_ID,
            seasonDetails,
          );
        }
        return next;
      });
    } else {
      mythicError =
        "Character profile had no id; Mythic Keystone profile was not fetched or stored.";
      seasonDetailsError =
        "Character profile had no id; Mythic Keystone season was not fetched or stored.";
      equipmentError =
        "Character profile had no id; Equipment was not fetched or stored.";
    }

    setRemoteResult({
      lookupKey: key,
      kind: "success-remote",
      profile: body,
      equipment,
      equipmentError,
      mythic,
      mythicError,
      seasonDetails,
      seasonDetailsError,
    });
  }, [region, realmSlug, characterName, setData]);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      const key = currentLookupKey(region, realmSlug, characterName);
      if (!key) return;
      const local = findStoredCharacterProfileSummary(
        data,
        region,
        realmSlug.trim(),
        characterName.trim(),
      );
      if (local !== null) {
        setRemoteResult(null);
        return;
      }
      setLoading(true);
      try {
        await runRemoteFetch();
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    },
    [data, region, realmSlug, characterName, runRemoteFetch],
  );

  const onForceRemote = useCallback(async () => {
    setError(null);
    if (!currentLookupKey(region, realmSlug, characterName)) return;
    setLoading(true);
    try {
      await runRemoteFetch();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [region, realmSlug, characterName, runRemoteFetch]);

  const mythicMissLocal =
    "No Mythic Keystone profile in cache for this lookup yet. Use “Refresh from Battle.net” to fetch.";
  const seasonMissLocal =
    "No Mythic Keystone season details in cache for this lookup yet. Use “Refresh from Battle.net” to fetch.";
  const equipmentMissLocal =
    "No equipment payload in cache for this lookup yet. Use “Refresh from Battle.net” to fetch.";

  return (
    <div className="character-lookup">
      <div className="character-lookup-layout">
        <div className="character-lookup-main">
          <form
            ref={formRef}
            className="character-form"
            onSubmit={onSubmit}
          >
        <div className="character-form-grid">
          <div className="character-form-field">
            <label className="character-label" htmlFor="wow-character-region">
              Region
            </label>
            <select
              id="wow-character-region"
              className="character-select"
              name={CHARACTER_PROFILE_SUMMARY_QUERY.region}
              value={region}
              onChange={(e) =>
                setRegion(e.target.value as WowProfileApiRegionId)
              }
              required
            >
              {WOW_PROFILE_API_REGIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label} ({r.value})
                </option>
              ))}
            </select>
          </div>

          <div className="character-form-field">
            <label className="character-label" htmlFor="wow-character-realm">
              Realm
            </label>
            <RealmSlugPicker
              id="wow-character-realm"
              name={CHARACTER_PROFILE_SUMMARY_QUERY.realmSlug}
              region={region}
              value={realmSlug}
              onChange={setRealmSlug}
              inputClassName="character-input"
              required
            />
          </div>

          <div className="character-form-field">
            <label className="character-label" htmlFor="wow-character-name">
              Character name
            </label>
            <input
              id="wow-character-name"
              className="character-input"
              name={CHARACTER_PROFILE_SUMMARY_QUERY.characterName}
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="e.g. flojob"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="character-form-actions">
          <button
            className="character-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading…" : "Lookup"}
          </button>
          <button
            className="character-submit-secondary"
            type="button"
            disabled={loading}
            onClick={onForceRemote}
          >
            Refresh from Battle.net
          </button>
        </div>
      </form>

      {error ? <p className="character-form-error">{error}</p> : null}

      {view.kind === "success-remote" || view.kind === "success-local" ? (
        <CharacterOverviewSegments
          profile={view.profile}
          equipment={view.equipment}
          mythicProfile={view.mythic}
          seasonDetails={view.seasonDetails}
          equipmentEmptyMessage={equipmentMissLocal}
          mythicEmptyMessage={mythicMissLocal}
          seasonEmptyMessage={seasonMissLocal}
          equipmentError={
            view.kind === "success-remote" ? view.equipmentError : null
          }
          mythicError={
            view.kind === "success-remote" ? view.mythicError : null
          }
          seasonDetailsError={
            view.kind === "success-remote" ? view.seasonDetailsError : null
          }
          lookupRegion={region}
        />
      ) : null}

      {view.kind === "not-found" ? (
        <WowRawJsonDataPanel
          title="Character Profile"
          freshness="error"
          rawBody={{ message: "Not found" }}
        />
      ) : null}

      {view.kind === "success-remote" ? (
        <>
          <WowRawJsonDataPanel
            title="Character Profile"
            freshness="live"
            rawBody={view.profile}
          />
          <WowRawJsonDataPanel
            title="Character Equipment"
            freshness={view.equipment !== null ? "live" : "error"}
            rawBody={
              view.equipment !== null
                ? view.equipment
                : {
                    message:
                      view.equipmentError ??
                      "Equipment was not returned.",
                  }
            }
            className="wow-raw-json-data-panel--stack-next"
          />
          <WowRawJsonDataPanel
            title="Mythic Keystone Profile"
            freshness={view.mythic !== null ? "live" : "error"}
            rawBody={
              view.mythic !== null
                ? view.mythic
                : {
                    message:
                      view.mythicError ??
                      "Mythic Keystone profile was not returned.",
                  }
            }
            className="wow-raw-json-data-panel--stack-next"
          />
          <WowRawJsonDataPanel
            title="Mythic Keystone season"
            freshness={view.seasonDetails !== null ? "live" : "error"}
            rawBody={
              view.seasonDetails !== null
                ? view.seasonDetails
                : {
                    message:
                      view.seasonDetailsError ??
                      "Mythic Keystone season was not returned.",
                  }
            }
            className="wow-raw-json-data-panel--stack-next"
          />
        </>
      ) : null}

      {view.kind === "success-local" ? (
        <>
          <WowRawJsonDataPanel
            title="Character Profile"
            freshness="cache"
            rawBody={view.profile}
          />
          <WowRawJsonDataPanel
            title="Character Equipment"
            freshness={view.equipment !== null ? "cache" : "error"}
            rawBody={
              view.equipment !== null
                ? view.equipment
                : { message: equipmentMissLocal }
            }
            className="wow-raw-json-data-panel--stack-next"
          />
          <WowRawJsonDataPanel
            title="Mythic Keystone Profile"
            freshness={view.mythic !== null ? "cache" : "error"}
            rawBody={
              view.mythic !== null
                ? view.mythic
                : { message: mythicMissLocal }
            }
            className="wow-raw-json-data-panel--stack-next"
          />
          <WowRawJsonDataPanel
            title="Mythic Keystone season"
            freshness={view.seasonDetails !== null ? "cache" : "error"}
            rawBody={
              view.seasonDetails !== null
                ? view.seasonDetails
                : { message: seasonMissLocal }
            }
            className="wow-raw-json-data-panel--stack-next"
          />
        </>
      ) : null}
        </div>

        <aside
          ref={cacheRailRef}
          className="character-cache-rail"
          aria-label="Lookup history: double-click a row to load that character"
        >
          <h2 className="character-lookup-history-heading">Lookup History</h2>
          <div
            className="character-cache-rail-summaries-strip"
            title="Character profiles saved in this browser. Double-click a row to load."
          >
            {characterProfileSummaryStripRecords.length === 0 ? (
              <p className="character-cache-rail-summaries-strip-empty">
                (none)
              </p>
            ) : (
              <ul className="character-cache-rail-summaries-strip-list">
                {characterProfileSummaryStripRecords.map(
                  ({ storageId, payload }) => (
                    <li
                      key={storageId}
                      className="character-cache-rail-summaries-strip-item"
                    >
                      <CharacterLookupHistoryStripRecord
                        data={data}
                        payload={payload}
                        onDoubleClickPick={() => applyStripRecordPick(payload)}
                      />
                    </li>
                  ),
                )}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
