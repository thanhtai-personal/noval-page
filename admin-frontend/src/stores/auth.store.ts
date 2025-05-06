import { makeAutoObservable } from 'mobx';
import axios from 'axios';

class AuthStore {
  isAuthenticated = false;
  loading = false;
  accessToken: string | null = null;
  user: any = null;

  constructor() {
    makeAutoObservable(this);
    this.loadToken();
  }

  loadToken() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.accessToken = token;
      this.isAuthenticated = true;
    }
  }

  async login(email: string, password: string) {
    this.loading = true;
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
      this.accessToken = res.data.accessToken;
      this.user = res.data.user || null;
      this.isAuthenticated = true;

      localStorage.setItem('accessToken', this.accessToken || '');
      localStorage.setItem('refreshToken', res.data.refreshToken);
    } finally {
      this.loading = false;
    }
  }

  logout() {
    this.accessToken = null;
    this.user = null;
    this.isAuthenticated = false;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

export const authStore = new AuthStore();
