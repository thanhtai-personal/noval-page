import { Api } from "@/utils/api";
import { makeAutoObservable } from "mobx";

export class AuthStore {
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
