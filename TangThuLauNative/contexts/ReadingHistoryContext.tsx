import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@/utils/asyncStorage';
import { Api } from '@/utils/api';
import { useAppStore } from '@/store/StoreProvider';

export interface HistoryItem {
  storySlug: string;
  storyTitle: string;
  cover: string;
  chapter: number;
}

interface ContextValue {
  history: HistoryItem[];
  addHistory: (item: HistoryItem) => Promise<void>;
  syncWithServer: () => Promise<void>;
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  loggedIn: boolean;
}

const STORAGE_KEY = 'reading-history';

const ReadingHistoryContext = createContext<ContextValue>({
  history: [],
  addHistory: async () => {},
  syncWithServer: async () => {},
  setHistory: () => {},
  loggedIn: false,
});

export const ReadingHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const appStore = useAppStore();

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) setHistory(JSON.parse(val));
    });
  }, []);

  const save = async (data: HistoryItem[]) => {
    setHistory(data);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const addHistory = async (item: HistoryItem) => {
    const existing = history.filter((h) => h.storySlug !== item.storySlug);
    await save([{ ...item, chapter: item.chapter }, ...existing]);
  };

  const syncWithServer = async () => {
    if (!appStore.isLoggedIn) return;
    try {
      await Api.post('/reading-history/sync', { items: history });
      const res = await Api.get('/reading-history');
      const data = res.data;
      if (Array.isArray(data)) {
        await save(
          data.map((d: any) => ({
            storySlug: d.story.slug,
            storyTitle: d.story.title,
            cover: d.story.cover,
            chapter: d.chapter,
          }))
        );
      }
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <ReadingHistoryContext.Provider value={{ history, addHistory, syncWithServer, setHistory, loggedIn: appStore.isLoggedIn }}>
      {children}
    </ReadingHistoryContext.Provider>
  );
};

export const useReadingHistory = () => useContext(ReadingHistoryContext);
