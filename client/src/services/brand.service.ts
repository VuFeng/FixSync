import apiClient from './api';
import { API_ENDPOINTS } from '../constants';
import type { ApiResponse, Brand, PageResponse } from '../types';

export interface BrandRequest {
  name: string;
  logoUrl?: string;
  isActive?: boolean;
}

export const brandService = {
  /**
   * Get all brands with pagination
   */
  getAllBrands: async (
    page: number = 0,
    size: number = 100,
    sortBy: string = 'name',
    sortDir: string = 'ASC'
  ): Promise<PageResponse<Brand>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Brand>>>(
      API_ENDPOINTS.BRANDS.BASE,
      {
        params: { page, size, sortBy, sortDir },
      }
    );
    return response.data.data;
  },

  /**
   * Get active brands only
   */
  getActiveBrands: async (): Promise<Brand[]> => {
    const response = await apiClient.get<ApiResponse<Brand[]>>(
      API_ENDPOINTS.BRANDS.ACTIVE
    );
    return response.data.data;
  },

  /**
   * Get brand by ID
   */
  getBrandById: async (id: string): Promise<Brand> => {
    const response = await apiClient.get<ApiResponse<Brand>>(
      API_ENDPOINTS.BRANDS.BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * Create new brand
   */
  createBrand: async (data: BrandRequest): Promise<Brand> => {
    const response = await apiClient.post<ApiResponse<Brand>>(
      API_ENDPOINTS.BRANDS.BASE,
      data
    );
    return response.data.data;
  },

  /**
   * Update brand
   */
  updateBrand: async (id: string, data: BrandRequest): Promise<Brand> => {
    const response = await apiClient.put<ApiResponse<Brand>>(
      API_ENDPOINTS.BRANDS.BY_ID(id),
      data
    );
    return response.data.data;
  },

  /**
   * Delete brand
   */
  deleteBrand: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.BRANDS.BY_ID(id));
  },
};


