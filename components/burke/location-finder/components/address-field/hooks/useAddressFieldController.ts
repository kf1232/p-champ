"use client";

import { useFloatingComboboxAnchor } from "@/components/commons";
import { useCombobox } from "downshift";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import {
  addressFieldValuesEqual,
  emptyAddressFieldValue,
  isAddressResolved,
  normalizeGeocodeQuery,
} from "@/lib/burke";
import {
  deriveAddressFieldStatus,
  effectiveAddressFieldStatus,
  isLookupSettledForRow,
  shouldEmitAddressFieldStatusChange,
} from "@/lib/burke";
import type {
  AddressFieldStatus,
  AddressFieldValue,
  GeocodeResponse,
  GeocodeSuggestion,
} from "@/lib/burke";

import {
  ADDRESS_FIELD_LOOKUP_DEBOUNCE_MS,
  ADDRESS_FIELD_MIN_LOOKUP_LENGTH,
} from "../../../configs/addressFieldLookup";
import { useGeocodeLookup } from "../../GeocodeLookupProvider";

export type UseAddressFieldControllerArgs = {
  value: AddressFieldValue;
  onChange: (next: AddressFieldValue) => void;
  onStatusChange?: (status: AddressFieldStatus) => void;
  rowStatus?: AddressFieldStatus;
};

export type AddressFieldController = {
  displayStatus: AddressFieldStatus;
  suggestions: GeocodeSuggestion[];
  isOpen: boolean;
  highlightedIndex: number;
  floatingStyles: CSSProperties;
  setReferenceElement: (node: HTMLInputElement | null) => void;
  setFloatingElement: (node: HTMLElement | null) => void;
  getInputProps: ReturnType<typeof useCombobox<GeocodeSuggestion>>["getInputProps"];
  getMenuProps: ReturnType<typeof useCombobox<GeocodeSuggestion>>["getMenuProps"];
  getItemProps: ReturnType<typeof useCombobox<GeocodeSuggestion>>["getItemProps"];
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

  const suppressInputValueChangeRef = useRef(false);
  const valueRef = useRef(value);
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

  const [inputValue, setInputValue] = useState(value.query);
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
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
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    rowStatusRef.current = rowStatus;
  }, [rowStatus]);

  useEffect(() => {
    if (inputValue === value.query) {
      return;
    }
    suppressInputValueChangeRef.current = true;
    queueMicrotask(() => {
      setInputValue(value.query);
      queueMicrotask(() => {
        suppressInputValueChangeRef.current = false;
      });
    });
  }, [value.query, inputValue]);

  useLayoutEffect(() => {
    if (hydrated) {
      return;
    }
    const trimmed = value.query.trim();
    if (
      rowStatus === "warning" &&
      trimmed.length >= ADDRESS_FIELD_MIN_LOOKUP_LENGTH
    ) {
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

  const listVisible = menuOpen && suggestions.length > 0;

  const { setReferenceElement, setFloatingElement, floatingStyles } =
    useFloatingComboboxAnchor({ open: listVisible });

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
      setMenuOpen(list.length > 0);
      setLookupSettled(true);
    },
    [value],
  );

  const runLookup = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) {
        setSuggestions([]);
        setMenuOpen(false);
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
        setMenuOpen(false);
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
      }, ADDRESS_FIELD_LOOKUP_DEBOUNCE_MS);
    },
    [runLookup],
  );

  const pickSuggestion = useCallback(
    (suggestion: GeocodeSuggestion) => {
      const next: AddressFieldValue = {
        query: suggestion.formatted,
        formatted: suggestion.formatted,
        placeId: suggestion.placeId,
        lat: suggestion.lat,
        lon: suggestion.lon,
      };
      suppressInputValueChangeRef.current = true;
      setInputValue(next.query);
      setSuggestions([]);
      setMenuOpen(false);
      setLookupSettled(true);
      reportedStatusRef.current = "success";
      setReportedStatus("success");
      lastEmittedStatusRef.current = "success";
      onStatusChangeRef.current?.("success");
      if (addressFieldValuesEqual(value, next) && isAddressResolved(value)) {
        queueMicrotask(() => {
          suppressInputValueChangeRef.current = false;
        });
        return;
      }
      onChange(next);
      queueMicrotask(() => {
        suppressInputValueChangeRef.current = false;
      });
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

  const shouldIgnoreInputMutation = useCallback((next: string): boolean => {
    const current = valueRef.current;
    if (!isAddressResolved(current)) {
      return false;
    }
    if (next === current.query) {
      return true;
    }
    if (
      current.formatted &&
      normalizeGeocodeQuery(next) === normalizeGeocodeQuery(current.formatted)
    ) {
      return true;
    }
    return false;
  }, []);

  const handleInputValueChange = useCallback(
    (next: string) => {
      if (suppressInputValueChangeRef.current) {
        return;
      }
      if (shouldIgnoreInputMutation(next)) {
        if (inputValue !== next) {
          setInputValue(next);
        }
        return;
      }
      setInputValue(next);
      resetTypingState();
      onChange({
        ...emptyAddressFieldValue(),
        query: next,
      });
      const trimmed = next.trim();
      if (trimmed.length < ADDRESS_FIELD_MIN_LOOKUP_LENGTH) {
        setSuggestions([]);
        setMenuOpen(false);
        setLookupSettled(false);
        return;
      }
      setSuggestions([]);
      setMenuOpen(false);
      scheduleLookup(trimmed);
    },
    [inputValue, onChange, resetTypingState, scheduleLookup, shouldIgnoreInputMutation],
  );

  useEffect(() => {
    const trimmed = inputValue.trim();
    if (trimmed.length < ADDRESS_FIELD_MIN_LOOKUP_LENGTH) {
      queueMicrotask(() => {
        setSuggestions([]);
        setMenuOpen(false);
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

  const {
    getInputProps,
    getMenuProps,
    getItemProps,
    highlightedIndex,
    isOpen,
  } = useCombobox<GeocodeSuggestion>({
    items: suggestions,
    inputValue,
    selectedItem: null,
    isOpen: menuOpen,
    itemToString: (item) => item?.formatted ?? "",
    onInputValueChange: ({ inputValue: next, type }) => {
      if (type !== useCombobox.stateChangeTypes.InputChange) {
        return;
      }
      handleInputValueChange(next ?? "");
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        pickSuggestion(selectedItem);
      }
    },
    onIsOpenChange: ({ isOpen: nextOpen }) => {
      if (nextOpen && suggestions.length === 0) {
        return;
      }
      setMenuOpen(nextOpen);
    },
  });

  return {
    displayStatus,
    suggestions,
    isOpen: isOpen && suggestions.length > 0,
    highlightedIndex,
    floatingStyles,
    setReferenceElement,
    setFloatingElement,
    getInputProps,
    getMenuProps,
    getItemProps,
  };
}
