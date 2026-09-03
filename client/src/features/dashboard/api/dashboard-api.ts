// client/src/features/dashboard/api/dashboard-api.ts
// client/src/features/dashboard/api/dashboard-api.ts


// client/src/features/dashboard/api/dashboard-api.ts

import axios from 'axios';

import type {
  AnalyticsOverview,
  AnalyticsResponse,
  CountryAnalytics,
  DashboardFilters,
  DepartmentAnalytics,
  SalaryDistribution,
} from '../types/dashboard';

import { apiClient } from '../../../lib/api-client';

export class DashboardApiError extends Error {
  readonly status: number;

  readonly details: unknown;

  constructor(
    message: string,
    status: number,
    details?: unknown,
  ) {
    super(message);

    this.name = 'DashboardApiError';

    this.status = status;

    this.details = details;

    Object.setPrototypeOf(
      this,
      DashboardApiError.prototype,
    );
  }
}

function buildQueryString(
  filters: DashboardFilters = {},
): string {
  const params = new URLSearchParams();

  if (filters.countryCode) {
    params.set(
      'countryCode',
      filters.countryCode,
    );
  }

  if (filters.department) {
    params.set(
      'department',
      filters.department,
    );
  }

  if (filters.role) {
    params.set(
      'role',
      filters.role,
    );
  }

  if (filters.currency) {
    params.set(
      'currency',
      filters.currency,
    );
  }

  const query = params.toString();

  return query ? `?${query}` : '';
}

function extractApiErrorMessage(
  responseData: unknown,
): string | null {
  if (
    typeof responseData !== 'object' ||
    responseData === null
  ) {
    return null;
  }

  if (
    'error' in responseData &&
    typeof responseData.error === 'object' &&
    responseData.error !== null &&
    'message' in responseData.error &&
    typeof responseData.error.message === 'string'
  ) {
    return responseData.error.message;
  }

  if (
    'message' in responseData &&
    typeof responseData.message === 'string'
  ) {
    return responseData.message;
  }

  return null;
}

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = extractApiErrorMessage(
      error.response?.data,
    );

    if (apiMessage) {
      return apiMessage;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }

  return fallback;
}

async function request<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> {
  try {
    const response = await apiClient.get<T>(
      path,
      {
        signal,
      },
    );

    return response.data;
  } catch (error: unknown) {
    if (signal?.aborted) {
      throw new DOMException(
        'The request was aborted.',
        'AbortError',
      );
    }

    if (axios.isAxiosError(error)) {
      throw new DashboardApiError(
        getErrorMessage(
          error,
          'Unable to connect to the analytics service.',
        ),
        error.response?.status ?? 0,
        error.response?.data,
      );
    }

    throw new DashboardApiError(
      getErrorMessage(
        error,
        'Unable to connect to the analytics service.',
      ),
      0,
      error,
    );
  }
}

export const dashboardApi = {
  async getOverview(
    filters: DashboardFilters = {},
    signal?: AbortSignal,
  ): Promise<AnalyticsOverview> {
    const response =
      await request<
        AnalyticsResponse<AnalyticsOverview>
      >(
        `/analytics/overview${buildQueryString(filters)}`,
        signal,
      );

    return response.data;
  },

  async getDistribution(
    filters: DashboardFilters = {},
    signal?: AbortSignal,
  ): Promise<SalaryDistribution> {
    const response =
      await request<
        AnalyticsResponse<SalaryDistribution>
      >(
        `/analytics/distribution${buildQueryString(filters)}`,
        signal,
      );

    return response.data;
  },

  async getCountries(
    filters: DashboardFilters = {},
    signal?: AbortSignal,
  ): Promise<CountryAnalytics> {
    const response =
      await request<
        AnalyticsResponse<CountryAnalytics>
      >(
        `/analytics/countries${buildQueryString(filters)}`,
        signal,
      );

    return response.data;
  },

  async getDepartments(
    filters: DashboardFilters = {},
    signal?: AbortSignal,
  ): Promise<DepartmentAnalytics> {
    const response =
      await request<
        AnalyticsResponse<DepartmentAnalytics>
      >(
        `/analytics/departments${buildQueryString(filters)}`,
        signal,
      );

    return response.data;
  },
};
