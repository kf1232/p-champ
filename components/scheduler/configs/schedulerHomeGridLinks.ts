import { SCHEDULER_CALENDAR_PATH } from "@/lib/site";

export type SchedulerHomeGridLink = {
  href: string;
  label: string;
  ariaLabel: string;
};

/** Scheduler home grid tiles; `null` slots stay inactive placeholders. */
export const SCHEDULER_HOME_GRID_LINKS: (SchedulerHomeGridLink | null)[] = [
  {
    href: SCHEDULER_CALENDAR_PATH,
    label: "Calendar",
    ariaLabel: "Go to Calendar",
  },
];