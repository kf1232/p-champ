import type { ReactNode } from "react";

import { WowGroupAccessRevokeBridge } from "@/components/wow/components/WowGroupAccessRevokeBridge";

export default function WowLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <WowGroupAccessRevokeBridge />
      {children}
    </>
  );
}
