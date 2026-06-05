import type { Metadata } from "next";
import { Suspense } from "react";

import { CalendarScreen } from "@/components/scheduler/calendar";
import { PORTAL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `Calendar · Scheduler · ${PORTAL_NAME}`,
  },
};

export default function CalendarPage() {
  return (
    <Suspense fallback={null}>
      <CalendarScreen />
    </Suspense>
  );
}
