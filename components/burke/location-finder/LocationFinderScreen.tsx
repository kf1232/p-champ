"use client";

import { useCallback, useEffect, useState } from "react";

import {
  BURKE_LOCATION_FINDER_ACCESS_PATH,
  BURKE_REVOKE_LOCATION_FINDER_ACCESS_PATH,
} from "@/lib/burke";

import { GeocodeLookupProvider } from "./components/GeocodeLookupProvider";
import { LocationFinderGate } from "./components/LocationFinderGate";
import { LocationFinderStorageFooterRegistration } from "./components/LocationFinderStorageFooterRegistration";
import { LocationFinderFormWithStorageReset } from "./components/LocationFinderForm";
import { LocationFinderStorageProvider } from "./components/providers/LocationFinderStorageProvider";
import { LOCATION_FINDER_TITLE } from "./configs/locationFinderCopy";

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
    return null;
  }

  if (!granted) {
    return (
      <LocationFinderGate
        configured={gateConfigured}
        onGranted={() => {
          void runPreload();
        }}
      />
    );
  }

  return (
    <LocationFinderStorageProvider>
      <LocationFinderStorageFooterRegistration />
      <h1 className="text-3xl font-semibold tracking-tight text-primary">
        {LOCATION_FINDER_TITLE}
      </h1>

      <GeocodeLookupProvider onUnauthorized={denyAccess}>
        <LocationFinderFormWithStorageReset onUnauthorized={denyAccess} />
      </GeocodeLookupProvider>
    </LocationFinderStorageProvider>
  );
}
