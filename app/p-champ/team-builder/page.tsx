import type { Metadata } from "next";

import { TeamBuilderScreen } from "@/components/p-champ";

export const metadata: Metadata = {
  title: "Team Builder",
};

export default function TeamBuilderPage() {
  return <TeamBuilderScreen />;
}
