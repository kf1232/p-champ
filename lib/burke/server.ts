/** Server-only Burke APIs. Import from `@/lib/burke/server` (not `@/lib/burke`). */

export {
  buildGrantCookie,
  createGrantToken,
  getLocationFinderPreloadStatus,
  getLocationFinderSecret,
  grantCookieOptions,
  hasValidLocationFinderGrant,
  isLocationFinderGateConfigured,
  requireLocationFinderApiAccess,
  verifyLocationFinderPassword,
} from "./location-finder/server";
export { geoGoogleMapsApiKey } from "./geo/googleGeocodeSearch";
export { geocodeServiceUnavailableResponse } from "./geo/geocodeApiErrors";
export {
  resolveAddressQuery,
  resolveAddressQueries,
} from "./geo/resolveAddress";
export { fetchOsrmTableMetrics } from "./location-finder/distance/osrmTable";
