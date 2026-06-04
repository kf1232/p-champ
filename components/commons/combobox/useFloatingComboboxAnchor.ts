"use client";

import {
  autoUpdate,
  flip,
  offset,
  size,
  useFloating,
} from "@floating-ui/react";
import type { CSSProperties } from "react";

type UseFloatingComboboxAnchorArgs = {
  open: boolean;
  maxHeightPx?: number;
};

export function useFloatingComboboxAnchor({
  open,
  maxHeightPx = 192,
}: UseFloatingComboboxAnchorArgs) {
  const { refs, floatingStyles } = useFloating({
    open,
    placement: "bottom-start",
    middleware: [
      offset(4),
      flip({ padding: 8 }),
      size({
        padding: 8,
        apply({ availableHeight, rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${Math.min(availableHeight, maxHeightPx)}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  return {
    setReferenceElement: refs.setReference,
    setFloatingElement: refs.setFloating,
    floatingStyles: floatingStyles as CSSProperties,
  };
}
