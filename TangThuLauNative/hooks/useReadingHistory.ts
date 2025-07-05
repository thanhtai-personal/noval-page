import { useAppStore } from '@/store/StoreProvider';
import { HistoryItem } from '@/store/HistoryStore';

export function useReadingHistory() {
  const appStore = useAppStore();
  return {
    history: appStore.history.history,
    addHistory: appStore.history.addHistory.bind(appStore.history),
    syncWithServer: appStore.history.syncHistoryWithServer.bind(appStore.history),
    setHistory: appStore.history.setHistory.bind(appStore.history),
    loggedIn: appStore.auth.isLoggedIn,
  };
}
