import apiClient from "./api";
import { API_ENDPOINTS } from "../constants";
import type { ApiResponse, PageResponse, Transaction } from "../types";

export const transactionService = {
  getAllTransactions: async (
    page: number = 0,
    size: number = 20,
    sortBy: string = "createdAt",
    sortDir: string = "DESC"
  ): Promise<PageResponse<Transaction>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Transaction>>>(
      API_ENDPOINTS.TRANSACTIONS.BASE,
      {
        params: { page, size, sortBy, sortDir },
      }
    );
    return response.data.data;
  },
};




