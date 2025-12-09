import apiClient from './api';
import { API_ENDPOINTS } from '../constants';
import type { ApiResponse, DeviceModel, PageResponse } from '../types';

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
};



