import { makeAutoObservable, runInAction } from "mobx";
import { api } from "@/services/api";

class AuthStore {
  isAuthenticated = false;
  loading = false;
  user: any = null;
  loadingAuth = false;
  loginError = "";

  constructor() {
    makeAutoObservable(this);
    this.fetchUser();
  }

  async login(email: string, password: string) {
    this.loading = true;
    try {
      runInAction(() => {
        this.loginError = "";
      });
      await api.post(`/auth/login`, { email, password });
      await this.fetchUser();
      runInAction(() => {
        this.isAuthenticated = true;
      });
    } catch (error: any) {
      runInAction(() => {
        this.loginError =
          error?.response?.data?.message || "Đăng nhập thất bại!";
        this.isAuthenticated = false;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchUser() {
    try {
      this.loadingAuth = true;
      const res = await api.get(`/auth/me`);
      runInAction(() => {
        this.user = res.data;
        this.isAuthenticated = true;
      });
    } catch (error) {
      this.logout(); // Clear state if failed
    } finally {
      this.loadingAuth = false;
    }
  }

  async logout() {
    await api.post(`/auth/logout`);
    runInAction(() => {
      this.user = null;
      this.isAuthenticated = false;
    });
  }
}

export const authStore = new AuthStore();
