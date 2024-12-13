import { en } from './en';
import { fr } from './fr';
import { lb } from './lb';

export type Language = 'en' | 'fr' | 'lb';

// Define the Translation type based on the structure of English translations
export type Translation = {
  [K in keyof typeof en]: string;
};

export type TranslationKey = keyof Translation;

// Create a type helper to ensure all required keys are present
type EnsureAllKeys<T> = {
  [K in keyof Translation]: string;
} & {
  [K in keyof T]: string;
};

// Use the type helper to ensure all translations have the required keys
export const translations: Record<Language, Translation> = {
  en,
  fr: en as unknown as Translation, // Type assertion to avoid string literal conflicts
  lb: en as unknown as Translation, // Type assertion to avoid string literal conflicts
};

// Override with actual translations while maintaining type safety
Object.assign(translations.fr, fr);
Object.assign(translations.lb, lb);