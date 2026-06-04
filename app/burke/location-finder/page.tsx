import type { Metadata } from "next";
import { cookies } from "next/headers";

import { LocationFinderScreen } from "@/components/burke/location-finder";
import { BURKE_LOCATION_FINDER_GRANT_COOKIE } from "@/lib/burke/location-finder/access/constants";
import {
  hasValidLocationFinderGrant,
  isLocationFinderGateConfigured,
} from "@/lib/burke/location-finder/access/locationFinderGrant";

export const metadata: Metadata = {
  title: "Location Finder",
};

export default async function LocationFinderPage() {
  const gateConfigured = isLocationFinderGateConfigured();
  const store = await cookies();
  const initialGranted =
    gateConfigured &&
    hasValidLocationFinderGrant(
      store.get(BURKE_LOCATION_FINDER_GRANT_COOKIE)?.value,
    );

  return (
    <LocationFinderScreen
      initialGranted={initialGranted}
      gateConfigured={gateConfigured}
    />
  );
}
