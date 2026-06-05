import type { Metadata } from "next";

import { SchedulerScreen } from "@/components/scheduler";
import { PORTAL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `Scheduler · ${PORTAL_NAME}`,
  },
};

export default function SchedulerPage() {
  return <SchedulerScreen />;
}
