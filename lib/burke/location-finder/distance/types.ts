/** Straight-line (haversine) vs road network distance (OSRM driving miles). */
export type DistanceUnit = "miles" | "drivingMiles";

export type DistanceThreshold = {
  value: number;
  unit: DistanceUnit;
};

export type ResolvedLocation = {
  id: string;
  formatted: string;
  lat: number;
  lon: number;
};

export type ProximityMatch = {
  id: string;
  formatted: string;
  /** Straight-line or driving miles, depending on search mode. */
  miles: number;
  /** Driving time when OSRM was used; otherwise 0. */
  minutes: number;
};
