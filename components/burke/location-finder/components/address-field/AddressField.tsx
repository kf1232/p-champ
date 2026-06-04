"use client";

import { effectiveAddressFieldStatus } from "@/lib/burke/geo/addressFieldStatus";
import type { AddressFieldStatus, AddressFieldValue } from "@/lib/burke/geo/types";

import { ADDRESS_FIELD_STATUS_ARIA } from "../../configs/addressFieldCopy";
import { LOCATION_FINDER_INPUT_CLASS } from "../../configs/locationFinderStyles";
import { AddressStatusGlyph } from "../AddressStatusGlyph";
import { AddressFieldSuggestions } from "./components/AddressFieldSuggestions";
import { useAddressFieldController } from "./hooks/useAddressFieldController";

export type AddressFieldProps = {
  id: string;
  label?: string;
  name: string;
  value: AddressFieldValue;
  onChange: (next: AddressFieldValue) => void;
  onStatusChange?: (status: AddressFieldStatus) => void;
  /** Parent row status (e.g. after bulk geocode) — avoids idle flash and update loops. */
  rowStatus?: AddressFieldStatus;
  required?: boolean;
  showStatusIcon?: boolean;
};

export function AddressField({
  id,
  label,
  name,
  value,
  onChange,
  onStatusChange,
  rowStatus,
  required = false,
  showStatusIcon = false,
}: AddressFieldProps) {
  const controller = useAddressFieldController({
    value,
    onChange,
    onStatusChange,
    rowStatus,
  });

  const {
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
  } = controller;

  const statusForIcon = effectiveAddressFieldStatus(value, displayStatus);
  const showInlineStatus = showStatusIcon && statusForIcon !== "idle";

  return (
    <div className="flex flex-col gap-1.5" ref={wrapRef}>
      {label ? (
        <label className="text-sm font-medium text-black" htmlFor={id}>
          {label}
        </label>
      ) : null}

      <div className="relative">
        <input
          id={id}
          name={name}
          type="text"
          role="combobox"
          className={[
            LOCATION_FINDER_INPUT_CLASS,
            showStatusIcon ? "pr-9" : "",
          ].join(" ")}
          autoComplete="off"
          spellCheck={false}
          placeholder="Street, city, state, postal code"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={open && suggestions.length > 0}
          aria-haspopup="listbox"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={onFocusInput}
          onBlur={onBlurInput}
          onKeyDown={onKeyDown}
          required={required}
        />
        {showInlineStatus ? (
          <span
            className="pointer-events-none absolute inset-y-0 right-2 flex items-center"
            aria-label={ADDRESS_FIELD_STATUS_ARIA[statusForIcon]}
          >
            <AddressStatusGlyph status={statusForIcon} size="row" />
          </span>
        ) : null}
      </div>

      <AddressFieldSuggestions
        listId={listId}
        open={open}
        suggestions={suggestions}
        highlight={highlight}
        onMouseDownOption={onSuggestionMouseDown}
        onPick={pickSuggestion}
      />
    </div>
  );
}
