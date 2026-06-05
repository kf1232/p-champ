import type { ReactNode } from "react";

import { SchedulerLayoutShell } from "@/components/scheduler";

export default function SchedulerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SchedulerLayoutShell>{children}</SchedulerLayoutShell>;
}
