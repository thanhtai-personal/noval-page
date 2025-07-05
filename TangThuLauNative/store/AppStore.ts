"use client";

import { Api } from "@/utils/api";
import { makeAutoObservable } from "mobx";

const localStorage = typeof window !== "undefined" ? window.localStorage : null;

interface AnimationProps {
  useIsland?: boolean;
  useDNA?: boolean;
  useUniverseBg?: boolean;
  useFantasyIsland?: boolean;
  use3DIsland?: boolean;
}

export class AppStore {
  profile: any = null;

  constructor() {
    makeAutoObservable(this);
    this.fetchProfile();
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
