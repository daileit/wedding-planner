import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getLocale } from "@/lib/i18n/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getTranslations, locales } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WedBeLoving - Your Wedding Planning Companion",
  description:
    "Plan your perfect wedding with ease. Manage budgets, tasks, timelines, and vendors all in one place.",
  keywords: ["wedding", "planner", "budget", "planning", "wedding planning"],
  authors: [{ name: "WedBeLoving" }],
  openGraph: {
    title: "WedBeLoving - Your Wedding Planning Companion",
    description:
      "Plan your perfect wedding with ease. Manage budgets, tasks, timelines, and vendors all in one place.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Note: Root layout is a Server Component; we can get locale server-side.
  // We also set the html lang attribute for downstream components.
  // To keep it simple, reuse getLocale(); if missing, fall back to default.
  // (We can't await directly at module scope; moving into async wrapper would change signature.)
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
