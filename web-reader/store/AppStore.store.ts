"use client";

import { makeAutoObservable } from "mobx";

import { ApiInstant } from "@/utils/api";

const localStorage = typeof window !== "undefined" ? window.localStorage : null;

interface AnimationProps {
  useIsland?: boolean;
  useDNA?: boolean;
  useUniverseBg?: boolean;
  useFantasyIsland?: boolean;
}

export class AppStore {
  useLayout: boolean = true;
  profile: any = null;
  animationMode: boolean = false;
  useFooter: boolean = true;
  useGameMenu: boolean = true;
  animations: AnimationProps = {};

  constructor() {
    makeAutoObservable(this);
    this.animationMode = Boolean(
      localStorage?.getItem("animationMode") === "true",
    );
    this.resetAnimations();
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

  setAnimations(config: AnimationProps) {
    this.animations = {
      ...this.animations,
      ...config,
    };
  }

  resetAnimations() {
    this.animations = {
      useIsland: true,
      useDNA: true,
      useUniverseBg: true,
      useFantasyIsland: true,
    };
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
