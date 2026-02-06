"use server";

import { cookies } from "next/headers";
import { type Locale, locales, defaultLocale, LOCALE_COOKIE } from "./config";

/**
 * Get locale from cookie (server-side)
 */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  if (value && locales.includes(value as Locale)) {
    return value as Locale;
  }
  return defaultLocale;
}

/**
 * Set locale cookie (server action)
 */
export async function setLocale(locale: Locale): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
}
