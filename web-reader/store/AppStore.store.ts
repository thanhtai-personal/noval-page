import { makeAutoObservable } from "mobx";

import { ApiInstant } from "@/utils/api";

export class AppStore {
  useLayout: boolean = true;
  profile: any = null;

  constructor() {
    makeAutoObservable(this);
    this.fetchProfile();
  }

  setConfig(useLayout?: boolean) {
    this.useLayout = useLayout || false;
  }

  async fetchProfile() {
    try {
      const res = await ApiInstant.get("/auth/me");

      this.profile = res.data;
    } catch {
      this.clear();
    }
  }

  async logout() {
    try {
      await ApiInstant.post("/auth/logout");
    } finally {
      this.clear();
    }
  }

  get isLoggedIn() {
    return !!this.profile;
  }

  clear() {
    this.useLayout = true;
    this.profile = null;
  }
}

export const appStore = new AppStore();
