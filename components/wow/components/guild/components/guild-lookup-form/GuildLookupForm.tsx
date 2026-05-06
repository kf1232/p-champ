"use client";

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
import {
  RealmSlugPicker,
  WowRawJsonDataPanel,
} from "@/components/wow/components/common";
import { GuildProfileDisplay } from "../guild-profile-display";
import { GuildRosterDisplay } from "../guild-roster-display";
import {
  type WowServiceStoredData,
  WOW_SERVICE_GUILD_PROFILES_KEY,
  extractGuildProfileSummaryId,
  extractGuildProfileSummaryStripFields,
  extractGuildProfileSummaryStripFormPick,
  findStoredGuildProfileSummary,
  findStoredGuildRosterSummary,
  hasStoredGuildRosterForGuildId,
  makeGuildProfileLookupKey,
  mergeGuildProfileSummaryIntoWowServiceData,
  mergeGuildRosterSummaryIntoWowServiceData,
  readLastGuildLookup,
  writeLastGuildLookup,
} from "@/lib/wow";
import {
  WOW_PROFILE_API_REGIONS,
  type WowProfileApiRegionId,
} from "@/lib/wow/battle-net/battleNetProfileRegions";
import {
  GUILD_API_PATH,
  GUILD_QUERY,
  GUILD_ROSTER_API_PATH,
  guildDefaultLocaleForRegion,
  guildDefaultNamespaceForRegion,
  guildNameInputToNameSlug,
} from "@/lib/wow/api/guildApi";

type RemoteResult =
  | { lookupKey: string; kind: "not-found" }
  | {
      lookupKey: string;
      kind: "success-remote";
      profile: unknown;
      roster: unknown | null;
      rosterError: string | null;
    };

function currentLookupKey(
  region: WowProfileApiRegionId,
  realmSlug: string,
  nameSlug: string,
): string | null {
  const realm = realmSlug.trim();
  const guild = guildNameInputToNameSlug(nameSlug);
  if (!realm || !guild) return null;
  return makeGuildProfileLookupKey(region, realm, guild);
}

function isWowProfileRegionId(value: string): value is WowProfileApiRegionId {
  return WOW_PROFILE_API_REGIONS.some((r) => r.value === value);
}

function buildGuildQueryParams(
  region: WowProfileApiRegionId,
  realmSlug: string,
  nameSlug: string,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set(GUILD_QUERY.region, region.toLowerCase());
  params.set(GUILD_QUERY.realmSlug, realmSlug.trim());
  params.set(GUILD_QUERY.nameSlug, nameSlug);
  params.set(
    GUILD_QUERY.namespace,
    guildDefaultNamespaceForRegion(region),
  );
  params.set(GUILD_QUERY.locale, guildDefaultLocaleForRegion(region));
  return params;
}

function GuildLookupHistoryIconRoster() {
  return (
    <svg
      className="guild-lookup-history-icon-svg"
      viewBox="0 0 20 20"
      width={18}
      height={18}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M6.5 8a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Zm-2 7v-1c0-1.7 1.6-3 3.5-3h3c1.9 0 3.5 1.3 3.5 3v1h-10Zm9.5-9c1.1 0 2 .9 2 2v1h-3.2c-.2-.7-.5-1.3-.9-1.8.4-.7 1.2-1.2 2.1-1.2Zm1 4.2.5 2.8H17v-1c0-.4-.1-.7-.2-1h-2.2Z"
      />
    </svg>
  );
}

function GuildLookupHistoryStripRecord({
  data,
  payload,
  onDoubleClickPick,
}: {
  data: WowServiceStoredData;
  payload: unknown;
  onDoubleClickPick: () => void;
}) {
  const { name, realmDisplay, factionName } =
    extractGuildProfileSummaryStripFields(payload);
  const guildId = extractGuildProfileSummaryId(payload);
  const rosterCached =
    guildId !== null && hasStoredGuildRosterForGuildId(data, guildId);
  const meta = [realmDisplay, factionName].filter(Boolean).join(" · ");
  return (
    <div
      className="guild-lookup-history-record"
      title="Double-click to load in the form and submit"
      onDoubleClick={(e) => {
        e.preventDefault();
        onDoubleClickPick();
      }}
    >
      <div className="guild-lookup-history-name">{name}</div>
      {meta ? (
        <div className="guild-lookup-history-meta">{meta}</div>
      ) : null}
      <div className="guild-lookup-history-icons" role="group" aria-label="Cached payloads">
        <span
          className={
            rosterCached
              ? "guild-lookup-history-icon guild-lookup-history-icon--active"
              : "guild-lookup-history-icon guild-lookup-history-icon--muted"
          }
          title={
            rosterCached
              ? "Roster Data"
              : "Roster data not in lookup history"
          }
        >
          <GuildLookupHistoryIconRoster />
        </span>
      </div>
    </div>
  );
}

export function GuildLookupForm() {
  const searchParams = useSearchParams();
  const { data, setData } = useWowServiceStorage();
  const formRef = useRef<HTMLFormElement>(null);
  const urlLookupAutoKeyRef = useRef<string | null>(null);
  const cacheRailRef = useRef<HTMLElement>(null);
  const [region, setRegion] = useState<WowProfileApiRegionId>("us");
  const [realmSlug, setRealmSlug] = useState("");
  const [nameSlug, setNameSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remoteResult, setRemoteResult] = useState<RemoteResult | null>(null);

  useWowCacheRailViewportInset(cacheRailRef);

  useEffect(() => {
    const r = searchParams.get(GUILD_QUERY.region)?.trim();
    const realm = searchParams.get(GUILD_QUERY.realmSlug)?.trim();
    const name = searchParams.get(GUILD_QUERY.nameSlug)?.trim();

    queueMicrotask(() => {
      if (realm && name) {
        const regionResolved: WowProfileApiRegionId =
          r && isWowProfileRegionId(r) ? r : "us";
        setRegion(regionResolved);
        setRealmSlug(realm);
        setNameSlug(name);
        writeLastGuildLookup({
          region: regionResolved,
          realmSlug: realm,
          nameSlug: name,
        });
        const autoKey = `${regionResolved}|${realm}|${name}`;
        if (urlLookupAutoKeyRef.current !== autoKey) {
          urlLookupAutoKeyRef.current = autoKey;
          window.setTimeout(() => {
            formRef.current?.requestSubmit();
          }, 0);
        }
        return;
      }

      urlLookupAutoKeyRef.current = null;
      const last = readLastGuildLookup();
      if (!last) return;
      setRegion(last.region);
      setRealmSlug(last.realmSlug);
      setNameSlug(last.nameSlug);
    });
  }, [searchParams]);

  const lookupKey = useMemo(
    () => currentLookupKey(region, realmSlug, nameSlug),
    [region, realmSlug, nameSlug],
  );

  const cachedBody = useMemo(() => {
    if (!lookupKey) return null;
    return findStoredGuildProfileSummary(
      data,
      region,
      realmSlug.trim(),
      guildNameInputToNameSlug(nameSlug),
    );
  }, [data, region, realmSlug, nameSlug, lookupKey]);

  const cachedRoster = useMemo(() => {
    if (!lookupKey) return null;
    return findStoredGuildRosterSummary(
      data,
      region,
      realmSlug.trim(),
      guildNameInputToNameSlug(nameSlug),
    );
  }, [data, region, realmSlug, nameSlug, lookupKey]);

  const remoteForKey = useMemo(() => {
    if (!lookupKey || !remoteResult || remoteResult.lookupKey !== lookupKey) {
      return null;
    }
    return remoteResult;
  }, [lookupKey, remoteResult]);

  const view = useMemo(() => {
    if (!lookupKey) return { kind: "idle" as const };
    if (remoteForKey?.kind === "not-found") {
      return { kind: "not-found" as const };
    }
    if (remoteForKey?.kind === "success-remote") {
      return {
        kind: "success-remote" as const,
        profile: remoteForKey.profile,
        roster: remoteForKey.roster,
        rosterError: remoteForKey.rosterError,
      };
    }
    if (cachedBody !== null) {
      return {
        kind: "success-local" as const,
        profile: cachedBody,
        roster: cachedRoster,
      };
    }
    return { kind: "idle" as const };
  }, [lookupKey, remoteForKey, cachedBody, cachedRoster]);

  useEffect(() => {
    if (view.kind !== "success-remote" && view.kind !== "success-local") {
      return;
    }
    if (!lookupKey) return;
    writeLastGuildLookup({
      region,
      realmSlug: realmSlug.trim(),
      nameSlug,
    });
  }, [view.kind, lookupKey, region, realmSlug, nameSlug]);

  const guildProfileSummaryStripRecords = useMemo(() => {
    const raw = data[WOW_SERVICE_GUILD_PROFILES_KEY];
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
    const pick = extractGuildProfileSummaryStripFormPick(payload);
    if (
      pick.regionFromResource &&
      isWowProfileRegionId(pick.regionFromResource)
    ) {
      setRegion(pick.regionFromResource);
    }
    if (pick.realmSlug) setRealmSlug(pick.realmSlug);
    if (pick.nameSlug) setNameSlug(pick.nameSlug);
    setRemoteResult(null);
    setError(null);
    if (pick.nameSlug && pick.realmSlug) {
      window.setTimeout(() => {
        formRef.current?.requestSubmit();
      }, 0);
    }
  }, []);

  const runRemoteFetch = useCallback(async (): Promise<void> => {
    const key = currentLookupKey(region, realmSlug, nameSlug);
    if (!key) return;
    const params = buildGuildQueryParams(region, realmSlug, nameSlug);

    const res = await fetch(`${GUILD_API_PATH}?${params}`, {
      method: "GET",
    });
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

    const guildId = extractGuildProfileSummaryId(body);
    let roster: unknown | null = null;
    let rosterError: string | null = null;

    if (guildId) {
      const rosterRes = await fetch(`${GUILD_ROSTER_API_PATH}?${params}`, {
        method: "GET",
      });
      const rosterBody: unknown = await rosterRes.json().catch(() => null);
      if (rosterRes.ok && rosterBody) {
        roster = rosterBody;
      } else {
        rosterError =
          rosterBody &&
          typeof rosterBody === "object" &&
          "error" in rosterBody &&
          typeof (rosterBody as { error: unknown }).error === "string"
            ? (rosterBody as { error: string }).error
            : `Roster request failed (${rosterRes.status})`;
      }

      setData((prev) => {
        let next = mergeGuildProfileSummaryIntoWowServiceData(
          prev,
          guildId,
          body,
          key,
        );
        if (roster !== null) {
          next = mergeGuildRosterSummaryIntoWowServiceData(next, guildId, roster);
        }
        return next;
      });
    } else {
      rosterError =
        "Guild response had no id; roster was not fetched or stored.";
    }

    setRemoteResult({
      lookupKey: key,
      kind: "success-remote",
      profile: body,
      roster,
      rosterError,
    });
  }, [region, realmSlug, nameSlug, setData]);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      const key = currentLookupKey(region, realmSlug, nameSlug);
      if (!key) return;
      const local = findStoredGuildProfileSummary(
        data,
        region,
        realmSlug.trim(),
        guildNameInputToNameSlug(nameSlug),
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
    [data, region, realmSlug, nameSlug, runRemoteFetch],
  );

  const onForceRemote = useCallback(async () => {
    setError(null);
    if (!currentLookupKey(region, realmSlug, nameSlug)) return;
    setLoading(true);
    try {
      await runRemoteFetch();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [region, realmSlug, nameSlug, runRemoteFetch]);

  const rosterMissLocal =
    "No roster in cache for this lookup yet. Use “Refresh from Battle.net” to fetch both.";

  return (
    <div className="guild-lookup">
      <div className="guild-lookup-layout">
        <div className="guild-lookup-main">
          <form
            ref={formRef}
            className="guild-form"
            onSubmit={onSubmit}
          >
            <div className="guild-form-grid">
              <div className="guild-form-field">
                <label className="guild-label" htmlFor="wow-guild-region">
                  Region
                </label>
                <select
                  id="wow-guild-region"
                  className="guild-select"
                  name={GUILD_QUERY.region}
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

              <div className="guild-form-field">
                <label className="guild-label" htmlFor="wow-guild-realm">
                  Realm
                </label>
                <RealmSlugPicker
                  id="wow-guild-realm"
                  name={GUILD_QUERY.realmSlug}
                  region={region}
                  value={realmSlug}
                  onChange={setRealmSlug}
                  inputClassName="guild-input"
                  required
                />
              </div>

              <div className="guild-form-field">
                <label className="guild-label" htmlFor="wow-guild-name">
                  Guild Name
                </label>
                <input
                  id="wow-guild-name"
                  className="guild-input"
                  name={GUILD_QUERY.nameSlug}
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="e.g. We Are Rats"
                  value={nameSlug}
                  onChange={(e) => setNameSlug(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="guild-form-actions">
              <button className="guild-submit" type="submit" disabled={loading}>
                {loading ? "Loading…" : "Lookup"}
              </button>
              <button
                className="guild-submit-secondary"
                type="button"
                disabled={loading}
                onClick={onForceRemote}
              >
                Refresh from Battle.net
              </button>
            </div>
          </form>

          {error ? <p className="guild-form-error">{error}</p> : null}

          {view.kind === "not-found" ? (
            <WowRawJsonDataPanel
              title="Guild Profile"
              freshness="error"
              rawBody={{ message: "Not found" }}
            />
          ) : null}

          {view.kind === "success-remote" ? (
            <>
              <GuildProfileDisplay profile={view.profile} />
              <WowRawJsonDataPanel
                title="Guild Profile"
                freshness="live"
                rawBody={view.profile}
              />
              <GuildRosterDisplay
                roster={view.roster}
                guildProfileSummary={view.profile}
              />
              <WowRawJsonDataPanel
                title="Guild Roster"
                freshness={view.roster !== null ? "live" : "error"}
                rawBody={
                  view.roster !== null
                    ? view.roster
                    : {
                        message:
                          view.rosterError ??
                          "No roster payload (guild summary may be missing an id, or roster was not fetched).",
                      }
                }
                className="wow-raw-json-data-panel--stack-next"
              />
            </>
          ) : null}

          {view.kind === "success-local" ? (
            <>
              <GuildProfileDisplay profile={view.profile} />
              <WowRawJsonDataPanel
                title="Guild Profile"
                freshness="cache"
                rawBody={view.profile}
              />
              <GuildRosterDisplay
                roster={view.roster}
                guildProfileSummary={view.profile}
              />
              <WowRawJsonDataPanel
                title="Guild Roster"
                freshness={view.roster !== null ? "cache" : "error"}
                rawBody={
                  view.roster !== null
                    ? view.roster
                    : { message: rosterMissLocal }
                }
                className="wow-raw-json-data-panel--stack-next"
              />
            </>
          ) : null}
        </div>

        <aside
          ref={cacheRailRef}
          className="guild-cache-rail"
          aria-label="Lookup history: double-click a row to load that guild"
        >
          <h2 className="guild-lookup-history-heading">Lookup History</h2>
          <div
            className="guild-cache-rail-summaries-strip"
            title="Guild profiles saved in this browser. Double-click a row to load."
          >
            {guildProfileSummaryStripRecords.length === 0 ? (
              <p className="guild-cache-rail-summaries-strip-empty">(none)</p>
            ) : (
              <ul className="guild-cache-rail-summaries-strip-list">
                {guildProfileSummaryStripRecords.map(
                  ({ storageId, payload }) => (
                    <li
                      key={storageId}
                      className="guild-cache-rail-summaries-strip-item"
                    >
                      <GuildLookupHistoryStripRecord
                        data={data}
                        payload={payload}
                        onDoubleClickPick={() =>
                          applyStripRecordPick(payload)
                        }
                      />
                    </li>
                  ),
                )}
              </ul>
            )}
          </div>
          <div
            className="guild-cache-rail-summaries-strip guild-cache-rail-roster-note"
            title="Roster payloads are stored under the guild id from the same lookup as the profile. A lit roster icon in a row above means that guild’s roster is cached."
          >
            <p className="guild-cache-rail-roster-note-body">
              Roster icon: cached for that guild.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
