import axios from 'axios';

const ApiInstant = axios.create({
  baseURL: 'https://your-api-url.com/api', // Replace with your actual API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { ApiInstant };