/** Query keys for this route. Shared Wow errors: `../constants.js`. */

import { CLIENT_ERROR } from "../constants.js";

export { CLIENT_ERROR };

export const QUERY_PARAMS = Object.freeze({
  REGION: "region",
  REALM_SLUG: "realmSlug",
  NAME_SLUG: "nameSlug",
  NAMESPACE: "namespace",
  LOCALE: "locale",
});

export const REQUIRED_QUERY_PARAMS = Object.freeze([
  QUERY_PARAMS.REGION,
  QUERY_PARAMS.REALM_SLUG,
  QUERY_PARAMS.NAME_SLUG,
]);
