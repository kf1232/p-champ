import type { Metadata } from "next";

import { TeamBuilderScreen } from "@/components/team-builder";

export const metadata: Metadata = {
  title: "Team Builder",
};

export default function TeamBuilderPage() {
  return <TeamBuilderScreen />;
}
