// client/src/features/employees/api/employee-api.ts

import { apiClient } from '../../../lib/api-client';

import type {
  EmployeeDetails,
  EmployeeFilterOptions,
  EmployeeListQuery,
  EmployeeListResponse,
} from '../types/employee';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const employeeApi = {
  async getById(employeeId: number): Promise<EmployeeDetails> {
    const response = await apiClient.get<ApiResponse<EmployeeDetails>>(
      `/employees/${employeeId}`,
    );

    return response.data.data;
  },

  async getAll(query: EmployeeListQuery): Promise<EmployeeListResponse> {
    const response = await apiClient.get<ApiResponse<EmployeeListResponse>>(
      '/employees',
      {
        params: query,
      },
    );

    return response.data.data;
  },

  async getFilterOptions(): Promise<EmployeeFilterOptions> {
    const response = await apiClient.get<ApiResponse<EmployeeFilterOptions>>(
      '/employees/filter-options',
    );

    return response.data.data;
  },
};
