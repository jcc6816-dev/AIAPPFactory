import "@/app/globals.css";

import { getMessages, getTranslations } from "next-intl/server";

import { AppContextProvider } from "@/contexts/app";
import GrowthTracker from "@/components/analytics/growth-tracker";
import AuthConversionTracker from "@/components/analytics/auth-conversion-tracker";
import { Inter as FontSans } from "next/font/google";
import { Metadata } from "next";
import { NextAuthSessionProvider } from "@/auth/session";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/providers/theme";
import { cn } from "@/lib/utils";
import GoogleAnalytics from "@/components/analytics/google-analytics";
import MicrosoftClarity from "@/components/analytics/microsoft-clarity";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();
  const baseUrl = "https://genforms.ai";
  const canonicalPath = locale === "en" ? "/" : `/${locale}`;
  const canonicalUrl = `${baseUrl}${canonicalPath === "/" ? "" : canonicalPath}`;

  return {
    title: {
      template: "%s | GenForms.ai",
      default: t("metadata.title") || "",
    },
    description: t("metadata.description") || "",
    keywords: t("metadata.keywords") || "",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: "/",
        zh: "/zh",
        "x-default": "/",
      },
    },
    openGraph: {
      title: t("metadata.title") || "",
      description: t("metadata.description") || "",
      url: canonicalUrl,
      siteName: "GenForms.ai",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "GenForms.ai - AI Form Generation & Immersive Data Collection",
        },
      ],
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata.title") || "",
      description: t("metadata.description") || "",
      images: ["/og-image.png"],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased overflow-x-hidden",
          fontSans.variable
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <NextAuthSessionProvider>
            <AppContextProvider>
              <ThemeProvider attribute="class" disableTransitionOnChange>
                <GoogleAnalytics />
                <MicrosoftClarity />
                <GrowthTracker />
                <AuthConversionTracker />
                {children}
              </ThemeProvider>
            </AppContextProvider>
          </NextAuthSessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
