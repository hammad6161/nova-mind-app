import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.novamind.app';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
      console.error('Unauthorized');
    }
    return Promise.reject(error);
  }
);
