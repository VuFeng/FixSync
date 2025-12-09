import apiClient from "./api";
import { API_ENDPOINTS } from "../constants";
import type { ApiResponse, PageResponse, RepairItem } from "../types";

export const repairItemService = {
  /**
   * Get repair items by device with pagination (server supports paginated flag)
   */
  getRepairItemsByDevice: async (
    deviceId: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = "createdAt",
    sortDir: string = "DESC"
  ): Promise<PageResponse<RepairItem>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<RepairItem>>>(
      API_ENDPOINTS.REPAIR_ITEMS.BY_DEVICE(deviceId),
      {
        params: { paginated: true, page, size, sortBy, sortDir },
      }
    );
    return response.data.data;
  },

  /**
   * Get all repair items with pagination
   */
  getAllRepairItems: async (
    page: number = 0,
    size: number = 10,
    sortBy: string = "createdAt",
    sortDir: string = "DESC"
  ): Promise<PageResponse<RepairItem>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<RepairItem>>>(
      API_ENDPOINTS.REPAIR_ITEMS.BASE,
      {
        params: { page, size, sortBy, sortDir },
      }
    );
    return response.data.data;
  },

  /**
   * Get repair item detail
   */
  getRepairItemById: async (id: string): Promise<RepairItem> => {
    const response = await apiClient.get<ApiResponse<RepairItem>>(
      API_ENDPOINTS.REPAIR_ITEMS.BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * Create repair item
   */
  createRepairItem: async (
    data: Omit<RepairItem, "id" | "createdAt">
  ): Promise<RepairItem> => {
    const response = await apiClient.post<ApiResponse<RepairItem>>(
      API_ENDPOINTS.REPAIR_ITEMS.BASE,
      data
    );
    return response.data.data;
  },

  /**
   * Update repair item
   */
  updateRepairItem: async (
    id: string,
    data: Omit<RepairItem, "id" | "createdAt">
  ): Promise<RepairItem> => {
    const response = await apiClient.put<ApiResponse<RepairItem>>(
      API_ENDPOINTS.REPAIR_ITEMS.BY_ID(id),
      data
    );
    return response.data.data;
  },

  /**
   * Delete repair item
   */
  deleteRepairItem: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.REPAIR_ITEMS.BY_ID(id));
  },
};


