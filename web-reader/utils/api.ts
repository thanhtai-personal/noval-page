import axios from 'axios';

export const ApiInstant = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export const setToken = (token: string | null) => {
  if (token) {
    ApiInstant.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete ApiInstant.defaults.headers.common['Authorization'];
  }
};
