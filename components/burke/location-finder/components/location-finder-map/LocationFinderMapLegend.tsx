"use client";

import {
  markerTierLegendLabel,
  type DistanceThreshold,
  type ProximityMarkerTier,
  type ProximityMatch,
} from "@/lib/burke";

import {
  LOCATION_FINDER_MAP_LEGEND,
  LOCATION_FINDER_MAP_TARGET_COLOR,
  LOCATION_FINDER_MAP_TIER_COLORS,
} from "../../configs/locationFinderMapColors";
import {
  isTierSelectionActive,
  pinIdsForMapTier,
} from "../../utils/mapListRows";

type LocationFinderMapLegendProps = {
  metrics: ProximityMatch[];
  threshold: DistanceThreshold;
  activePinIds: ReadonlySet<string>;
  onTierSelect: (tier: ProximityMarkerTier | "target") => void;
};

export function LocationFinderMapLegend({
  metrics,
  threshold,
  activePinIds,
  onTierSelect,
}: LocationFinderMapLegendProps) {
  return (
    <ul className="location-finder-map-legend" aria-label="Map marker filters">
      {LOCATION_FINDER_MAP_LEGEND.map(({ tier }) => {
        const color =
          tier === "target"
            ? LOCATION_FINDER_MAP_TARGET_COLOR
            : LOCATION_FINDER_MAP_TIER_COLORS[tier];
        const label =
          tier === "target" ? "Target" : markerTierLegendLabel(tier);
        const tierPinIds =
          tier === "target" ? [] : pinIdsForMapTier(metrics, threshold, tier);
        const isActive =
          tier === "target"
            ? activePinIds.size === 0
            : isTierSelectionActive(activePinIds, tierPinIds);
        const isDisabled = tier !== "target" && tierPinIds.length === 0;

        return (
          <li key={tier} className="location-finder-map-legend-item">
            <button
              type="button"
              className={`location-finder-map-legend-btn${isActive ? " location-finder-map-legend-btn--active" : ""}`}
              disabled={isDisabled}
              aria-pressed={tier === "target" ? activePinIds.size === 0 : isActive}
              onClick={() => onTierSelect(tier)}
            >
              <span
                className="location-finder-map-legend-swatch"
                style={{ backgroundColor: color }}
                aria-hidden
              />
              <span>{label}</span>
              {tier !== "target" && tierPinIds.length > 0 ? (
                <span className="location-finder-map-legend-count">
                  ({tierPinIds.length})
                </span>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
