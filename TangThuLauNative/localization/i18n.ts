import i18n from 'i18n-js';
import en from './en.json';
import vi from './vi.json';

// Set up translations
i18n.fallbacks = true;
i18n.translations = { en, vi } as any;

// Default language
i18n.locale = 'vi';

export default i18n;
