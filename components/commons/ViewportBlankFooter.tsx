"use client";

import {
  VIEWPORT_BLANK_FOOTER_ARIA,
  type ViewportBlankFooterKey,
} from "@/lib/viewportFooterChrome";

import { ViewportLockedFooterBar } from "./ViewportLockedFooterBar";

type ViewportBlankFooterProps = {
  footer: ViewportBlankFooterKey;
};

/** Fixed blank strip — `footer` selects the shared `aria-label`. */
export function ViewportBlankFooter({ footer }: ViewportBlankFooterProps) {
  return (
    <ViewportLockedFooterBar ariaLabel={VIEWPORT_BLANK_FOOTER_ARIA[footer]} />
  );
}
