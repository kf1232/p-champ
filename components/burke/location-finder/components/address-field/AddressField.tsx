"use client";

import { effectiveAddressFieldStatus } from "@/lib/burke";
import type { AddressFieldStatus, AddressFieldValue } from "@/lib/burke";

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
  const {
    displayStatus,
    suggestions,
    isOpen,
    highlightedIndex,
    floatingStyles,
    setReferenceElement,
    setFloatingElement,
    getInputProps,
    getMenuProps,
    getItemProps,
  } = useAddressFieldController({
    value,
    onChange,
    onStatusChange,
    rowStatus,
  });

  const statusForIcon = effectiveAddressFieldStatus(value, displayStatus);
  const showInlineStatus = showStatusIcon && statusForIcon !== "idle";

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label className="text-sm font-medium text-black" htmlFor={id}>
          {label}
        </label>
      ) : null}

      <div
        className={
          showStatusIcon
            ? "flex min-w-0 items-start gap-2"
            : "relative min-w-0"
        }
      >
        <div className="relative min-w-0 flex-1">
          <input
            {...getInputProps({
              ref: setReferenceElement,
              id,
              name,
              required,
              className: LOCATION_FINDER_INPUT_CLASS,
              autoComplete: "off",
              spellCheck: false,
              placeholder: "Street, city, state, postal code",
            })}
          />
        </div>
        {showStatusIcon ? (
          <span
            className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center"
            aria-hidden={!showInlineStatus}
            aria-label={
              showInlineStatus
                ? ADDRESS_FIELD_STATUS_ARIA[statusForIcon]
                : undefined
            }
          >
            {showInlineStatus ? (
              <AddressStatusGlyph status={statusForIcon} size="row" />
            ) : null}
          </span>
        ) : null}
      </div>

      <AddressFieldSuggestions
        isOpen={isOpen}
        suggestions={suggestions}
        highlightedIndex={highlightedIndex}
        floatingStyles={floatingStyles}
        setFloatingElement={setFloatingElement}
        getMenuProps={getMenuProps}
        getItemProps={getItemProps}
      />
    </div>
  );
}
