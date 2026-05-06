/** Shared across all `app/api/wow/*` routes and handlers. */

export const CLIENT_ERROR = Object.freeze({
  MISSING_QUERY_PARAMS: "missing_query_params",
  UNSUPPORTED_REGION: "unsupported_region",
  OAUTH_UNAVAILABLE: "oauth_unavailable",
});
