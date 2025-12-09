import apiClient from './api';
import { API_ENDPOINTS } from '../constants';
import type { ApiResponse, User, PageResponse } from '../types';

export const userService = {
  /**
   * Get all users with pagination
   */
  getAllUsers: async (
    page: number = 0,
    size: number = 100,
    sortBy: string = 'createdAt',
    sortDir: string = 'DESC'
  ): Promise<PageResponse<User>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<User>>>(
      API_ENDPOINTS.USERS.BASE,
      {
        params: { page, size, sortBy, sortDir },
      }
    );
    return response.data.data;
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.USERS.BY_ID(id)
    );
    return response.data.data;
  },
};



