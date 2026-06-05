/** JSON `data` object inside the Scheduler storage envelope. */
export type SchedulerStoredData = Record<string, unknown>;

export type SchedulerStorageParse = {
  data: SchedulerStoredData;
  storedAt: number | null;
};
