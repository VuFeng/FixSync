import apiClient from "./api";
import type { ApiResponse, PageResponse } from "../types";

export interface ServiceCatalog {
  id: string;
  name: string;
  defaultPartUsed?: string;
  baseCost: number;
  defaultWarrantyMonths?: number;
  description?: string;
  isActive: boolean;
}

export const serviceCatalogService = {
  getActive: async (): Promise<ServiceCatalog[]> => {
    const res = await apiClient.get<ApiResponse<ServiceCatalog[]>>(
      "/service-catalog/active"
    );
    return res.data.data;
  },
  getAll: async (
    page = 0,
    size = 50,
    sortBy = "name",
    sortDir = "ASC"
  ): Promise<PageResponse<ServiceCatalog>> => {
    const res = await apiClient.get<ApiResponse<PageResponse<ServiceCatalog>>>(
      "/service-catalog",
      { params: { page, size, sortBy, sortDir } }
    );
    return res.data.data;
  },
};


