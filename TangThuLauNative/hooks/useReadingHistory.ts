import { useAppStore } from '@/store/StoreProvider';
import { HistoryItem } from '@/store/AppStore';

export function useReadingHistory() {
  const appStore = useAppStore();
  return {
    history: appStore.history,
    addHistory: appStore.addHistory.bind(appStore),
    syncWithServer: appStore.syncHistoryWithServer.bind(appStore),
    setHistory: appStore.setHistory.bind(appStore),
    loggedIn: appStore.isLoggedIn,
  };
}
