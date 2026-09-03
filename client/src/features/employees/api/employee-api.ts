// client/src/features/employees/api/employee-api.ts

import axios from 'axios';

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

export class EmployeeApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status = 0, details?: unknown) {
    super(message);

    this.name = 'EmployeeApiError';
    this.status = status;
    this.details = details;

    Object.setPrototypeOf(this, EmployeeApiError.prototype);
  }
}

function extractMessage(value: unknown): string | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  if (
    'error' in value &&
    typeof value.error === 'object' &&
    value.error !== null &&
    'message' in value.error &&
    typeof value.error.message === 'string'
  ) {
    return value.error.message;
  }

  if ('message' in value && typeof value.message === 'string') {
    return value.message;
  }

  if ('error' in value && typeof value.error === 'string') {
    return value.error;
  }

  return null;
}

function unwrap<T>(response: ApiResponse<T>): T {
  if (!response || response.success !== true) {
    throw new EmployeeApiError(
      response?.message ?? 'The employee service returned an invalid response.',
    );
  }

  return response.data;
}

function normalizeError(error: unknown): EmployeeApiError {
  if (error instanceof EmployeeApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    return new EmployeeApiError(
      extractMessage(error.response?.data) ??
        error.message ??
        'Unable to complete the employee request.',
      error.response?.status ?? 0,
      error.response?.data,
    );
  }

  if (error instanceof Error) {
    return new EmployeeApiError(error.message, 0, error);
  }

  return new EmployeeApiError('Unable to complete the employee request.', 0, error);
}

export const employeeApi = {
  async getById(employeeId: number, signal?: AbortSignal): Promise<EmployeeDetails> {
    try {
      const response = await apiClient.get<ApiResponse<EmployeeDetails>>(
        `/employees/${employeeId}`,
        { signal },
      );

      return unwrap(response.data);
    } catch (error: unknown) {
      if (signal?.aborted || axios.isCancel(error)) {
        throw error;
      }

      throw normalizeError(error);
    }
  },

  async getAll(query: EmployeeListQuery, signal?: AbortSignal): Promise<EmployeeListResponse> {
    try {
      const response = await apiClient.get<ApiResponse<EmployeeListResponse>>('/employees', {
        params: {
          search: query.search || undefined,
          countryId: query.countryId ?? undefined,
          departmentId: query.departmentId ?? undefined,
          roleId: query.roleId ?? undefined,
          page: query.page,
          pageSize: query.pageSize,
        },
        signal,
      });

      return unwrap(response.data);
    } catch (error: unknown) {
      if (signal?.aborted || axios.isCancel(error)) {
        throw error;
      }

      throw normalizeError(error);
    }
  },

  async getFilterOptions(signal?: AbortSignal): Promise<EmployeeFilterOptions> {
    try {
      const response = await apiClient.get<ApiResponse<EmployeeFilterOptions>>(
        '/employees/filter-options',
        { signal },
      );

      return unwrap(response.data);
    } catch (error: unknown) {
      if (signal?.aborted || axios.isCancel(error)) {
        throw error;
      }

      throw normalizeError(error);
    }
  },
};
