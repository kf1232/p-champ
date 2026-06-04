export { LOCATION_FINDER_MAX_SECONDARY_LOCATIONS } from "./constants";
export {
  LOCATION_FINDER_STORAGE_TTL_MS,
  LOCATION_FINDER_FOOTER_CLEAR_CONFIRM,
  LOCATION_FINDER_TOOL_ID,
  LOCATION_FINDER_GEOCODE_RESPONSES_KEY,
  clearLocationFinderStoredData,
  exportLocationFinderCacheDownloadBody,
  getLocationFinderStorageServerSnapshot,
  getLocationFinderStorageSnapshot,
  parseLocationFinderStorageRaw,
  subscribeLocationFinderStorage,
  writeLocationFinderStoredData,
  findStoredGeocodeResponse,
  mergeGeocodeResponseIntoLocationFinderData,
  readGeocodeResponseMap,
  findStoredProximityDrivingDiagnostics,
  findStoredProximityMatches,
  findStoredProximityMetrics,
  mergeFormDraftIntoLocationFinderData,
  mergeProximityMatchesIntoLocationFinderData,
  readLocationFinderFormDraft,
} from "./store";
export type {
  LocationFinderStoredData,
  LocationFinderFormDraft,
  StoredSecondaryRow,
} from "./store";
export type {
  DistanceThreshold,
  DistanceUnit,
  ProximityMatch,
  ResolvedLocation,
} from "./distance/types";
export {
  normalizeDistanceUnit,
  isDrivingDistanceUnit,
  isStraightLineDistanceUnit,
} from "./distance/distanceUnit";
export {
  filterByMilesThreshold,
  filterByDrivingMilesThreshold,
  isValidThreshold,
  listProximityMetricsMiles,
  listProximityMetricsDriving,
} from "./distance/filterByThreshold";
export {
  isWithinMapDisplayCap,
  MAP_MAX_PROXIMITY_PERCENT,
  markerTierForDistance,
  markerTierFromProximityPercent,
  markerTierLegendLabel,
  MARKER_TIER_MAX_PERCENT,
  proximityPercent,
} from "./distance/proximityMarkerTier";
export type { ProximityMarkerTier } from "./distance/proximityMarkerTier";
export { BURKE_PROXIMITY_API_PATH } from "./distance/constants";
export {
  dedupeResolvedLocations,
  expandProximityMatches,
  expandProximityRoutingDiagnostics,
} from "./distance/dedupeResolvedLocations";
export type { DedupedResolvedLocations } from "./distance/dedupeResolvedLocations";
export {
  OFF_ROAD_SNAP_METERS,
  buildProximityRoutingDiagnostics,
  countRoutingFailures,
  formatRequestRoutingFailure,
  hasDrivingRoutingIssues,
  inferLikelyRootCause,
  routingLegFailureHint,
  routingLegFailureMessage,
} from "./distance/routingDiagnostics";
export type {
  ProximityRoutingDiagnostics,
  RoutedLegSummary,
  RoutingLegFailure,
  RoutingLegFailureCode,
  RoutingRequestFailure,
  RoutingRootCauseCode,
  RoutingRootCauseReport,
  UnroutedLegSummary,
} from "./distance/routingDiagnostics";
export {
  BURKE_LOCATION_FINDER_ACCESS_PATH,
  BURKE_LOCATION_FINDER_GRANT_COOKIE,
  BURKE_REVOKE_LOCATION_FINDER_ACCESS_PATH,
  BURKE_VERIFY_LOCATION_FINDER_PASSWORD_PATH,
} from "./access/constants";
export { parseLocationsCsv } from "./parseLocationsCsv";
export {
  INITIAL_SECONDARY_ROW_ID,
  nextSecondaryRowId,
} from "./secondaryRowId";
