import { registerAppStorageClient } from "@/lib/storage/registry";
import { APP_STORAGE_KEYS } from "@/lib/storage/keys";

import { createBurkeLocationFinderEnvelopeClient } from "./burkeLocationFinderEnvelopeClient";

registerAppStorageClient(
  APP_STORAGE_KEYS.burkeLocationFinder,
  createBurkeLocationFinderEnvelopeClient(),
);
