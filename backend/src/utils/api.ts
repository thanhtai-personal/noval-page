import axios from 'axios';

export const axiosInstance = axios.create({
  timeout: 10000, // 10s timeout
  headers: {
    'User-Agent': 'Mozilla/5.0',
    Accept: 'text/html',
  },
});
