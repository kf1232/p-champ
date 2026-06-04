import type { AddressStatusDisplayKey } from "@/lib/burke";

export const ADDRESS_FIELD_STATUS_ARIA: Record<
  AddressStatusDisplayKey,
  string
> = {
  success: "Address confirmed",
  warning: "Select an address from the list",
  error: "No matching addresses found",
};
