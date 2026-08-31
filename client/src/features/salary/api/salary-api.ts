// client/src/features/salary/api/salary-api.ts

import { apiClient } from '../../../lib/api-client';

import type {
  CreateSalaryInput,
  SalaryResponse,
  UpdateSalaryInput,
} from '../types/salary';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const salaryApi = {
  async getById(
    salaryId: number,
  ): Promise<SalaryResponse> {
    const response = await apiClient.get<
      ApiResponse<SalaryResponse>
    >(`/api/v1/salaries/${salaryId}`);

    return response.data.data;
  },

  async create(
    input: CreateSalaryInput,
  ): Promise<SalaryResponse> {
    const response = await apiClient.post<
      ApiResponse<SalaryResponse>
    >('/api/v1/salaries', input);

    return response.data.data;
  },

  async update(
    salaryId: number,
    input: UpdateSalaryInput,
  ): Promise<SalaryResponse> {
    const response = await apiClient.patch<
      ApiResponse<SalaryResponse>
    >(
      `/api/v1/salaries/${salaryId}`,
      input,
    );

    return response.data.data;
  },

  async delete(
    salaryId: number,
  ): Promise<{ id: number }> {
    const response = await apiClient.delete<
      ApiResponse<{ id: number }>
    >(
      `/api/v1/salaries/${salaryId}`,
    );

    return response.data.data;
  },
};