import { ADDRESS_FIELD_MIN_QUERY_LENGTH } from "@/lib/burke";

/** Minimum typed characters before geocode autocomplete runs. */
export const ADDRESS_FIELD_MIN_LOOKUP_LENGTH = ADDRESS_FIELD_MIN_QUERY_LENGTH;

/** Idle period after typing before a lookup request is sent (ms). */
export const ADDRESS_FIELD_LOOKUP_DEBOUNCE_MS = 2500;
