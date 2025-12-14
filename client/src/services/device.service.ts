import apiClient from "./api";
import { API_ENDPOINTS } from "../constants";
import type {
  ApiResponse,
  Device,
  PageResponse,
  DeviceRequest,
} from "../types";

export const deviceService = {
  /**
   * Get all devices with pagination
   */
  getAllDevices: async (
    page: number = 0,
    size: number = 10,
    sortBy: string = "createdAt",
    sortDir: string = "DESC"
  ): Promise<PageResponse<Device>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Device>>>(
      API_ENDPOINTS.DEVICES.BASE,
      {
        params: { page, size, sortBy, sortDir },
      }
    );
    return response.data.data;
  },

  /**
   * Get device by ID
   */
  getDeviceById: async (id: string): Promise<Device> => {
    const response = await apiClient.get<ApiResponse<Device>>(
      API_ENDPOINTS.DEVICES.BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * Create new device
   */
  createDevice: async (data: DeviceRequest): Promise<Device> => {
    const response = await apiClient.post<ApiResponse<Device>>(
      API_ENDPOINTS.DEVICES.BASE,
      data
    );
    return response.data.data;
  },

  /**
   * Update device
   */
  updateDevice: async (id: string, data: DeviceRequest): Promise<Device> => {
    const response = await apiClient.put<ApiResponse<Device>>(
      API_ENDPOINTS.DEVICES.BY_ID(id),
      data
    );
    return response.data.data;
  },

  /**
   * Delete device
   */
  deleteDevice: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.DEVICES.BY_ID(id));
  },
};
