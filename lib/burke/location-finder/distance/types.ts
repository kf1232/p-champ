export type DistanceUnit = "miles" | "minutes";

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
  miles: number;
  minutes: number;
};
