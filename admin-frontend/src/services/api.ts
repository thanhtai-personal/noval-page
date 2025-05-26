import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL!,
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

api.interceptors.response.use(
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
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh');
        processQueue(null, true);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, false);
        // Remove or comment this line:
        // await api.post('/auth/logout');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
