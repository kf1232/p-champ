import Link from "next/link";
import { Fragment, type ReactNode } from "react";

export type WowBreadcrumbItem = {
  label: string;
  /** Omit for the current (last) segment. */
  href?: string;
};

export function WowScreenShell({
  breadcrumbItems,
  children,
}: {
  breadcrumbItems: readonly WowBreadcrumbItem[];
  children: ReactNode;
}) {
  return (
    <div className="wow-screen-root">
      <header className="wow-screen-header">
        <div className="wow-screen-header-inner">
          {breadcrumbItems.map((item, i) => (
            <Fragment key={`${item.label}-${item.href ?? "current"}-${i}`}>
              {i > 0 ? (
                <span className="wow-screen-breadcrumb-sep" aria-hidden>
                  /
                </span>
              ) : null}
              {item.href ? (
                <Link
                  href={item.href}
                  className="wow-screen-portal-link"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="wow-screen-breadcrumb-current">{item.label}</span>
              )}
            </Fragment>
          ))}
        </div>
      </header>

      <main className="wow-screen-main">{children}</main>
    </div>
  );
}
