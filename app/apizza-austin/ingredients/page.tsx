import type { Metadata } from "next";

import {
  APIZZA_NAV_INGREDIENTS,
  ApizzaIngredientsScreen,
} from "@/components/apizza";
import { PORTAL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `${APIZZA_NAV_INGREDIENTS} · ${PORTAL_NAME}`,
  },
};

export default function ApizzaIngredientsPage() {
  return <ApizzaIngredientsScreen />;
}
