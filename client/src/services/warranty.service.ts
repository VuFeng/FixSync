import apiClient from "./api";
import { API_ENDPOINTS } from "../constants";
import type { ApiResponse, Warranty, PageResponse, WarrantyRequest } from "../types";

export const warrantyService = {
  getByDevice: async (deviceId: string): Promise<Warranty[]> => {
    const response = await apiClient.get<ApiResponse<Warranty[]>>(
      API_ENDPOINTS.WARRANTIES.BY_DEVICE(deviceId)
    );
    return response.data.data;
  },

  getAll: async (
    page: number = 0,
    size: number = 50,
    sortBy: string = "createdAt",
    sortDir: string = "DESC"
  ): Promise<PageResponse<Warranty>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Warranty>>>(
      API_ENDPOINTS.WARRANTIES.BASE,
      {
        params: { page, size, sortBy, sortDir },
      }
    );
    return response.data.data;
  },

  getWarrantyById: async (id: string): Promise<Warranty> => {
    const response = await apiClient.get<ApiResponse<Warranty>>(
      API_ENDPOINTS.WARRANTIES.BY_ID(id)
    );
    return response.data.data;
  },

  createWarranty: async (data: WarrantyRequest): Promise<Warranty> => {
    const response = await apiClient.post<ApiResponse<Warranty>>(
      API_ENDPOINTS.WARRANTIES.BASE,
      data
    );
    return response.data.data;
  },

  updateWarranty: async (id: string, data: WarrantyRequest): Promise<Warranty> => {
    const response = await apiClient.put<ApiResponse<Warranty>>(
      API_ENDPOINTS.WARRANTIES.BY_ID(id),
      data
    );
    return response.data.data;
  },

  deleteWarranty: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.WARRANTIES.BY_ID(id));
  },
};
