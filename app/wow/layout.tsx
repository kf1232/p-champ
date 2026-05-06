import type { ReactNode } from "react";

import { WowLayoutShell } from "@/components/wow";

export default function WowLayout({ children }: { children: ReactNode }) {
  return <WowLayoutShell>{children}</WowLayoutShell>;
}
