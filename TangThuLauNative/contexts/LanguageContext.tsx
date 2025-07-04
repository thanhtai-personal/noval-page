import React, { createContext, useState, useEffect } from 'react';
import i18n from '@/localization/i18n';

export type Language = 'vi' | 'en';

interface ContextValue {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<ContextValue>({
  language: 'vi',
  toggleLanguage: () => {},
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('vi');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };

  useEffect(() => {
    i18n.locale = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
