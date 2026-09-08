import type { Metadata } from "next";

import {
  APIZZA_APIZZZA_HEADING,
  ApizzaImagePage,
} from "@/components/apizza";
import { PORTAL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `${APIZZA_APIZZZA_HEADING} · ${PORTAL_NAME}`,
  },
};

export default function ApizzzaPage() {
  return (
    <ApizzaImagePage src="/apizza/apizzza.jpg" alt={APIZZA_APIZZZA_HEADING} />
  );
}
