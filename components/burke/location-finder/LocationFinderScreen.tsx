"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";

import {
  BURKE_LOCATION_FINDER_ACCESS_PATH,
  BURKE_REVOKE_LOCATION_FINDER_ACCESS_PATH,
} from "@/lib/burke";
import {
  MAIN_SPACER_ABOVE_VIEWPORT_FOOTER_PX,
  VIEWPORT_LOCKED_FOOTER_H_PX,
  VIEWPORT_STICKY_ABOVE_FOOTER_GAP_REM,
  VIEWPORT_STICKY_ACTION_BAND_MIN_REM,
} from "@/lib/viewportFooterChrome";

import { AppStorageFooterProvider } from "@/components/commons";
import { AppViewportFooter } from "@/components/commons";

import { BurkeNavHeader } from "../BurkeNavHeader";
import { GeocodeLookupProvider } from "./components/GeocodeLookupProvider";
import { LocationFinderGate } from "./components/LocationFinderGate";
import { LocationFinderStorageFooterRegistration } from "./components/LocationFinderStorageFooterRegistration";
import { LocationFinderFormWithStorageReset } from "./components/LocationFinderForm";
import { LocationFinderPageShell } from "./components/LocationFinderPageShell";
import { LocationFinderStorageProvider } from "./components/providers/LocationFinderStorageProvider";
import { LOCATION_FINDER_TITLE } from "./configs/locationFinderCopy";

const locationFinderMainStyle = {
  "--burke-viewport-footer-h": `${VIEWPORT_LOCKED_FOOTER_H_PX}px`,
  "--burke-main-scroll-spacer": `${MAIN_SPACER_ABOVE_VIEWPORT_FOOTER_PX}px`,
  "--burke-sticky-above-footer-gap": `${VIEWPORT_STICKY_ABOVE_FOOTER_GAP_REM}rem`,
  "--burke-sticky-submit-band-min-h": `${VIEWPORT_STICKY_ACTION_BAND_MIN_REM}rem`,
} as CSSProperties;

type PreloadStatus = {
  configured: boolean;
  granted: boolean;
};

type LocationFinderScreenProps = {
  initialGranted: boolean;
  gateConfigured: boolean;
};

export function LocationFinderScreen({
  initialGranted,
  gateConfigured,
}: LocationFinderScreenProps) {
  const [granted, setGranted] = useState(initialGranted && gateConfigured);
  const [preloadReady, setPreloadReady] = useState(false);

  const denyAccess = useCallback(() => {
    setGranted(false);
  }, []);

  const runPreload = useCallback(async () => {
    try {
      const res = await fetch(BURKE_LOCATION_FINDER_ACCESS_PATH, {
        credentials: "same-origin",
        cache: "no-store",
      });
      const data = (await res.json().catch(() => ({}))) as PreloadStatus;
      const configured = data.configured === true;
      const nextGranted = res.ok && configured && data.granted === true;
      setGranted(nextGranted);
    } catch {
      setGranted(false);
    } finally {
      setPreloadReady(true);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void runPreload();
    });
  }, [runPreload]);

  useEffect(() => {
    return () => {
      void fetch(BURKE_REVOKE_LOCATION_FINDER_ACCESS_PATH, {
        method: "POST",
        credentials: "same-origin",
      });
    };
  }, []);

  if (!preloadReady) {
    return <LocationFinderPageShell />;
  }

  if (!granted) {
    return (
      <LocationFinderPageShell>
        <LocationFinderGate
          configured={gateConfigured}
          onGranted={() => {
            void runPreload();
          }}
        />
      </LocationFinderPageShell>
    );
  }

  return (
    <LocationFinderStorageProvider>
      <AppStorageFooterProvider>
        <LocationFinderStorageFooterRegistration />
        <div className="flex min-h-full flex-col">
          <BurkeNavHeader />

          <main
            className="location-finder-layout-main mx-auto w-full max-w-5xl flex-1 px-6 pt-10"
            style={locationFinderMainStyle}
          >
            <h1 className="text-3xl font-semibold tracking-tight text-black">
              {LOCATION_FINDER_TITLE}
            </h1>

            <GeocodeLookupProvider onUnauthorized={denyAccess}>
              <LocationFinderFormWithStorageReset onUnauthorized={denyAccess} />
            </GeocodeLookupProvider>
          </main>
        </div>

        <AppViewportFooter />
      </AppStorageFooterProvider>
    </LocationFinderStorageProvider>
  );
}
