"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { useWowServiceStorage } from "@/components/wow/WowServiceStorageProvider";
import { CharacterOverviewSegments } from "@/components/wow/components/character/CharacterOverviewSegments";
import { WowRawJsonDataPanel } from "@/components/wow/components/common";
import {
  CHARACTER_PROFILE_SUMMARY_API_PATH,
  CHARACTER_PROFILE_SUMMARY_QUERY,
} from "@/lib/wow/characterProfileSummaryApi";
import {
  type WowServiceStoredData,
  WOW_SERVICE_CHARACTER_PROFILES_KEY,
  WOW_SERVICE_CHARACTER_EQUIPMENT_KEY,
  WOW_SERVICE_CHARACTER_MYTHIC_KEYSTONE_PROFILES_KEY,
  WOW_SERVICE_CHARACTER_MYTHIC_SEASON_DETAILS_KEY,
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
} from "@/lib/wow";
import { CHARACTER_EQUIPMENT_API_PATH } from "@/lib/wow/characterEquipmentApi";
import { CHARACTER_MYTHIC_KEYSTONE_PROFILE_API_PATH } from "@/lib/wow/characterMythicKeystoneProfileApi";
import {
  CHARACTER_MYTHIC_KEYSTONE_DEFAULT_SEASON_ID,
  CHARACTER_MYTHIC_KEYSTONE_SEASON_DETAILS_API_PATH,
  CHARACTER_MYTHIC_KEYSTONE_SEASON_DETAILS_QUERY,
} from "@/lib/wow/characterMythicKeystoneSeasonDetailsApi";
import {
  WOW_PROFILE_API_REGIONS,
  type WowProfileApiRegionId,
} from "@/lib/wow/battleNetProfileRegions";

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

/** One row per entry in `data.characterProfileSummaries`: name, class, level. */
function CharacterProfileSummaryStripRecord({
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
      className="character-cache-summary-strip-record"
      title="Double-click to load in the form and submit"
      onDoubleClick={(e) => {
        e.preventDefault();
        onDoubleClickPick();
      }}
    >
      <span className="character-cache-summary-strip-name">{name}</span>
      <span className="character-cache-summary-strip-class">
        {characterClassName}
      </span>
      <span className="character-cache-summary-strip-level">Level {level}</span>
      {mythicCached ? (
        <span className="character-cache-summary-strip-mythic">
          Mythic Keystone
        </span>
      ) : null}
      {equipmentCached ? (
        <span className="character-cache-summary-strip-equipment">
          Equipment
        </span>
      ) : null}
      {seasonCached ? (
        <span className="character-cache-summary-strip-season">
          Season {CHARACTER_MYTHIC_KEYSTONE_DEFAULT_SEASON_ID}
        </span>
      ) : null}
    </div>
  );
}

export function CharacterProfileLookupForm() {
  const { data, setData } = useWowServiceStorage();
  const formRef = useRef<HTMLFormElement>(null);
  const [region, setRegion] = useState<WowProfileApiRegionId>("us");
  const [realmSlug, setRealmSlug] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remoteResult, setRemoteResult] = useState<RemoteResult | null>(null);

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
    `No Mythic Keystone season ${CHARACTER_MYTHIC_KEYSTONE_DEFAULT_SEASON_ID} in cache for this lookup yet. Use “Refresh from Battle.net” to fetch.`;
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
              Realm slug
            </label>
            <input
              id="wow-character-realm"
              className="character-input"
              name={CHARACTER_PROFILE_SUMMARY_QUERY.realmSlug}
              type="text"
              autoComplete="off"
              placeholder="e.g. emerald-dream"
              value={realmSlug}
              onChange={(e) => setRealmSlug(e.target.value)}
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
            title={`Mythic Keystone Season (${CHARACTER_MYTHIC_KEYSTONE_DEFAULT_SEASON_ID})`}
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
            title={`Mythic Keystone Season (${CHARACTER_MYTHIC_KEYSTONE_DEFAULT_SEASON_ID})`}
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
          className="character-cache-rail"
          aria-label="Cached character summaries (double-click a row to load)"
        >
          <h2 className="character-cache-rail-heading">From cache</h2>
          <div className="character-cache-rail-summaries-strip">
            <span className="character-cache-rail-summaries-strip-label">
              {`data.${WOW_SERVICE_CHARACTER_PROFILES_KEY}`}
            </span>
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
                      <CharacterProfileSummaryStripRecord
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
          <div className="character-cache-rail-summaries-strip character-cache-rail-mythic-note">
            <span className="character-cache-rail-summaries-strip-label">
              {`data.${WOW_SERVICE_CHARACTER_EQUIPMENT_KEY}`}
            </span>
            <p className="character-cache-rail-mythic-note-body">
              Equipment JSON is keyed by the same Blizzard character{" "}
              <code className="character-hint-code">id</code> as profile summaries.
              Rows above show an Equipment line when cached.
            </p>
          </div>
          <div className="character-cache-rail-summaries-strip character-cache-rail-mythic-note">
            <span className="character-cache-rail-summaries-strip-label">
              {`data.${WOW_SERVICE_CHARACTER_MYTHIC_KEYSTONE_PROFILES_KEY}`}
            </span>
            <p className="character-cache-rail-mythic-note-body">
              Mythic Keystone index JSON is keyed by the same Blizzard character{" "}
              <code className="character-hint-code">id</code> as profile summaries.
              Rows above show a Mythic Keystone line when cached.
            </p>
          </div>
          <div className="character-cache-rail-summaries-strip character-cache-rail-season-note">
            <span className="character-cache-rail-summaries-strip-label">
              {`data.${WOW_SERVICE_CHARACTER_MYTHIC_SEASON_DETAILS_KEY}`}
            </span>
            <p className="character-cache-rail-season-note-body">
              Season payloads are nested by character <code className="character-hint-code">id</code>{" "}
              then season id (currently{" "}
              <code className="character-hint-code">
                {CHARACTER_MYTHIC_KEYSTONE_DEFAULT_SEASON_ID}
              </code>
              ). Rows above show a season line when that season is cached.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
