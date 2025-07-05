import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { NextIntlClientProvider } from "next-intl";
import { headers } from "next/headers";
import { getMessages } from "next-intl/server";
import { Suspense } from "react";

import { Providers } from "./providers";
import GlobalLoading from "./loading";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { AppLayout } from "@/components/layout/AppLayout";
import { GoogleAnalytics } from "@/lib/analytic";

// import { getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const locale = await getLocale();
  const locale = (await headers()).get("x-next-intl-locale") || "vi";
  const messages = (await getMessages({ locale })) || {};

  return (
    <html suppressHydrationWarning lang={locale}>
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Suspense fallback={<GlobalLoading />}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <GoogleAnalytics
              GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID!}
            />
            <Providers
              themeProps={{ attribute: "class", defaultTheme: "dark" }}
            >
              <AppLayout>{children}</AppLayout>
            </Providers>
          </NextIntlClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
