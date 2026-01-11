import type { Metadata } from "next";
import "./globals.css";
import { env } from "@/lib/env";
import { getServerSession } from "@/lib/auth/session";
import { AppProviders } from "@/components/providers/app-providers";
import { Toaster } from "@/components/ui/toaster";
import { getRequestLocale } from "@/lib/i18n/server";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const locale = await getRequestLocale();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased font-display">
        <AppProviders initialSession={session} initialLocale={locale}>
          {children}
        </AppProviders>
        <Toaster />
      </body>
    </html>
  );
}
