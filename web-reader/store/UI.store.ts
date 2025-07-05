"use client";
import { makeAutoObservable } from "mobx";

const localStorage = typeof window !== "undefined" ? window.localStorage : null;

export interface AnimationProps {
  useIsland?: boolean;
  useDNA?: boolean;
  useUniverseBg?: boolean;
  useFantasyIsland?: boolean;
  use3DIsland?: boolean;
}

export class UIStore {
  useLayout = true;
  animationMode = false;
  useFooter = true;
  useGameMenu = true;
  openGameMode = true;
  showPlayerControl = false;
  animations: AnimationProps = {} as AnimationProps;

  constructor() {
    makeAutoObservable(this);
    const animMode = localStorage?.getItem("animationMode");
    if (animMode !== null && animMode !== undefined) {
      this.animationMode = localStorage?.getItem("animationMode") === "true";
    }
    this.resetAnimations();
  }

  setConfig(config: { useLayout?: boolean; useFooter?: boolean }) {
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
}
