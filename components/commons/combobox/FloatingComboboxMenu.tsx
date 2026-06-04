"use client";

import { FloatingPortal } from "@floating-ui/react";
import type { useCombobox } from "downshift";
import type { CSSProperties, ReactNode } from "react";

type GetMenuProps = ReturnType<typeof useCombobox<unknown>>["getMenuProps"];

type FloatingComboboxMenuProps = {
  /** When false, menu stays mounted for Downshift but is hidden. */
  showList: boolean;
  getMenuProps: GetMenuProps;
  setFloatingElement: (node: HTMLElement | null) => void;
  floatingStyles: CSSProperties;
  className?: string;
  children: ReactNode;
};

export function FloatingComboboxMenu({
  showList,
  getMenuProps,
  setFloatingElement,
  floatingStyles,
  className = "",
  children,
}: FloatingComboboxMenuProps) {
  return (
    <FloatingPortal>
      <ul
        {...getMenuProps(
          {
            ref: setFloatingElement,
            hidden: !showList,
            style: {
              ...floatingStyles,
              visibility: showList ? "visible" : "hidden",
              pointerEvents: showList ? "auto" : "none",
            },
            className,
          },
          { suppressRefError: !showList },
        )}
      >
        {children}
      </ul>
    </FloatingPortal>
  );
}
