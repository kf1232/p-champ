"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  PORTAL_HOME_PATH,
  PORTAL_NAME,
  SCHEDULER_CALENDAR_PATH,
  SCHEDULER_HOME_PATH,
} from "@/lib/site";

import { SCHEDULER_TITLE } from "./configs/schedulerHomeCopy";

type SchedulerNavProps = {
  title?: string;
};

/** Scheduler nav — inner content only (`AppViewportHeader` supplies the shell). */
export function SchedulerNav({ title = SCHEDULER_TITLE }: SchedulerNavProps) {
  const pathname = usePathname() ?? "";
  const isSchedulerHome = pathname === SCHEDULER_HOME_PATH;
  const isCalendar = pathname === SCHEDULER_CALENDAR_PATH;

  return (
    <>
      <div className="header-title">
        <Link href={PORTAL_HOME_PATH} className="header-title__parent-link">
          {PORTAL_NAME}
        </Link>
        <span className="header-title__separator" aria-hidden>
          /
        </span>
        {isSchedulerHome ? (
          <span className="header-title__current">{title}</span>
        ) : (
          <Link
            href={SCHEDULER_HOME_PATH}
            className="header-title__link"
            aria-label={`${title} (home)`}
          >
            {title}
          </Link>
        )}
      </div>

      <nav
        aria-label="Scheduler primary navigation"
        className="header-navigation"
      >
        <Link
          href={SCHEDULER_HOME_PATH}
          className={[
            "header-navigation__link",
            isSchedulerHome
              ? "header-navigation__link--current"
              : "header-navigation__link--inactive",
          ].join(" ")}
          aria-current={isSchedulerHome ? "page" : undefined}
        >
          Home
        </Link>
        <Link
          href={SCHEDULER_CALENDAR_PATH}
          className={[
            "header-navigation__link",
            isCalendar
              ? "header-navigation__link--current"
              : "header-navigation__link--inactive",
          ].join(" ")}
          aria-current={isCalendar ? "page" : undefined}
        >
          Calendar
        </Link>
      </nav>
    </>
  );
}
