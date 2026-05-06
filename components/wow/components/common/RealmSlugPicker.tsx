"use client";

import "./styles/realmSlugPicker.css";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { useWowServiceStorage } from "@/components/wow/components/providers/WowServiceStorageProvider";
import type { WowProfileApiRegionId } from "@/lib/wow/battle-net/battleNetProfileRegions";
import {
  mergeRealmBrowseIntoWowServiceData,
  readCachedRealmBrowsePayload,
} from "@/lib/wow";
import {
  REALMS_INDEX_API_PATH,
  REALMS_INDEX_QUERY,
} from "@/lib/wow/api/realmsIndexApi";

export type RealmSlugPickerRealm = { slug: string; name: string };

function realmSearchResultEntryToRow(
  entry: unknown,
  index: number,
): RealmSlugPickerRealm {
  if (entry == null || typeof entry !== "object") {
    return { slug: `row-${index}`, name: "" };
  }
  const o = entry as Record<string, unknown>;
  const data = o.data;
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { slug: `row-${index}`, name: "" };
  }
  const d = data as Record<string, unknown>;
  const slug =
    typeof d.slug === "string" && d.slug.length > 0 ? d.slug : `row-${index}`;
  const nameField = d.name;
  let name = "";
  if (typeof nameField === "string" && nameField.length > 0) {
    name = nameField;
  } else if (
    nameField &&
    typeof nameField === "object" &&
    !Array.isArray(nameField)
  ) {
    const rec = nameField as Record<string, unknown>;
    const first = Object.values(rec).find(
      (v) => typeof v === "string" && (v as string).length > 0,
    );
    if (typeof first === "string") name = first;
  }
  return { slug, name };
}

function isLikelyRealmSlug(value: string): boolean {
  const t = value.trim().toLowerCase();
  return t.length >= 2 && /^[a-z0-9-]+$/.test(t);
}

function realmVisibleLabel(displayName: string): string {
  const n = displayName.trim();
  if (n.length > 0) return n;
  return "Unknown realm";
}

function bodyToRows(body: unknown): RealmSlugPickerRealm[] {
  if (!body || typeof body !== "object" || !("results" in body)) return [];
  const raw = (body as { results: unknown }).results;
  if (!Array.isArray(raw)) return [];
  return raw.map((entry, i) => realmSearchResultEntryToRow(entry, i));
}

function applyLocalFilter(
  rows: RealmSlugPickerRealm[],
  needle: string,
): RealmSlugPickerRealm[] {
  const n = needle.trim().toLowerCase();
  if (!n) return rows;
  return rows.filter(
    (r) =>
      r.slug.toLowerCase().includes(n) || r.name.toLowerCase().includes(n),
  );
}

export type RealmSlugPickerProps = {
  id: string;
  name: string;
  region: WowProfileApiRegionId;
  value: string;
  onChange: (slug: string) => void;
  inputClassName: string;
  required?: boolean;
  emptyHint?: string;
};

export function RealmSlugPicker({
  id,
  name,
  region,
  value,
  onChange,
  inputClassName,
  required = false,
  emptyHint,
}: RealmSlugPickerProps) {
  const { data, setData } = useWowServiceStorage();
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const selectingRef = useRef(false);
  const regionRef = useRef(region);

  useEffect(() => {
    regionRef.current = region;
  }, [region]);

  const browseRowsRef = useRef<RealmSlugPickerRealm[]>([]);
  const inputValueRef = useRef("");
  const valueRef = useRef(value);

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [results, setResults] = useState<RealmSlugPickerRealm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlight, setHighlight] = useState(-1);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    inputValueRef.current = inputValue;
  }, [inputValue]);

  useEffect(() => {
    queueMicrotask(() => {
      const want = valueRef.current.trim().toLowerCase();
      const rows = browseRowsRef.current;
      if (want && rows.length > 0) {
        const hit = rows.find((r) => r.slug.toLowerCase() === want);
        if (hit?.name.trim()) {
          setInputValue(hit.name.trim());
          return;
        }
      }
      setInputValue(valueRef.current);
    });
  }, [value]);

  useEffect(() => {
    queueMicrotask(() => {
      const rows = browseRowsRef.current;
      if (rows.length === 0) return;
      const filtered = applyLocalFilter(rows, value.trim());
      setResults(filtered);
      setHighlight(filtered.length > 0 ? 0 : -1);
    });
  }, [value]);

  useEffect(() => {
    const ac = new AbortController();
    const r = region;
    const cached = readCachedRealmBrowsePayload(data, r);

    if (cached) {
      queueMicrotask(() => {
        setLoading(false);
        setError(null);
      });
      const rows = bodyToRows(cached);
      browseRowsRef.current = rows;
      const want = valueRef.current.trim().toLowerCase();
      if (want) {
        const hit = rows.find((r) => r.slug.toLowerCase() === want);
        if (hit?.name.trim()) {
          queueMicrotask(() => setInputValue(hit.name.trim()));
        }
      }
      const filtered = applyLocalFilter(rows, inputValueRef.current.trim());
      setResults(filtered);
      setHighlight(filtered.length > 0 ? 0 : -1);
      return () => {
        ac.abort();
      };
    }

    queueMicrotask(() => {
      setLoading(true);
      setError(null);
      setResults([]);
    });
    browseRowsRef.current = [];

    void (async () => {
      try {
        const params = new URLSearchParams();
        params.set(REALMS_INDEX_QUERY.region, r);
        const res = await fetch(`${REALMS_INDEX_API_PATH}?${params}`, {
          method: "GET",
          signal: ac.signal,
        });
        const body: unknown = await res.json().catch(() => null);
        if (regionRef.current !== r) return;
        if (!res.ok) {
          const msg =
            body &&
            typeof body === "object" &&
            "error" in body &&
            typeof (body as { error: unknown }).error === "string"
              ? (body as { error: string }).error
              : `Request failed (${res.status})`;
          setError(msg);
          return;
        }
        setData((prev) => mergeRealmBrowseIntoWowServiceData(prev, r, body));
        const rows = bodyToRows(body);
        browseRowsRef.current = rows;
        const want = valueRef.current.trim().toLowerCase();
        if (want) {
          const hit = rows.find((r) => r.slug.toLowerCase() === want);
          if (hit?.name.trim()) {
            queueMicrotask(() => setInputValue(hit.name.trim()));
          }
        }
        const filtered = applyLocalFilter(rows, inputValueRef.current.trim());
        setResults(filtered);
        setHighlight(filtered.length > 0 ? 0 : -1);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (regionRef.current !== r) return;
        setError("Network error");
      } finally {
        if (regionRef.current === r) {
          setLoading(false);
        }
      }
    })();

    return () => {
      ac.abort();
    };
  }, [region, data, setData]);

  useLayoutEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el || !(e.target instanceof Node) || el.contains(e.target)) return;
      setOpen(false);
      setHighlight(-1);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const pick = useCallback(
    (slug: string, displayName: string) => {
      onChange(slug);
      setInputValue(realmVisibleLabel(displayName));
      setOpen(false);
      setHighlight(-1);
    },
    [onChange],
  );

  const onInputChange = (next: string) => {
    setInputValue(next);
    setOpen(true);
    const rows = browseRowsRef.current;
    if (rows.length === 0) {
      setResults([]);
      setHighlight(-1);
      return;
    }
    const filtered = applyLocalFilter(rows, next.trim());
    setResults(filtered);
    setHighlight(filtered.length > 0 ? 0 : -1);
    setError(null);
  };

  const onFocusInput = () => {
    setOpen(true);
  };

  const onBlurInput = () => {
    window.setTimeout(() => {
      if (selectingRef.current) {
        selectingRef.current = false;
        return;
      }
      const t = inputValue.trim();
      const segment = t.includes("·")
        ? (t.split("·").pop()?.trim() ?? "")
        : t;
      if (isLikelyRealmSlug(segment)) {
        const slug = segment.toLowerCase();
        onChange(slug);
        const row = browseRowsRef.current.find(
          (r) => r.slug.toLowerCase() === slug,
        );
        setInputValue(
          row && row.name.trim().length > 0 ? row.name.trim() : "Unknown realm",
        );
      }
      setOpen(false);
      setHighlight(-1);
    }, 0);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setHighlight(-1);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) =>
        results.length === 0 ? -1 : h < results.length - 1 ? h + 1 : 0,
      );
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) =>
        results.length === 0
          ? -1
          : h <= 0
            ? results.length - 1
            : h - 1,
      );
      return;
    }
    if (e.key === "Enter" && highlight >= 0 && highlight < results.length) {
      e.preventDefault();
      const row = results[highlight];
      if (row) pick(row.slug, row.name);
    }
  };

  return (
    <div className="wow-realm-picker" ref={wrapRef}>
      <input type="hidden" name={name} value={value} required={required} />
      <div className="wow-realm-picker-input-wrap">
        <input
          id={id}
          type="text"
          role="combobox"
          className={inputClassName}
          autoComplete="off"
          spellCheck={false}
          placeholder="Realm"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={open}
          aria-haspopup="listbox"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={onFocusInput}
          onBlur={onBlurInput}
          onKeyDown={onKeyDown}
        />
        {open ? (
          <ul
            id={listId}
            className="wow-realm-picker-list"
            role="listbox"
            aria-label="Realms"
          >
            {loading ? (
              <li className="wow-realm-picker-item">
                <span className="wow-realm-picker-meta">Loading…</span>
              </li>
            ) : null}
            {!loading && error ? (
              <li className="wow-realm-picker-item">
                <span className="wow-realm-picker-meta wow-realm-picker-meta--error">
                  {error}
                </span>
              </li>
            ) : null}
            {!loading && !error && results.length === 0 && emptyHint ? (
              <li className="wow-realm-picker-item">
                <span className="wow-realm-picker-meta">{emptyHint}</span>
              </li>
            ) : null}
            {!loading &&
              !error &&
              results.map((row, i) => (
                <li
                  key={`${i}-${row.slug}`}
                  className="wow-realm-picker-item"
                  role="none"
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === highlight}
                    className={
                      i === highlight
                        ? "wow-realm-picker-option wow-realm-picker-option--active"
                        : "wow-realm-picker-option"
                    }
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectingRef.current = true;
                    }}
                    onClick={() => pick(row.slug, row.name)}
                  >
                    <span className="wow-realm-picker-option-name">
                      {row.name.trim() ? row.name : "—"}
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
