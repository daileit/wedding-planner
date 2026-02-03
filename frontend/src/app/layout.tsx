import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
