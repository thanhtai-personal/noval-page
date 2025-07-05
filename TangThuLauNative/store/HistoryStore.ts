import { Api } from "@/utils/api";
import AsyncStorage from "@/utils/asyncStorage";
import { makeAutoObservable } from "mobx";

export interface HistoryItem {
  storySlug: string;
  storyTitle: string;
  cover: string;
  chapter: number;
}

export class HistoryStore {
  history: HistoryItem[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadHistory();
  }

  private async saveHistory(data: HistoryItem[]) {
    this.history = data;
    await AsyncStorage.setItem('reading-history', JSON.stringify(data));
  }

  setHistory(data: HistoryItem[]) {
    this.history = data;
  }

  async loadHistory() {
    const val = await AsyncStorage.getItem('reading-history');
    if (val) this.history = JSON.parse(val);
  }

  async addHistory(item: HistoryItem) {
    const existing = this.history.filter((h) => h.storySlug !== item.storySlug);
    await this.saveHistory([{ ...item, chapter: item.chapter }, ...existing]);
  }

  async syncHistoryWithServer() {
    try {
      await Api.post('/reading-history/sync', { items: this.history });
      const res = await Api.get('/reading-history');
      const data = res.data;
      if (Array.isArray(data)) {
        await this.saveHistory(
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
  }
}
