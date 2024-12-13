export type Translation = {
  emailAlreadyExists: string;
};

export type TranslationKey = keyof Translation;

export const translations = {
  en,
  fr,
  lb,
};
