import { en } from './en';
import { fr } from './fr';
import { lb } from './lb';

export type Language = 'en' | 'fr' | 'lb';

// Define the translation keys based on the English translations
export type TranslationKey = keyof typeof en;

export const translations = {
  en,
  fr,
  lb,
} as const;