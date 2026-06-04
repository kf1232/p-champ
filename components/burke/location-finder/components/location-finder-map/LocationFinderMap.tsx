"use client";

import { useEffect, useMemo, useRef } from "react";

import {
  isDrivingDistanceUnit,
  isWithinMapDisplayCap,
  markerTierForDistance,
  proximityPercent,
  type DistanceThreshold,
  type ProximityMatch,
  type ResolvedLocation,
} from "@/lib/burke";

import {
  LOCATION_FINDER_MAP_TARGET_COLOR,
  LOCATION_FINDER_MAP_TIER_COLORS,
} from "../../configs/locationFinderMapColors";

type LocationFinderMapProps = {
  target: ResolvedLocation;
  secondaries: ResolvedLocation[];
  threshold: DistanceThreshold;
  metrics: ProximityMatch[];
  activePinIds: ReadonlySet<string>;
  onPinToggle: (secondaryId: string) => void;
  onClearSelection: () => void;
};

function formatDistanceLabel(
  metric: ProximityMatch,
  threshold: DistanceThreshold,
): string {
  const distance = metric.miles;
  const distanceText = `${distance.toFixed(1)} mi`;
  const pct = Math.round(proximityPercent(distance, threshold.value));
  const mode = isDrivingDistanceUnit(threshold.unit) ? "driving" : "straight-line";
  const driveTime =
    isDrivingDistanceUnit(threshold.unit) && metric.minutes > 0
      ? ` · ${Math.round(metric.minutes)} min drive`
      : "";
  return `${distanceText} ${mode}${driveTime} (${pct}% of threshold)`;
}

export function LocationFinderMap({
  target,
  secondaries,
  threshold,
  metrics,
  activePinIds,
  onPinToggle,
  onClearSelection,
}: LocationFinderMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onPinToggleRef = useRef(onPinToggle);
  const onClearSelectionRef = useRef(onClearSelection);

  useEffect(() => {
    onPinToggleRef.current = onPinToggle;
    onClearSelectionRef.current = onClearSelection;
  });

  const metricsById = useMemo(
    () => new Map(metrics.map((row) => [row.id, row])),
    [metrics],
  );

  const activePinKey = useMemo(
    () => [...activePinIds].sort().join(","),
    [activePinIds],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let disposed = false;
    let map: import("leaflet").Map | null = null;

    void (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (disposed) {
        return;
      }

      map = L.map(container, { scrollWheelZoom: true });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      const bounds: import("leaflet").LatLngExpression[] = [];

      const targetLatLng: import("leaflet").LatLngExpression = [
        target.lat,
        target.lon,
      ];
      bounds.push(targetLatLng);
      L.circleMarker(targetLatLng, {
        radius: 10,
        fillColor: LOCATION_FINDER_MAP_TARGET_COLOR,
        color: "#ffffff",
        weight: 2,
        fillOpacity: 1,
      })
        .bindTooltip(target.formatted, { direction: "top", offset: [0, -8] })
        .addTo(layerGroup);

      for (const dest of secondaries) {
        const metric = metricsById.get(dest.id);
        if (!metric) {
          continue;
        }
        const distance = metric.miles;
        if (!isWithinMapDisplayCap(distance, threshold.value)) {
          continue;
        }
        const selected = activePinIds.has(dest.id);
        const tier = markerTierForDistance(distance, threshold.value);
        const latLng: import("leaflet").LatLngExpression = [dest.lat, dest.lon];
        bounds.push(latLng);
        const marker = L.circleMarker(latLng, {
          radius: selected ? 11 : 8,
          fillColor: LOCATION_FINDER_MAP_TIER_COLORS[tier],
          color: selected ? "#0f172a" : "#ffffff",
          weight: selected ? 3 : 2,
          fillOpacity: 1,
        })
          .bindTooltip(
            `${dest.formatted}<br/>${formatDistanceLabel(metric, threshold)}`,
            { direction: "top", offset: [0, -6] },
          )
          .addTo(layerGroup);

        marker.on("click", (ev) => {
          L.DomEvent.stopPropagation(ev);
          onPinToggleRef.current(dest.id);
        });
      }

      map.on("click", () => {
        onClearSelectionRef.current();
      });

      if (bounds.length === 0) {
        map.setView([39.5, -98.35], 4);
      } else if (bounds.length === 1) {
        map.setView(bounds[0], 12);
      } else {
        map.fitBounds(L.latLngBounds(bounds), {
          padding: [32, 32],
          maxZoom: 13,
        });
      }
    })();

    return () => {
      disposed = true;
      map?.remove();
    };
  }, [
    target,
    secondaries,
    threshold,
    metrics,
    metricsById,
    activePinKey,
    activePinIds,
  ]);

  return (
    <div
      ref={containerRef}
      className="location-finder-map"
      role="application"
      aria-label="Map of target and secondary job locations. Click a secondary pin to filter the list."
    />
  );
}
