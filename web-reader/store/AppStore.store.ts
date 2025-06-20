"use client";

import { makeAutoObservable } from "mobx";

import { ApiInstant } from "@/utils/api";

const localStorage = typeof window !== "undefined" ? window.localStorage : null;

export class AppStore {
  useLayout: boolean = true;
  profile: any = null;
  animationMode: boolean = false;
  useFooter: boolean = true;

  constructor() {
    makeAutoObservable(this);
    this.animationMode = Boolean(
      localStorage?.getItem("animationMode") === "true",
    );
    this.fetchProfile();
  }

  setConfig(config: {
    useLayout?: boolean;
    useFooter?: boolean;
    animationMode?: boolean;
  }) {
    this.useLayout = config.useLayout || false;
    this.useFooter = config.useFooter || false;
  }

  toggleAnimationMode(value?: boolean) {
    if (typeof value === "boolean") {
      this.animationMode = value;
      localStorage?.setItem("animationMode", String(value));
    } else {
      const newValue = !this.animationMode;
      this.animationMode = newValue;
      localStorage?.setItem("animationMode", String(newValue));
    }
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
