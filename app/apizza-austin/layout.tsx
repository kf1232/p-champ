import { cookies } from "next/headers";
import type { ReactNode } from "react";

import { ApizzaGateScreen, ApizzaSiteShell } from "@/components/apizza";
import { apizzaNav } from "@/components/apizza/apizzaFonts";
import {
  APIZZA_GRANT_COOKIE,
  hasValidApizzaGrant,
} from "@/lib/apizza/access/server";

export default async function ApizzaLayout({ children }: { children: ReactNode }) {
  const store = await cookies();
  const granted = hasValidApizzaGrant(store.get(APIZZA_GRANT_COOKIE)?.value);

  if (!granted) {
    return (
      <div className={["apizza-site", apizzaNav.variable].join(" ")}>
        <ApizzaGateScreen />
      </div>
    );
  }

  return <ApizzaSiteShell>{children}</ApizzaSiteShell>;
}
