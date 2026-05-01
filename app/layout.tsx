import type { Metadata } from "next";

import { GameSelectionProvider } from "@/components/game";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

import "./globals.css";
import "@/components/photography/styles/photography.css";
import "@/components/wow/styles/wow.css";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <GameSelectionProvider>{children}</GameSelectionProvider>
      </body>
    </html>
  );
}
