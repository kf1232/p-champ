import type { AddressFieldValue } from "./types";

export function emptyAddressFieldValue(): AddressFieldValue {
  return {
    query: "",
    formatted: null,
    placeId: null,
    lat: null,
    lon: null,
  };
}

export function isAddressResolved(value: AddressFieldValue): boolean {
  return (
    value.formatted !== null &&
    value.placeId !== null &&
    value.lat !== null &&
    value.lon !== null
  );
}

export function addressFieldValuesEqual(
  a: AddressFieldValue,
  b: AddressFieldValue,
): boolean {
  return (
    a.query === b.query &&
    a.formatted === b.formatted &&
    a.placeId === b.placeId &&
    a.lat === b.lat &&
    a.lon === b.lon
  );
}
