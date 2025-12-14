import apiClient from './api';
import { API_ENDPOINTS } from '../constants';
import type { ApiResponse, PageResponse, RepairSession, RepairSessionRequest } from '../types';

export const repairSessionService = {
  /**
   * Get all repair sessions with pagination
   */
  getAllSessions: async (
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDir: string = 'DESC',
    deviceId?: string
  ): Promise<PageResponse<RepairSession>> => {
    const params: Record<string, string | number> = { page, size, sortBy, sortDir };
    if (deviceId) {
      params.deviceId = deviceId;
    }
    const response = await apiClient.get<ApiResponse<PageResponse<RepairSession>>>(
      API_ENDPOINTS.REPAIR_SESSIONS.BASE,
      { params }
    );
    return response.data.data;
  },

  /**
   * Get repair session by ID
   */
  getSessionById: async (id: string): Promise<RepairSession> => {
    const response = await apiClient.get<ApiResponse<RepairSession>>(
      API_ENDPOINTS.REPAIR_SESSIONS.BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * Get repair sessions by device ID
   */
  getSessionsByDevice: async (
    deviceId: string,
    page: number = 0,
    size: number = 10
  ): Promise<PageResponse<RepairSession>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<RepairSession>>>(
      API_ENDPOINTS.REPAIR_SESSIONS.BY_DEVICE(deviceId),
      { params: { page, size } }
    );
    return response.data.data;
  },

  /**
   * Create a new repair session
   */
  createSession: async (data: RepairSessionRequest): Promise<RepairSession> => {
    const response = await apiClient.post<ApiResponse<RepairSession>>(
      API_ENDPOINTS.REPAIR_SESSIONS.BASE,
      data
    );
    return response.data.data;
  },

  /**
   * Update a repair session
   */
  updateSession: async (id: string, data: RepairSessionRequest): Promise<RepairSession> => {
    const response = await apiClient.put<ApiResponse<RepairSession>>(
      API_ENDPOINTS.REPAIR_SESSIONS.BY_ID(id),
      data
    );
    return response.data.data;
  },
};



