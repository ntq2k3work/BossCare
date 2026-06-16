import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { I18nProvider } from "@/components/i18n-provider";
import { BRAND_NAME, BRAND_SLOGAN } from "@/components/ui/pet-ui";
import { getRequestLocale } from "@/lib/request-locale";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND_NAME} - ${BRAND_SLOGAN}`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: "BossCare keeps pet health records, reminders, payments, and care guidance in one trusted household dashboard.",
  applicationName: BRAND_NAME,
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <I18nProvider initialLocale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
