import type { Metadata } from "next";

import {
  APIZZA_NAV_LOVING_CUP,
  ApizzaLovingCupScreen,
} from "@/components/apizza";
import { PORTAL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `${APIZZA_NAV_LOVING_CUP} · ${PORTAL_NAME}`,
  },
};

export default function LovingCupPage() {
  return <ApizzaLovingCupScreen />;
}
