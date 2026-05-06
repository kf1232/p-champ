"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { useWowServiceStorage } from "@/components/wow/WowServiceStorageProvider";
import { WowRawJsonDataPanel } from "@/components/wow/components/common";
import {
  type WowServiceStoredData,
  WOW_SERVICE_GUILD_PROFILES_KEY,
  WOW_SERVICE_GUILD_ROSTERS_KEY,
  extractGuildProfileSummaryId,
  extractGuildProfileSummaryStripFields,
  extractGuildProfileSummaryStripFormPick,
  findStoredGuildProfileSummary,
  findStoredGuildRosterSummary,
  formatGuildRosterMemberCountLabel,
  hasStoredGuildRosterForGuildId,
  makeGuildProfileLookupKey,
  mergeGuildProfileSummaryIntoWowServiceData,
  mergeGuildRosterSummaryIntoWowServiceData,
} from "@/lib/wow";
import {
  WOW_PROFILE_API_REGIONS,
  type WowProfileApiRegionId,
} from "@/lib/wow/battleNetProfileRegions";
import {
  GUILD_API_PATH,
  GUILD_QUERY,
  GUILD_ROSTER_API_PATH,
  guildDefaultLocaleForRegion,
  guildDefaultNamespaceForRegion,
} from "@/lib/wow/guildApi";

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
  const guild = nameSlug.trim();
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
  namespace: string,
  locale: string,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set(GUILD_QUERY.region, region.toLowerCase());
  params.set(GUILD_QUERY.realmSlug, realmSlug.trim());
  params.set(GUILD_QUERY.nameSlug, nameSlug.trim());
  const ns = namespace.trim();
  const loc = locale.trim();
  if (ns) params.set(GUILD_QUERY.namespace, ns);
  if (loc) params.set(GUILD_QUERY.locale, loc);
  return params;
}

function GuildProfileSummaryStripRecord({
  data,
  payload,
  onDoubleClickPick,
}: {
  data: WowServiceStoredData;
  payload: unknown;
  onDoubleClickPick: () => void;
}) {
  const { name, realmSlug, factionName } =
    extractGuildProfileSummaryStripFields(payload);
  const guildId = extractGuildProfileSummaryId(payload);
  const rosterCached =
    guildId !== null && hasStoredGuildRosterForGuildId(data, guildId);
  const rosterLabel = rosterCached
    ? formatGuildRosterMemberCountLabel(
        (data[WOW_SERVICE_GUILD_ROSTERS_KEY] as Record<string, unknown>)[
          guildId
        ],
      )
    : null;
  return (
    <div
      className="guild-cache-summary-strip-record"
      title="Double-click to load in the form and submit"
      onDoubleClick={(e) => {
        e.preventDefault();
        onDoubleClickPick();
      }}
    >
      <span className="guild-cache-summary-strip-name">{name}</span>
      <span className="guild-cache-summary-strip-realm">{realmSlug}</span>
      <span className="guild-cache-summary-strip-faction">{factionName}</span>
      {rosterCached && rosterLabel ? (
        <span className="guild-cache-summary-strip-roster">{rosterLabel}</span>
      ) : null}
    </div>
  );
}

export function GuildLookupForm() {
  const { data, setData } = useWowServiceStorage();
  const formRef = useRef<HTMLFormElement>(null);
  const [region, setRegion] = useState<WowProfileApiRegionId>("us");
  const [realmSlug, setRealmSlug] = useState("");
  const [nameSlug, setNameSlug] = useState("");
  const [namespace, setNamespace] = useState("");
  const [locale, setLocale] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remoteResult, setRemoteResult] = useState<RemoteResult | null>(null);

  const defaultNamespace = useMemo(
    () => guildDefaultNamespaceForRegion(region),
    [region],
  );
  const defaultLocale = useMemo(
    () => guildDefaultLocaleForRegion(region),
    [region],
  );

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
      nameSlug.trim(),
    );
  }, [data, region, realmSlug, nameSlug, lookupKey]);

  const cachedRoster = useMemo(() => {
    if (!lookupKey) return null;
    return findStoredGuildRosterSummary(
      data,
      region,
      realmSlug.trim(),
      nameSlug.trim(),
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
    setNamespace("");
    setLocale("");
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
    const params = buildGuildQueryParams(
      region,
      realmSlug,
      nameSlug,
      namespace,
      locale,
    );

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
  }, [region, realmSlug, nameSlug, namespace, locale, setData]);

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
        nameSlug.trim(),
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
                  Realm slug
                </label>
                <input
                  id="wow-guild-realm"
                  className="guild-input"
                  name={GUILD_QUERY.realmSlug}
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. malganis"
                  value={realmSlug}
                  onChange={(e) => setRealmSlug(e.target.value)}
                  required
                />
              </div>

              <div className="guild-form-field">
                <label className="guild-label" htmlFor="wow-guild-name-slug">
                  Guild name slug
                </label>
                <input
                  id="wow-guild-name-slug"
                  className="guild-input"
                  name={GUILD_QUERY.nameSlug}
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="e.g. we-are-rats"
                  value={nameSlug}
                  onChange={(e) => setNameSlug(e.target.value)}
                  required
                />
              </div>

              <div className="guild-form-field guild-form-field--span-2">
                <label className="guild-label" htmlFor="wow-guild-namespace">
                  Namespace
                </label>
                <input
                  id="wow-guild-namespace"
                  className="guild-input"
                  name={GUILD_QUERY.namespace}
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={defaultNamespace}
                  value={namespace}
                  onChange={(e) => setNamespace(e.target.value)}
                />
                <p className="guild-hint">
                  Optional. Leave blank to use{" "}
                  <code className="guild-hint-code">{defaultNamespace}</code>.
                  Applied to both guild and roster requests.
                </p>
              </div>

              <div className="guild-form-field">
                <label className="guild-label" htmlFor="wow-guild-locale">
                  Locale
                </label>
                <input
                  id="wow-guild-locale"
                  className="guild-input"
                  name={GUILD_QUERY.locale}
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={defaultLocale}
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                />
                <p className="guild-hint">
                  Optional. Leave blank to use{" "}
                  <code className="guild-hint-code">{defaultLocale}</code>.
                  Applied to both guild and roster requests.
                </p>
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
              <WowRawJsonDataPanel
                title="Guild Profile"
                freshness="live"
                rawBody={view.profile}
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
              <WowRawJsonDataPanel
                title="Guild Profile"
                freshness="cache"
                rawBody={view.profile}
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
          className="guild-cache-rail"
          aria-label="Cached guild summaries (double-click a row to load)"
        >
          <h2 className="guild-cache-rail-heading">From cache</h2>
          <div className="guild-cache-rail-summaries-strip">
            <span className="guild-cache-rail-summaries-strip-label">
              {`data.${WOW_SERVICE_GUILD_PROFILES_KEY}`}
            </span>
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
                      <GuildProfileSummaryStripRecord
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
          <div className="guild-cache-rail-summaries-strip guild-cache-rail-roster-note">
            <span className="guild-cache-rail-summaries-strip-label">
              {`data.${WOW_SERVICE_GUILD_ROSTERS_KEY}`}
            </span>
            <p className="guild-cache-rail-roster-note-body">
              Roster JSON is keyed by the same Blizzard guild <code className="guild-hint-code">id</code> as
              guild summaries. Rows above show a roster line when cached.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
