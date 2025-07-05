"use client";
import { AuthStore } from "./Auth.store";
import { UIStore } from "./UI.store";

export class AppStore {
  auth: AuthStore;
  ui: UIStore;

  constructor() {
    this.auth = new AuthStore();
    this.ui = new UIStore();
  }
}

export const appStore = new AppStore();
export type RootStore = AppStore;
