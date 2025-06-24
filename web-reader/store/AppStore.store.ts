"use client";

import { makeAutoObservable } from "mobx";

import { ApiInstant } from "@/utils/api";

const localStorage = typeof window !== "undefined" ? window.localStorage : null;

interface AnimationProps {
  useIsland?: boolean;
  useDNA?: boolean;
  useUniverseBg?: boolean;
  useFantasyIsland?: boolean;
  use3DIsland?: boolean;
}

export class AppStore {
  useLayout: boolean = true;
  profile: any = null;
  animationMode: boolean = true;
  useFooter: boolean = true;
  useGameMenu: boolean = true;
  animations: AnimationProps = {};

  constructor() {
    makeAutoObservable(this);
    const animMode = localStorage?.getItem("animationMode");
    if (animMode !== null && animMode !== undefined) {
      this.animationMode = Boolean(
        localStorage?.getItem("animationMode") === "true",
      );
    }
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
      useIsland: false,
      useDNA: false,
      useUniverseBg: true,
      useFantasyIsland: true,
      use3DIsland: false,
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
