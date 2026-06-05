import { registerAppStorageClient } from "@/lib/storage/registry";
import { APP_STORAGE_KEYS } from "@/lib/storage/keys";

import { createSchedulerEnvelopeClient } from "./schedulerEnvelopeClient";

registerAppStorageClient(
  APP_STORAGE_KEYS.scheduler,
  createSchedulerEnvelopeClient(),
);
