// Supported locales - add new languages here
export const locales = ["en", "vi"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  vi: "Tiếng Việt",
};

// Flag emojis for UI
export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  vi: "🇻🇳",
};

export const LOCALE_COOKIE = "locale";
