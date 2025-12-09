import apiClient from "./api";
import { API_ENDPOINTS } from "../constants";
import type { ApiResponse, Warranty, PageResponse } from "../types";

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
};
