import { API_BASE_URL } from "@/constants/Api";
import axios from 'axios';

export const Api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, tokenRefreshed: boolean) => {
  failedQueue.forEach(prom => {
    if (tokenRefreshed) {
      prom.resolve();
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

export const setTokenBearer = (token: string) => {
  Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Detect login route explicitly to avoid infinite refresh loops.
    if (originalRequest.url.includes('/auth/login')) {
      // Login failed clearly, just reject immediately.
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => Api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await Api.post('/auth/refresh');
        processQueue(null, true);
        return Api(originalRequest);
      } catch (err) {
        processQueue(err, false);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
