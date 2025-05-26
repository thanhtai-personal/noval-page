import axios from 'axios';

export const ApiInstant = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // Enable cookie support
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

ApiInstant.interceptors.response.use(
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
        }).then(() => ApiInstant(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await ApiInstant.post('/auth/refresh');
        processQueue(null, true);
        return ApiInstant(originalRequest);
      } catch (err) {
        processQueue(err, false);
        // Remove or comment this line:
        // await ApiInstant.post('/auth/logout');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

