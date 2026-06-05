import type { Metadata } from "next";
import { cookies } from "next/headers";
import Script from "next/script";

import {
  AppChrome,
  AppHeaderProvider,
  AppStorageFooterProvider,
  ColorSchemeProvider,
} from "@/components/commons";
import { GameSelectionProvider } from "@/components/p-champ";
import { getAppThemeFromEnv } from "@/lib/theme";
import { colorSchemeBootstrapScript } from "@/lib/theme/colorSchemeInitScript";
import { resolveColorSchemeFromRequestCookies } from "@/lib/theme/colorSchemeCookie";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

import "./globals.css";
import "@/components/commons/styles/colorScheme.css";
import "@/components/commons/styles/themes/release.css";
import "@/components/commons/styles/themes/debug.css";
import "@/styles/index.css";
import "@/components/commons/styles/appLayout.css";
import "@/components/photography/styles/photography.css";
import "@/components/wow/styles/wow.css";
import "@/components/burke/styles/burke.css";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const appTheme = getAppThemeFromEnv();
  const cookieStore = await cookies();
  const initialColorScheme = resolveColorSchemeFromRequestCookies((name) =>
    cookieStore.get(name),
  );

  return (
    <html
      lang="en"
      data-app-theme={appTheme}
      data-color-scheme={initialColorScheme}
      className="antialiased"
      suppressHydrationWarning
    >
      <head>
        <Script
          id="color-scheme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: colorSchemeBootstrapScript() }}
        />
      </head>
      <body>
        <ColorSchemeProvider initialScheme={initialColorScheme}>
          <GameSelectionProvider>
            <AppHeaderProvider>
              <AppStorageFooterProvider>
                <AppChrome>{children}</AppChrome>
              </AppStorageFooterProvider>
            </AppHeaderProvider>
          </GameSelectionProvider>
        </ColorSchemeProvider>
      </body>
    </html>
  );
}
