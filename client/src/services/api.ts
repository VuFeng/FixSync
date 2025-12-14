import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { STORAGE_KEYS } from '../constants';
import type { ApiResponse } from '../types';
import { isTokenExpired } from '../utils/jwt';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    // Check if token is expired before making request
    if (token && isTokenExpired(token)) {
      // Clear expired token
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      
      return Promise.reject(new Error('Token đã hết hạn. Vui lòng đăng nhập lại.'));
    }
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<null>>) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 Unauthorized - Clear token and redirect to login
      if (status === 401) {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        // Clear zustand persist storage
        const storage = localStorage.getItem('auth-storage');
        if (storage) {
          localStorage.removeItem('auth-storage');
        }
        
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      // Return error message from API or default message
      const errorMessage = data?.message || error.message || 'Đã xảy ra lỗi';
      return Promise.reject(new Error(errorMessage));
    }

    // Network error
    if (error.request) {
      return Promise.reject(new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.'));
    }

    return Promise.reject(error);
  }
);

export default apiClient;

