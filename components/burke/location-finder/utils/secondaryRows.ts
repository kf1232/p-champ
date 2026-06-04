import { emptyAddressFieldValue } from "@/lib/burke";
import type { AddressFieldStatus, AddressFieldValue } from "@/lib/burke";
import { INITIAL_SECONDARY_ROW_ID } from "@/lib/burke";

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
