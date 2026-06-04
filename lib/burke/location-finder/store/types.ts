/** JSON `data` object inside the Location Finder storage envelope. */
export type LocationFinderStoredData = Record<string, unknown>;

export type LocationFinderStorageParse = {
  data: LocationFinderStoredData;
  storedAt: number | null;
};
