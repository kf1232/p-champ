/** Server-only Location Finder APIs (cookies, grants). Import from `@/lib/burke/server`. */

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
} from "./access/locationFinderGrant";
