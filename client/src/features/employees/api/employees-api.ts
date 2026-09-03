// client/src/features/employees/api/employees-api.ts

import axios from 'axios';

import { apiClient } from '../../../lib/api-client';

import type {
  EmployeeFilterOptions,
  EmployeeListQuery,
  EmployeeListResponse,
} from '../types/employee';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export class EmployeesApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status = 0, details?: unknown) {
    super(message);

    this.name = 'EmployeesApiError';
    this.status = status;
    this.details = details;

    Object.setPrototypeOf(this, EmployeesApiError.prototype);
  }
}

/**
 * Extract a useful API error message without exposing
 * implementation details to the UI.
 */
function extractApiErrorMessage(value: unknown): string | null {
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

  if ('error' in value && typeof value.error === 'string') {
    return value.error;
  }

  if ('message' in value && typeof value.message === 'string') {
    return value.message;
  }

  return null;
}

/**
 * Converts any API-layer failure into a predictable
 * EmployeesApiError.
 */
function normalizeError(error: unknown): EmployeesApiError {
  if (axios.isAxiosError(error)) {
    const message =
      extractApiErrorMessage(error.response?.data) ??
      error.message ??
      'Unable to complete the employee request.';

    return new EmployeesApiError(message, error.response?.status ?? 0, error.response?.data);
  }

  if (error instanceof EmployeesApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new EmployeesApiError(error.message, 0, error);
  }

  return new EmployeesApiError('Unable to complete the employee request.', 0, error);
}

/**
 * Ensures that the API response actually contains
 * the expected data envelope.
 */
function unwrapResponse<T>(response: ApiResponse<T>): T {
  if (!response || response.success !== true) {
    throw new EmployeesApiError(
      response?.message ?? 'The employee service returned an invalid response.',
    );
  }

  return response.data;
}

/**
 * Get paginated employees.
 */
async function getEmployees(
  query: EmployeeListQuery,
  signal?: AbortSignal,
): Promise<EmployeeListResponse> {
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

    return unwrapResponse(response.data);
  } catch (error: unknown) {
    if (signal?.aborted || axios.isCancel(error)) {
      throw error;
    }

    throw normalizeError(error);
  }
}

/**
 * Get country filter options.
 */
async function getCountries(signal?: AbortSignal): Promise<EmployeeFilterOptions['countries']> {
  try {
    const response = await apiClient.get<ApiResponse<EmployeeFilterOptions['countries']>>(
      '/countries',
      {
        signal,
      },
    );

    return unwrapResponse(response.data);
  } catch (error: unknown) {
    if (signal?.aborted || axios.isCancel(error)) {
      throw error;
    }

    throw normalizeError(error);
  }
}

/**
 * Get department filter options.
 */
async function getDepartments(signal?: AbortSignal): Promise<EmployeeFilterOptions['departments']> {
  try {
    const response = await apiClient.get<ApiResponse<EmployeeFilterOptions['departments']>>(
      '/departments',
      {
        signal,
      },
    );

    return unwrapResponse(response.data);
  } catch (error: unknown) {
    if (signal?.aborted || axios.isCancel(error)) {
      throw error;
    }

    throw normalizeError(error);
  }
}

/**
 * Get role filter options.
 */
async function getRoles(signal?: AbortSignal): Promise<EmployeeFilterOptions['roles']> {
  try {
    const response = await apiClient.get<ApiResponse<EmployeeFilterOptions['roles']>>('/roles', {
      signal,
    });

    return unwrapResponse(response.data);
  } catch (error: unknown) {
    if (signal?.aborted || axios.isCancel(error)) {
      throw error;
    }

    throw normalizeError(error);
  }
}

export const employeesApi = {
  getEmployees,
  getCountries,
  getDepartments,
  getRoles,
};
