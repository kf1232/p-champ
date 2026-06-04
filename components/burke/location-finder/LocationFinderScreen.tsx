"use client";

import { useCallback, useEffect, useState } from "react";

import {
  BURKE_LOCATION_FINDER_ACCESS_PATH,
  BURKE_REVOKE_LOCATION_FINDER_ACCESS_PATH,
} from "@/lib/burke/location-finder/access/constants";
import { VIEWPORT_LOCKED_MAIN_PADDING_BOTTOM_PX } from "@/lib/viewportFooterChrome";

import { AppStorageFooterProvider } from "@/components/commons/AppStorageFooterContext";
import { AppViewportFooter } from "@/components/commons/AppViewportFooter";

import { BurkeNavHeader } from "../BurkeNavHeader";
import { GeocodeLookupProvider } from "./components/GeocodeLookupProvider";
import { LocationFinderGate } from "./components/LocationFinderGate";
import { LocationFinderStorageFooterRegistration } from "./components/LocationFinderStorageFooterRegistration";
import { LocationFinderFormWithStorageReset } from "./components/LocationFinderForm";
import { LocationFinderPageShell } from "./components/LocationFinderPageShell";
import { LocationFinderStorageProvider } from "./components/providers/LocationFinderStorageProvider";
import {
  LOCATION_FINDER_DESCRIPTION,
  LOCATION_FINDER_TITLE,
} from "./configs/locationFinderCopy";

const LOCATION_FINDER_STICKY_SUBMIT_H_PX = 56;
const LOCATION_FINDER_MAIN_PADDING_BOTTOM_PX =
  VIEWPORT_LOCKED_MAIN_PADDING_BOTTOM_PX +
  LOCATION_FINDER_STICKY_SUBMIT_H_PX;

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
    void runPreload();
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
            className="mx-auto w-full max-w-5xl flex-1 px-6 pt-10"
            style={{
              paddingBottom: LOCATION_FINDER_MAIN_PADDING_BOTTOM_PX,
            }}
          >
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold tracking-tight text-black">
                {LOCATION_FINDER_TITLE}
              </h1>
              <p className="max-w-prose text-black/70">
                {LOCATION_FINDER_DESCRIPTION}
              </p>
            </div>

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
