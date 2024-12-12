import { en } from './en';
import { fr } from './fr';
import { lb } from './lb';

export type Language = "en" | "fr" | "lb";

export const translations = {
  en,
  fr,
  lb,
} as const;

export type TranslationKey = keyof typeof translations.en;