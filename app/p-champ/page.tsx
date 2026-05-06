import type { Metadata } from "next";

import { PChampHomeScreen } from "@/components/p-champ";

export const metadata: Metadata = {
  title: "P-Champ",
};

export default function PChampHomePage() {
  return <PChampHomeScreen />;
}
