import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/Api';

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
  setLoggedIn: (b: boolean) => void;
}

const STORAGE_KEY = 'reading-history';

const ReadingHistoryContext = createContext<ContextValue>({
  history: [],
  addHistory: async () => {},
  syncWithServer: async () => {},
  setHistory: () => {},
  loggedIn: false,
  setLoggedIn: () => {},
});

export const ReadingHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);

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
    if (!loggedIn) return;
    try {
      await fetch(`${API_BASE_URL}/reading-history/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: history }),
        credentials: 'include',
      });
      const res = await fetch(`${API_BASE_URL}/reading-history`, { credentials: 'include' });
      const data = await res.json();
      if (Array.isArray(data)) {
        await save(data.map((d: any) => ({
          storySlug: d.story.slug,
          storyTitle: d.story.title,
          cover: d.story.cover,
          chapter: d.chapter,
        })));
      }
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <ReadingHistoryContext.Provider value={{ history, addHistory, syncWithServer, setHistory, loggedIn, setLoggedIn }}>
      {children}
    </ReadingHistoryContext.Provider>
  );
};

export const useReadingHistory = () => useContext(ReadingHistoryContext);
