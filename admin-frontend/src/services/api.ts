// src/services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// 👉 Hàm gọi sau khi login để gắn token vào header
export function setAccessToken(token: string) {
  localStorage.setItem('accessToken', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// 👉 Hàm xóa token khi logout
export function clearAccessToken() {
  localStorage.removeItem('accessToken');
  delete api.defaults.headers.common['Authorization'];
}

// 👉 Gắn token có sẵn nếu người dùng đã login
const token = localStorage.getItem('accessToken');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
