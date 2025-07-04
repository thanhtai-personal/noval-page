import { useContext } from 'react';
import i18n from '@/localization/i18n';
import { LanguageContext } from '@/contexts/LanguageContext';

export function useTranslation() {
  const { language } = useContext(LanguageContext);
  return {
    t: (key: string, config?: i18n.TranslateOptions) => i18n.t(key, config),
    language,
  };
}
