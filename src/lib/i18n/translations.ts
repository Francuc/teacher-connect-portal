import { en } from './en';
import { fr } from './fr';
import { lb } from './lb';

export type Language = 'en' | 'fr' | 'lb';

// Define the Translation type based on the English translations
// since it has all the required keys
export type Translation = typeof en;

export type TranslationKey = keyof Translation;

export const translations: Record<Language, Translation> = {
  en,
  fr: { ...en, ...fr }, // Merge with English to ensure all keys exist
  lb: { ...en, ...lb }, // Merge with English to ensure all keys exist
};