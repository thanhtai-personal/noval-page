import { makeAutoObservable, runInAction } from 'mobx';
import { api, clearAccessToken, setAccessToken } from "@/services/api";

class AuthStore {
  isAuthenticated = false;
  loading = false;
  accessToken: string | null = null;
  user: any = null;
  loadingAuth = false;

  constructor() {
    makeAutoObservable(this);
    this.loadToken();
  }

  loadToken() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.accessToken = token;
      this.isAuthenticated = true;
      this.fetchUser(); // Tự động gọi me nếu có token
    }
  }

  async login(email: string, password: string) {
    this.loading = true;
    try {
      const res = await api.post(`/auth/login`, {
        email,
        password,
      });

      runInAction(() => {
        this.accessToken = res.data.access_token;
        this.user = res.data.user;
        this.isAuthenticated = true;
      });
      localStorage.setItem('accessToken', res.data.access_token || '');
      localStorage.setItem('refreshToken', res.data.refresh_token);
      setAccessToken(res.data.access_token);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchUser() {
    try {
      this.loadingAuth = true;
      const res = await api.get(`/auth/me`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      const token = this.accessToken || '';
      runInAction(() => {
        this.user = res.data;
        setAccessToken(token);
      });
    } catch (error) {
      this.logout(); // Nếu token sai
    } finally {
      this.loadingAuth = false;
    }
  }

  logout() {
    this.accessToken = null;
    this.user = null;
    this.isAuthenticated = false;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    clearAccessToken();
  }
}

export const authStore = new AuthStore();
