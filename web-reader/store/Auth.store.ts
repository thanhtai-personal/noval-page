"use client";
import { makeAutoObservable } from "mobx";
import { ApiInstant } from "@/utils/api";

export class AuthStore {
  profile: any = null;

  constructor() {
    makeAutoObservable(this);
    this.fetchProfile();
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
