import axios from 'axios';
import { API_BASE_URL } from '@/constants/Api';

export const Api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
