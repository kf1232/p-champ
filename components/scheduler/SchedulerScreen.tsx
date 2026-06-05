import { AppPageIntro } from "@/components/commons";

import { SCHEDULER_TITLE } from "./configs/schedulerHomeCopy";
import { SchedulerPlaceholderGrid } from "./SchedulerPlaceholderGrid";

export function SchedulerScreen() {
  return (
    <>
      <AppPageIntro title={SCHEDULER_TITLE} />
      <SchedulerPlaceholderGrid />
    </>
  );
}
