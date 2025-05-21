import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// 👉 Hàm login gắn token vào localStorage
export function setAccessToken(token: string) {
  localStorage.setItem('accessToken', token);
}

// 👉 Hàm logout
export function clearAccessToken() {
  localStorage.removeItem('accessToken');
}

// 👉 Interceptor tự động gắn token trước mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
