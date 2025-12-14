import apiClient from './api';
import { API_ENDPOINTS } from '../constants';
import type { ApiResponse, DeviceModel, PageResponse } from '../types';

export interface DeviceModelRequest {
  name: string;
  deviceType: string;
  isActive?: boolean;
}

export const deviceModelService = {
  /**
   * Get models by brand ID
   */
  getModelsByBrandId: async (
    brandId: string,
    paginated: boolean = false,
    page: number = 0,
    size: number = 100
  ): Promise<DeviceModel[] | PageResponse<DeviceModel>> => {
    const response = await apiClient.get<ApiResponse<DeviceModel[] | PageResponse<DeviceModel>>>(
      API_ENDPOINTS.DEVICE_MODELS.BY_BRAND(brandId),
      {
        params: { paginated, page, size },
      }
    );
    return response.data.data;
  },

  /**
   * Get models by device type
   */
  getModelsByDeviceType: async (deviceType: string): Promise<DeviceModel[]> => {
    const response = await apiClient.get<ApiResponse<DeviceModel[]>>(
      API_ENDPOINTS.DEVICE_MODELS.BY_DEVICE_TYPE(deviceType)
    );
    return response.data.data;
  },

  /**
   * Get model by ID
   */
  getModelById: async (id: string): Promise<DeviceModel> => {
    const response = await apiClient.get<ApiResponse<DeviceModel>>(
      API_ENDPOINTS.DEVICE_MODELS.BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * Create new device model
   */
  createModel: async (brandId: string, data: DeviceModelRequest): Promise<DeviceModel> => {
    const response = await apiClient.post<ApiResponse<DeviceModel>>(
      API_ENDPOINTS.DEVICE_MODELS.CREATE(brandId),
      data
    );
    return response.data.data;
  },

  /**
   * Update device model
   */
  updateModel: async (id: string, data: DeviceModelRequest): Promise<DeviceModel> => {
    const response = await apiClient.put<ApiResponse<DeviceModel>>(
      API_ENDPOINTS.DEVICE_MODELS.BY_ID(id),
      data
    );
    return response.data.data;
  },

  /**
   * Delete device model
   */
  deleteModel: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.DEVICE_MODELS.BY_ID(id));
  },
};



