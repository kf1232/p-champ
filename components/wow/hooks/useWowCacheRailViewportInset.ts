"use client";

import { useLayoutEffect, type RefObject } from "react";

const STICKY_TOP_FALLBACK_PX = 8;

/**
 * Writes `--app-viewport-rail-top` on the rail element (px distance from the viewport
 * top to the rail’s top edge). `app-chrome__viewport-rail` uses it for `max-height`;
 * when stuck, `top` approaches the sticky offset (~0.5rem).
 */
export function useWowCacheRailViewportInset<T extends HTMLElement>(
  railRef: RefObject<T | null>,
): void {
  useLayoutEffect(() => {
    const el = railRef.current;
    if (!el) return;

    const update = () => {
      const raw = el.getBoundingClientRect().top;
      const px =
        raw < 0
          ? STICKY_TOP_FALLBACK_PX
          : Math.max(0, Math.round(raw * 10) / 10);
      el.style.setProperty("--app-viewport-rail-top", `${px}px`);
    };

    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    const ro = new ResizeObserver(update);
    const main = el.closest(".app-page");
    if (main) ro.observe(main);
    ro.observe(el);

    const vv = typeof window !== "undefined" ? window.visualViewport : null;
    if (vv) {
      vv.addEventListener("resize", update);
      vv.addEventListener("scroll", update);
    }

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro.disconnect();
      if (vv) {
        vv.removeEventListener("resize", update);
        vv.removeEventListener("scroll", update);
      }
    };
  }, [railRef]);
}
