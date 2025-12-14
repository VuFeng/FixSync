import apiClient from "./api";
import { API_ENDPOINTS } from "../constants";
import type { ApiResponse, PageResponse, Transaction, TransactionRequest } from "../types";

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

  createTransaction: async (payload: TransactionRequest): Promise<Transaction> => {
    const response = await apiClient.post<ApiResponse<Transaction>>(
      API_ENDPOINTS.TRANSACTIONS.BASE,
      payload
    );
    return response.data.data;
  },

  getTransactionById: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get<ApiResponse<Transaction>>(
      API_ENDPOINTS.TRANSACTIONS.BY_ID(id)
    );
    return response.data.data;
  },

  updateTransaction: async (
    id: string,
    payload: TransactionRequest
  ): Promise<Transaction> => {
    const response = await apiClient.put<ApiResponse<Transaction>>(
      API_ENDPOINTS.TRANSACTIONS.BY_ID(id),
      payload
    );
    return response.data.data;
  },

  deleteTransaction: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.TRANSACTIONS.BY_ID(id));
  },
};




