import apiClient from './api';
import { API_ENDPOINTS } from '../constants';
import type { ApiResponse, PageResponse } from '../types';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export const customerService = {
  /**
   * Get all customers with pagination
   */
  getAllCustomers: async (
    page: number = 0,
    size: number = 100,
    sortBy: string = 'name',
    sortDir: string = 'ASC',
    search?: string
  ): Promise<PageResponse<Customer>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Customer>>>(
      API_ENDPOINTS.CUSTOMERS.BASE,
      {
        params: { page, size, sortBy, sortDir, search: search || '' },
      }
    );
    return response.data.data;
  },

  /**
   * Get customer by ID
   */
  getCustomerById: async (id: string): Promise<Customer> => {
    const response = await apiClient.get<ApiResponse<Customer>>(
      API_ENDPOINTS.CUSTOMERS.BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * Create a new customer
   */
  createCustomer: async (data: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    note?: string;
  }): Promise<Customer> => {
    const response = await apiClient.post<ApiResponse<Customer>>(
      API_ENDPOINTS.CUSTOMERS.BASE,
      data
    );
    return response.data.data;
  },

  /**
   * Update a customer
   */
  updateCustomer: async (
    id: string,
    data: {
      name: string;
      phone: string;
      email?: string;
      address?: string;
      note?: string;
    }
  ): Promise<Customer> => {
    const response = await apiClient.put<ApiResponse<Customer>>(
      API_ENDPOINTS.CUSTOMERS.BY_ID(id),
      data
    );
    return response.data.data;
  },

  /**
   * Delete a customer
   */
  deleteCustomer: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
  },
};




