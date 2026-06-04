import type { ProximityMarkerTier } from "@/lib/burke";

export const LOCATION_FINDER_MAP_TARGET_COLOR = "#2563eb";

export const LOCATION_FINDER_MAP_TIER_COLORS: Record<ProximityMarkerTier, string> =
  {
    green: "#22c55e",
    yellow: "#ca8a04",
    orange: "#ea580c",
    red: "#dc2626",
    black: "#171717",
  };

export const LOCATION_FINDER_MAP_LEGEND: readonly {
  tier: ProximityMarkerTier | "target";
}[] = [
  { tier: "target" },
  { tier: "green" },
  { tier: "yellow" },
  { tier: "orange" },
  { tier: "red" },
  { tier: "black" },
];
