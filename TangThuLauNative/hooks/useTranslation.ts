import { useAppStore } from '@/store/StoreProvider';
import i18n from '@/localization/i18n';

export function useTranslation() {
  const appStore = useAppStore();
  return {
    t: (key: string, config?: i18n.TranslateOptions) => i18n.t(key, config),
    language: appStore.language,
  };
}
