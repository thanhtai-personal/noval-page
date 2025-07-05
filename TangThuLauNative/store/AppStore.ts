"use client";

import { Api } from "@/utils/api";
import AsyncStorage from "@/utils/asyncStorage";
import i18n from "@/localization/i18n";
import { makeAutoObservable } from "mobx";

const localStorage = typeof window !== "undefined" ? window.localStorage : null;

interface AnimationProps {
  useIsland?: boolean;
  useDNA?: boolean;
  useUniverseBg?: boolean;
  useFantasyIsland?: boolean;
  use3DIsland?: boolean;
}

export interface HistoryItem {
  storySlug: string;
  storyTitle: string;
  cover: string;
  chapter: number;
}

export class AppStore {
  profile: any = null;
  language: 'vi' | 'en' = 'vi';
  history: HistoryItem[] = [];

  constructor() {
    makeAutoObservable(this);
    this.fetchProfile();
    this.loadHistory();
  }

  setLanguage(lang: 'vi' | 'en') {
    this.language = lang;
    i18n.locale = lang;
  }

  toggleLanguage() {
    this.setLanguage(this.language === 'vi' ? 'en' : 'vi');
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
    if (!this.isLoggedIn) return;
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

  async fetchProfile() {
    try {
      const res = await Api.get("/auth/me");

      this.profile = res.data;
    } catch {
      this.clear();
    }
  }

  async logout() {
    try {
      await Api.post("/auth/logout");
    } catch (error) {
      console.log("logout error", error);
    } finally {
      this.clear();
    }
  }

  get isLoggedIn() {
    return !!this.profile;
  }

  clear() {
    this.profile = null;
  }
}

export const appStore = new AppStore();
