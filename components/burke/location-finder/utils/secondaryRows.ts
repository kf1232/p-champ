import { emptyAddressFieldValue } from "@/lib/burke/geo/addressFieldValue";
import type { AddressFieldStatus, AddressFieldValue } from "@/lib/burke/geo/types";
import { INITIAL_SECONDARY_ROW_ID } from "@/lib/burke/location-finder/secondaryRowId";

export type SecondaryLocationRow = {
  id: string;
  value: AddressFieldValue;
  status: AddressFieldStatus;
};

export function createInitialSecondaryRows(): SecondaryLocationRow[] {
  return [
    {
      id: INITIAL_SECONDARY_ROW_ID,
      value: emptyAddressFieldValue(),
      status: "idle",
    },
  ];
}
