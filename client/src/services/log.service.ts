import apiClient from "./api";
import { API_ENDPOINTS } from "../constants";
import type { ApiResponse, RealtimeLog } from "../types";

export const logService = {
  getByDevice: async (deviceId: string): Promise<RealtimeLog[]> => {
    const response = await apiClient.get<ApiResponse<RealtimeLog[]>>(
      API_ENDPOINTS.LOGS.BY_DEVICE(deviceId)
    );
    return response.data.data;
  },
};




