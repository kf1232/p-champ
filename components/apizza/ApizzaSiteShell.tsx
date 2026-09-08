import type { ReactNode } from "react";

import { apizzaNav } from "./apizzaFonts";
import { ApizzaBrandBanner } from "./ApizzaBrandBanner";
import { ApizzaSiteFooter } from "./ApizzaSiteFooter";
import { ApizzaSiteHeader } from "./ApizzaSiteHeader";

export function ApizzaSiteShell({ children }: { children: ReactNode }) {
  return (
    <div
      className={["apizza-site", apizzaNav.variable].join(" ")}
    >
      <ApizzaSiteHeader />
      <ApizzaBrandBanner />
      <main className="apizza-site-main">{children}</main>
      <ApizzaSiteFooter />
    </div>
  );
}
