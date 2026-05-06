import type { Metadata } from "next";

import {
  PORTAL_DESCRIPTION,
  PORTAL_TITLE,
  PortalHomeScreen,
} from "@/components/portal";

export const metadata: Metadata = {
  title: PORTAL_TITLE,
  description: PORTAL_DESCRIPTION,
};

export default function PortalHomePage() {
  return <PortalHomeScreen />;
}
