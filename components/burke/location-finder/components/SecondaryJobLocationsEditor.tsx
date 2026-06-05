"use client";

import { useMemo, useRef, useState } from "react";

import {
  addressFieldValuesEqual,
  emptyAddressFieldValue,
  isAddressResolved,
} from "@/lib/burke";
import {
  countAddressStatuses,
  effectiveAddressFieldStatus,
  groupSecondaryRowsByEffectiveStatus,
} from "@/lib/burke";
import {
  applyGeocodeWithTargetContext,
  parseRegionHintFromFormatted,
  queryLikelyNeedsRegionContext,
  withRegionContext,
} from "@/lib/burke";
import {
  LOCATION_FINDER_MAX_SECONDARY_LOCATIONS,
  parseLocationsCsv,
  nextSecondaryRowId,
} from "@/lib/burke";

const LOCATION_FINDER_ACTION_BUTTON_CLASS = "app-btn app-btn--ghost app-btn--compact";
import {
  createInitialSecondaryRows,
  type SecondaryLocationRow,
} from "../utils/secondaryRows";
import { AddressField } from "./address-field";
import { SecondaryLocationStatusCounts } from "./AddressStatusGlyph";
import { useGeocodeLookup } from "./GeocodeLookupProvider";
import { SecondaryLocationsResolvingPanel } from "./SecondaryLocationsResolvingPanel";

export type { SecondaryLocationRow };

type SecondaryJobLocationsEditorProps = {
  rows: SecondaryLocationRow[];
  onChange: (rows: SecondaryLocationRow[]) => void;
  /** Resolved target formatted line — used to geocode street-only bulk rows in context. */
  targetFormatted?: string | null;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
};

function createRow(
  existingRows: SecondaryLocationRow[],
  prefill = "",
): SecondaryLocationRow {
  return {
    id: nextSecondaryRowId(existingRows),
    value: prefill
      ? { ...emptyAddressFieldValue(), query: prefill }
      : emptyAddressFieldValue(),
    status: "idle",
  };
}

function hasSecondaryListData(rows: SecondaryLocationRow[]): boolean {
  return (
    rows.length > 1 ||
    rows.some((row) => row.value.query.trim().length > 0)
  );
}

function waitForNextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export function SecondaryJobLocationsEditor({
  rows,
  onChange,
  targetFormatted = null,
  collapsed = false,
  onCollapsedChange,
}: SecondaryJobLocationsEditorProps) {
  const { prefetch, peekLookup } = useGeocodeLookup();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [isResolvingBulk, setIsResolvingBulk] = useState(false);
  const [resolvingCount, setResolvingCount] = useState(0);
  const [bulkImportActive, setBulkImportActive] = useState(() =>
    hasSecondaryListData(rows),
  );

  const statusCounts = useMemo(
    () =>
      countAddressStatuses(
        rows.map((row) => ({
          status: effectiveAddressFieldStatus(row.value, row.status),
        })),
      ),
    [rows],
  );

  const rowSections = useMemo(
    () => groupSecondaryRowsByEffectiveStatus(rows),
    [rows],
  );

  const updateRow = (id: string, patch: Partial<SecondaryLocationRow>) => {
    const index = rows.findIndex((row) => row.id === id);
    if (index < 0) {
      return;
    }
    const current = rows[index]!;
    const next = { ...current, ...patch };
    if (
      addressFieldValuesEqual(next.value, current.value) &&
      next.status === current.status &&
      next.id === current.id
    ) {
      return;
    }
    onChange(rows.map((row) => (row.id === id ? next : row)));
  };

  const [importLimitNotice, setImportLimitNotice] = useState<string | null>(
    null,
  );

  const addRowsFromAddresses = async (
    addresses: string[],
    options?: { fromBulkImport?: boolean },
  ) => {
    if (addresses.length === 0 || isResolvingBulk) {
      return;
    }

    const filledCount = rows.filter((row) => row.value.query.trim()).length;
    const slots = Math.max(
      0,
      LOCATION_FINDER_MAX_SECONDARY_LOCATIONS - filledCount,
    );
    const toAdd = addresses.slice(0, slots);
    if (toAdd.length === 0) {
      setImportLimitNotice(
        `You already have ${LOCATION_FINDER_MAX_SECONDARY_LOCATIONS} locations. Remove some before importing more.`,
      );
      return;
    }
    if (toAdd.length < addresses.length) {
      setImportLimitNotice(
        `Only the first ${toAdd.length} of ${addresses.length} addresses were added (limit ${LOCATION_FINDER_MAX_SECONDARY_LOCATIONS}).`,
      );
    } else {
      setImportLimitNotice(null);
    }

    let next = [...rows];
    for (const address of toAdd) {
      const emptyIndex = next.findIndex((row) => !row.value.query.trim());
      if (emptyIndex >= 0) {
        next[emptyIndex] = {
          ...next[emptyIndex]!,
          value: { ...emptyAddressFieldValue(), query: address },
          status: "idle",
        };
      } else {
        next = [...next, createRow(next, address)];
      }
    }

    const baseQueries = [
      ...new Set(
        next
          .map((row) => row.value.query.trim())
          .filter((q) => q.length >= 3),
      ),
    ];

    const regionHint = targetFormatted
      ? parseRegionHintFromFormatted(targetFormatted)
      : null;
    const toResolve = [
      ...new Set(
        baseQueries.flatMap((q) => {
          if (regionHint && queryLikelyNeedsRegionContext(q)) {
            return [q, withRegionContext(q, regionHint)];
          }
          return [q];
        }),
      ),
    ];

    setResolvingCount(baseQueries.length);
    setIsResolvingBulk(true);
    try {
      await prefetch(toResolve);
      next = next.map((row) => {
        const query = row.value.query.trim();
        if (query.length < 3) {
          return row;
        }
        const applied = applyGeocodeWithTargetContext(
          query,
          peekLookup,
          targetFormatted,
        );
        return {
          ...row,
          value: applied.value,
          status: applied.status,
        };
      });
      onChange(next);
      if (options?.fromBulkImport) {
        setBulkImportActive(true);
        setPasteOpen(false);
        setPasteText("");
      }
      await waitForNextPaint();
    } finally {
      setIsResolvingBulk(false);
      setResolvingCount(0);
    }
  };

  const clearAllLocations = () => {
    onChange(createInitialSecondaryRows());
    setBulkImportActive(false);
    setPasteOpen(false);
    setPasteText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onImportFile = async (file: File) => {
    const text = await file.text();
    addRowsFromAddresses(parseLocationsCsv(text), { fromBulkImport: true });
  };

  const onAddFromPaste = () => {
    addRowsFromAddresses(parseLocationsCsv(pasteText), { fromBulkImport: true });
    setPasteText("");
    setPasteOpen(false);
  };

  const removeRow = (id: string) => {
    if (rows.length <= 1) {
      return;
    }
    onChange(rows.filter((row) => row.id !== id));
  };

  const filledCount = rows.filter((row) => row.value.query.trim().length > 0)
    .length;

  const expand = () => onCollapsedChange?.(false);

  if (collapsed) {
    if (isResolvingBulk) {
      return (
        <SecondaryLocationsResolvingPanel count={resolvingCount || filledCount} />
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="flex w-full flex-wrap items-center justify-between gap-3 rounded-md border border-border-default bg-surface-overlay px-3 py-2.5 text-left shadow-sm hover:border-border-strong hover:bg-surface-elevated"
          aria-expanded={false}
          aria-controls="secondary-job-locations-panel"
          onClick={expand}
        >
          <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-primary">
            Secondary Job Locations
            <SecondaryLocationStatusCounts counts={statusCounts} />
            <span className="font-normal text-tertiary">
              ({filledCount} {filledCount === 1 ? "location" : "locations"})
            </span>
          </span>
          <span className={LOCATION_FINDER_ACTION_BUTTON_CLASS}>Expand</span>
        </button>
      </div>
    );
  }

  return (
    <div
      id="secondary-job-locations-panel"
      className="flex flex-col gap-3"
      aria-expanded
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-primary">
          Secondary Job Locations
          <SecondaryLocationStatusCounts counts={statusCounts} />
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={LOCATION_FINDER_ACTION_BUTTON_CLASS}
            aria-label="Add secondary location row"
            disabled={isResolvingBulk}
            onClick={() => onChange([...rows, createRow(rows)])}
          >
            +
          </button>
          {bulkImportActive ? (
            <button
              type="button"
              className={LOCATION_FINDER_ACTION_BUTTON_CLASS}
              disabled={isResolvingBulk}
              onClick={clearAllLocations}
            >
              Clear all
            </button>
          ) : (
            <>
              <button
                type="button"
                className={LOCATION_FINDER_ACTION_BUTTON_CLASS}
                disabled={isResolvingBulk}
                onClick={() => fileInputRef.current?.click()}
              >
                Import
              </button>
              <button
                type="button"
                className={LOCATION_FINDER_ACTION_BUTTON_CLASS}
                disabled={isResolvingBulk}
                onClick={() => setPasteOpen((o) => !o)}
              >
                Paste CSV
              </button>
            </>
          )}
          {onCollapsedChange ? (
            <button
              type="button"
              className={LOCATION_FINDER_ACTION_BUTTON_CLASS}
              onClick={() => onCollapsedChange(true)}
            >
              Collapse
            </button>
          ) : null}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv,text/plain"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            void onImportFile(file);
          }
          e.target.value = "";
        }}
      />

      {importLimitNotice ? (
        <p className="text-sm text-amber-800" role="status">
          {importLimitNotice}
        </p>
      ) : null}

      {pasteOpen && !bulkImportActive ? (
        <div className="flex flex-col gap-2 rounded-md border border-border-default bg-surface-overlay p-3">
          <textarea
            className="min-h-[6rem] w-full rounded-md border border-border-strong bg-surface-elevated px-3 py-2 text-sm text-primary"
            placeholder="One address per line, or CSV rows"
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
          />
          <button
            type="button"
            className={`${LOCATION_FINDER_ACTION_BUTTON_CLASS} self-start`}
            onClick={onAddFromPaste}
          >
            Add rows
          </button>
        </div>
      ) : null}

      {isResolvingBulk ? (
        <SecondaryLocationsResolvingPanel count={resolvingCount} />
      ) : (
      <div className="flex flex-col gap-5">
        {rowSections.map((section) => (
          <section
            key={section.key}
            className="flex flex-col gap-3"
            aria-labelledby={
              section.label
                ? `secondary-status-section-${section.key}`
                : undefined
            }
          >
            {section.label ? (
              <h3
                id={`secondary-status-section-${section.key}`}
                className="text-xs font-semibold tracking-wide text-tertiary"
              >
                {section.label}
                <span className="ml-1.5 font-normal tabular-nums text-tertiary">
                  ({section.rows.length})
                </span>
              </h3>
            ) : null}
            <ul className="flex flex-col gap-3">
              {section.rows.map((row, index) => (
                <li key={row.id} className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <AddressField
                      id={`location-finder-secondary-${row.id}`}
                      name={`secondary-${section.key}-${index}`}
                      value={row.value}
                      rowStatus={row.status}
                      onChange={(value) => {
                        const current = rows.find((r) => r.id === row.id);
                        if (!current) {
                          return;
                        }
                        updateRow(row.id, {
                          value,
                          status: isAddressResolved(value)
                            ? "success"
                            : addressFieldValuesEqual(value, current.value)
                              ? current.status
                              : "idle",
                        });
                      }}
                      onStatusChange={(status) =>
                        updateRow(row.id, { status })
                      }
                      showStatusIcon
                    />
                  </div>
                  {rows.length > 1 ? (
                    <button
                      type="button"
                      className="mt-2 shrink-0 rounded-md px-2 py-1 text-sm text-tertiary hover:bg-hover hover:text-primary"
                      aria-label="Remove row"
                      onClick={() => removeRow(row.id)}
                    >
                      ×
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      )}
    </div>
  );
}
