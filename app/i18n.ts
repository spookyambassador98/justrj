/**
 * Shared i18n helpers for APEX (EN / RU / UK).
 */

export type Lang = "en" | "ru" | "uk";

export const LANGS: Lang[] = ["en", "ru", "uk"];

export type Localized = { en: string; ru: string; uk: string };
export type LocalizedList = { en: string[]; ru: string[]; uk: string[] };

/** Pick a localized string for the active language. */
export function tx(obj: Localized | Record<Lang, string>, lang: Lang): string {
  return obj[lang] || obj.uk || obj.ru || obj.en;
}

/** Pick a localized string list. */
export function txList(obj: LocalizedList, lang: Lang): string[] {
  return obj[lang] || obj.uk || obj.ru || obj.en;
}

export function langLabel(code: Lang): string {
  return code.toUpperCase();
}
