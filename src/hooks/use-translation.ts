import { useCallback } from 'react';
import { translations } from '@/lib/i18n/translations';

// For now we'll hardcode the language, you can make it dynamic later
const currentLanguage = 'en';

export const useTranslation = () => {
  const t = useCallback((key: keyof typeof translations.en) => {
    return translations[currentLanguage][key];
  }, []);

  return { t };
};