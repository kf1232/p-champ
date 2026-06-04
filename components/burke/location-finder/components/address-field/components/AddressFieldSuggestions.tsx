"use client";

import { FloatingComboboxMenu } from "@/components/commons";
import type { useCombobox } from "downshift";
import type { CSSProperties } from "react";

import type { GeocodeSuggestion } from "@/lib/burke";

type ComboboxGetters = Pick<
  ReturnType<typeof useCombobox<GeocodeSuggestion>>,
  "getMenuProps" | "getItemProps"
>;

type AddressFieldSuggestionsProps = ComboboxGetters & {
  isOpen: boolean;
  suggestions: GeocodeSuggestion[];
  highlightedIndex: number;
  floatingStyles: CSSProperties;
  setFloatingElement: (node: HTMLElement | null) => void;
};

export function AddressFieldSuggestions({
  isOpen,
  suggestions,
  highlightedIndex,
  floatingStyles,
  setFloatingElement,
  getMenuProps,
  getItemProps,
}: AddressFieldSuggestionsProps) {
  const showList = isOpen && suggestions.length > 0;

  return (
    <FloatingComboboxMenu
      showList={showList}
      getMenuProps={getMenuProps}
      setFloatingElement={setFloatingElement}
      floatingStyles={floatingStyles}
      className="z-50 overflow-auto rounded-md border border-border-default bg-surface py-1 shadow-md"
    >
      {showList
        ? suggestions.map((row, index) => (
            <li
              key={row.placeId}
              {...getItemProps({
                item: row,
                index,
                className: [
                  "cursor-pointer px-3 py-2 text-sm text-primary hover:bg-hover",
                  highlightedIndex === index ? "bg-black/[0.06]" : "",
                ].join(" "),
              })}
            >
              {row.formatted}
            </li>
          ))
        : null}
    </FloatingComboboxMenu>
  );
}
