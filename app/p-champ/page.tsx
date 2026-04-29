import type { Metadata } from "next";

import { HomeScreen } from "@/components/home";

export const metadata: Metadata = {
  title: "P-Champ",
};

export default function PChampHomePage() {
  return <HomeScreen />;
}
