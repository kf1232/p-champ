"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";

import {
  addressFieldValuesEqual,
  emptyAddressFieldValue,
  isAddressResolved,
} from "@/lib/burke/geo/addressFieldValue";
import {
  deriveAddressFieldStatus,
  effectiveAddressFieldStatus,
  isLookupSettledForRow,
  shouldEmitAddressFieldStatusChange,
} from "@/lib/burke/geo/addressFieldStatus";
import type {
  AddressFieldStatus,
  AddressFieldValue,
  GeocodeResponse,
  GeocodeSuggestion,
} from "@/lib/burke/geo/types";

import { useGeocodeLookup } from "../../GeocodeLookupProvider";
import { nextComboboxHighlight } from "../utils/comboboxHighlight";
import { useClickOutside } from "./useClickOutside";

const LOOKUP_DEBOUNCE_MS = 250;

export type UseAddressFieldControllerArgs = {
  value: AddressFieldValue;
  onChange: (next: AddressFieldValue) => void;
  onStatusChange?: (status: AddressFieldStatus) => void;
  rowStatus?: AddressFieldStatus;
};

export type AddressFieldController = {
  listId: string;
  wrapRef: RefObject<HTMLDivElement | null>;
  displayStatus: AddressFieldStatus;
  open: boolean;
  inputValue: string;
  suggestions: GeocodeSuggestion[];
  highlight: number;
  onInputChange: (next: string) => void;
  onBlurInput: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocusInput: () => void;
  onSuggestionMouseDown: () => void;
  pickSuggestion: (suggestion: GeocodeSuggestion) => void;
};

export function useAddressFieldController({
  value,
  onChange,
  onStatusChange,
  rowStatus,
}: UseAddressFieldControllerArgs): AddressFieldController {
  const { lookup, peekLookup, lookupGeneration } = useGeocodeLookup();
  const peekLookupRef = useRef(peekLookup);

  useEffect(() => {
    peekLookupRef.current = peekLookup;
  }, [peekLookup]);

  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const selectingRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestGenRef = useRef(0);
  const lastScheduledQueryRef = useRef<string | null>(null);
  const lastHydratedQueryRef = useRef<string | null>(null);

  const onStatusChangeRef = useRef(onStatusChange);
  const rowStatusRef = useRef(rowStatus);
  const reportedStatusRef = useRef<AddressFieldStatus>(rowStatus ?? "idle");
  const lastEmittedStatusRef = useRef<AddressFieldStatus | null>(
    rowStatus ?? null,
  );

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value.query);
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [highlight, setHighlight] = useState(-1);
  const [lookupSettled, setLookupSettled] = useState(() =>
    isLookupSettledForRow(value, rowStatus),
  );
  const [reportedStatus, setReportedStatus] = useState<AddressFieldStatus>(
    () => rowStatus ?? "idle",
  );
  const [hydrated, setHydrated] = useState(
    () => !rowStatus || rowStatus === "idle" || isAddressResolved(value),
  );

  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    rowStatusRef.current = rowStatus;
  }, [rowStatus]);

  useEffect(() => {
    queueMicrotask(() => {
      setInputValue(value.query);
    });
  }, [value.query]);

  useLayoutEffect(() => {
    if (hydrated) {
      return;
    }
    const trimmed = value.query.trim();
    if (rowStatus === "warning" && trimmed.length >= 3) {
      const cached = peekLookupRef.current(trimmed);
      if (cached?.suggestions.length) {
        setSuggestions(cached.suggestions);
      }
    }
    if (rowStatus && rowStatus !== "idle") {
      setLookupSettled(true);
      reportedStatusRef.current = rowStatus;
      setReportedStatus(rowStatus);
      lastEmittedStatusRef.current = rowStatus;
    }
    setHydrated(true);
  }, [hydrated, rowStatus, value.query]);

  const displayStatus = effectiveAddressFieldStatus(
    value,
    hydrated ? reportedStatus : (rowStatus ?? reportedStatus),
  );

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    const nextStatus = deriveAddressFieldStatus(
      value,
      inputValue,
      suggestions.length,
      lookupSettled,
    );
    if (nextStatus !== reportedStatusRef.current) {
      reportedStatusRef.current = nextStatus;
      setReportedStatus(nextStatus);
    }
    if (
      shouldEmitAddressFieldStatusChange(
        nextStatus,
        lastEmittedStatusRef.current,
        rowStatusRef.current,
        { lookupSettled },
      )
    ) {
      lastEmittedStatusRef.current = nextStatus;
      onStatusChangeRef.current?.(nextStatus);
    }
  }, [
    hydrated,
    value.formatted,
    value.placeId,
    value.lat,
    value.lon,
    value.query,
    inputValue,
    suggestions.length,
    lookupSettled,
  ]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const closeList = useCallback(() => {
    setOpen(false);
    setHighlight(-1);
  }, []);

  useClickOutside(wrapRef, closeList);

  const applyGeocodeResponse = useCallback(
    (_query: string, result: GeocodeResponse) => {
      if (isAddressResolved(value)) {
        return;
      }
      const list =
        result.suggestions.length > 0
          ? result.suggestions
          : result.match
            ? [result.match]
            : [];
      setSuggestions(list);
      setOpen(list.length > 0);
      setHighlight(-1);
      setLookupSettled(true);
    },
    [value],
  );

  const runLookup = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) {
        setSuggestions([]);
        setOpen(false);
        setLookupSettled(false);
        return;
      }

      const gen = ++requestGenRef.current;
      setLookupSettled(false);

      try {
        const result = await lookup(trimmed);
        if (gen !== requestGenRef.current) {
          return;
        }
        applyGeocodeResponse(trimmed, result);
      } catch {
        if (gen !== requestGenRef.current) {
          return;
        }
        setSuggestions([]);
        setOpen(false);
        setHighlight(-1);
        setLookupSettled(true);
      }
    },
    [lookup, applyGeocodeResponse],
  );

  const scheduleLookup = useCallback(
    (next: string) => {
      const trimmed = next.trim();
      lastScheduledQueryRef.current = trimmed;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        void runLookup(trimmed);
      }, LOOKUP_DEBOUNCE_MS);
    },
    [runLookup],
  );

  useEffect(() => {
    const trimmed = inputValue.trim();
    if (trimmed.length < 3) {
      queueMicrotask(() => {
        setSuggestions([]);
        setOpen(false);
        setHighlight(-1);
        setLookupSettled(false);
      });
      return;
    }
    if (isAddressResolved(value)) {
      lastHydratedQueryRef.current = trimmed;
      return;
    }
    if (lastHydratedQueryRef.current === trimmed) {
      return;
    }

    const cached = peekLookupRef.current(trimmed);
    if (
      cached &&
      (cached.status === "found" || cached.suggestions.length > 0)
    ) {
      lastHydratedQueryRef.current = trimmed;
      applyGeocodeResponse(trimmed, cached);
      return;
    }
    if (
      !isAddressResolved(value) &&
      lastScheduledQueryRef.current !== trimmed
    ) {
      scheduleLookup(trimmed);
    }
  }, [
    inputValue,
    value.placeId,
    value.lat,
    value.lon,
    value.formatted,
    value.query,
    lookupGeneration,
    applyGeocodeResponse,
    scheduleLookup,
  ]);

  const pickSuggestion = useCallback(
    (suggestion: GeocodeSuggestion) => {
      const next: AddressFieldValue = {
        query: suggestion.formatted,
        formatted: suggestion.formatted,
        placeId: suggestion.placeId,
        lat: suggestion.lat,
        lon: suggestion.lon,
      };
      setInputValue(next.query);
      setSuggestions([]);
      setOpen(false);
      setHighlight(-1);
      setLookupSettled(true);
      if (addressFieldValuesEqual(value, next) && isAddressResolved(value)) {
        return;
      }
      onChange(next);
    },
    [onChange, value],
  );

  const resetTypingState = useCallback(() => {
    lastScheduledQueryRef.current = null;
    lastHydratedQueryRef.current = null;
    lastEmittedStatusRef.current = null;
    reportedStatusRef.current = "idle";
    setReportedStatus("idle");
    onStatusChangeRef.current?.("idle");
  }, []);

  const onInputChange = useCallback(
    (next: string) => {
      setInputValue(next);
      resetTypingState();
      onChange({
        ...emptyAddressFieldValue(),
        query: next,
      });
      const trimmed = next.trim();
      if (trimmed.length < 3) {
        setSuggestions([]);
        setOpen(false);
        setLookupSettled(false);
        return;
      }
      setOpen(true);
      scheduleLookup(trimmed);
    },
    [onChange, resetTypingState, scheduleLookup],
  );

  const onBlurInput = useCallback(() => {
    window.setTimeout(() => {
      if (selectingRef.current) {
        selectingRef.current = false;
        return;
      }
      closeList();
    }, 0);
  }, [closeList]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        if (suggestions.length > 0) {
          setOpen(true);
        }
        return;
      }
      if (!open) {
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        closeList();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) =>
          nextComboboxHighlight(h, suggestions.length, "down"),
        );
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => nextComboboxHighlight(h, suggestions.length, "up"));
        return;
      }
      if (
        e.key === "Enter" &&
        highlight >= 0 &&
        highlight < suggestions.length
      ) {
        e.preventDefault();
        const row = suggestions[highlight];
        if (row) {
          pickSuggestion(row);
        }
      }
    },
    [closeList, highlight, open, pickSuggestion, suggestions],
  );

  const onFocusInput = useCallback(() => {
    if (suggestions.length > 0) {
      setOpen(true);
    }
  }, [suggestions.length]);

  const onSuggestionMouseDown = useCallback(() => {
    selectingRef.current = true;
  }, []);

  return {
    listId,
    wrapRef,
    displayStatus,
    open,
    inputValue,
    suggestions,
    highlight,
    onInputChange,
    onBlurInput,
    onKeyDown,
    onFocusInput,
    onSuggestionMouseDown,
    pickSuggestion,
  };
}
