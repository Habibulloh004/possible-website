import { ru } from "./ru";
import { uz } from "./uz";
import type { Locale } from "@/lib/i18n";

const dictionaries = {
  ru,
  uz,
} as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.ru;
}

