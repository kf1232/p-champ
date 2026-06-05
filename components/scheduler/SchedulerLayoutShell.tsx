"use client";

import type { ReactNode } from "react";

import { SchedulerStorageFooterRegistration } from "./SchedulerStorageFooterRegistration";
import { SchedulerStorageProvider } from "./SchedulerStorageProvider";

/** Scheduler route providers — header/footer/main chrome come from `app/layout.tsx`. */
export function SchedulerLayoutShell({ children }: { children: ReactNode }) {
  return (
    <SchedulerStorageProvider>
      <SchedulerStorageFooterRegistration />
      {children}
    </SchedulerStorageProvider>
  );
}
