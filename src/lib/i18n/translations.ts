import { en } from './en';
import { fr } from './fr';
import { lb } from './lb';

export type Language = 'en' | 'fr' | 'lb';

// Define the Translation type based on the English translations structure
export type Translation = {
  [K in keyof typeof en]: string;
};

export type TranslationKey = keyof Translation;

// Create translations object with English as the base, using type assertion
export const translations: Record<Language, Translation> = {
  en,
  fr: { ...en, ...fr } as Translation,
  lb: { ...en, ...lb } as Translation,
};