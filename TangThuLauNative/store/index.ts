"use client";
import { AuthStore } from "./AuthStore";
import { HistoryStore } from "./HistoryStore";
import { LocaleStore } from "./LocaleStore";

export class AppStore {
  auth: AuthStore;
  history: HistoryStore;
  locale: LocaleStore;

  constructor() {
    this.auth = new AuthStore();
    this.history = new HistoryStore();
    this.locale = new LocaleStore();
  }
}

export const appStore = new AppStore();
export type RootStore = AppStore;
