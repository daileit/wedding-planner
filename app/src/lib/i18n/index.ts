import { type Locale, defaultLocale } from "./config";
import en from "./locales/en";
import vi from "./locales/vi";
import type { TranslationSchema } from "./locales/en";

// All translations map
const translations: Record<Locale, TranslationSchema> = {
  en,
  vi,
};

/**
 * Get translation object for a locale
 */
export function getTranslations(locale: Locale = defaultLocale): TranslationSchema {
  return translations[locale] ?? translations[defaultLocale];
}

/**
 * Simple string interpolation: replaces {key} with values
 * Example: t("Welcome, {name}!", { name: "John" }) => "Welcome, John!"
 */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    template
  );
}

// Re-export everything
export { type Locale, locales, defaultLocale, localeNames, localeFlags, LOCALE_COOKIE } from "./config";
export type { TranslationSchema } from "./locales/en";
