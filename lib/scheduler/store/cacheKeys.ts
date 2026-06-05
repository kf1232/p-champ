/** Identifies this cache blob as Scheduler only (not other tools). */
export const SCHEDULER_TOOL_ID = "scheduler" as const;

export const SCHEDULER_FOOTER_CLEAR_CONFIRM =
  "Clear scheduler cache on this device?";

import { CALENDAR_SELECTED_CALENDAR_ID_KEY } from "../calendar/storageKeys";

/** Only these keys are read, written, sized, or exported for this tool. */
export const SCHEDULER_ALLOWED_DATA_KEYS = [
  CALENDAR_SELECTED_CALENDAR_ID_KEY,
] as const;
export type SchedulerAllowedDataKey =
  (typeof SCHEDULER_ALLOWED_DATA_KEYS)[number];
