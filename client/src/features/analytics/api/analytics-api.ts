// client/src/features/analytics/api/analytics-api.ts

import { apiClient } from '../../../lib/api-client';

import type {
  AnalyticsOverview,
  AnalyticsQueryFilters,
  AnalyticsResponse,
  CountryAnalytics,
  DepartmentAnalytics,
  RoleAnalytics,
  SalaryDistribution,
} from '../types/analytics';

/**
 * Normalized analytics API error.
 */
export class AnalyticsApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status = 0, details: unknown = undefined) {
    super(message);

    this.name = 'AnalyticsApiError';
    this.status = status;
    this.details = details;

    Object.setPrototypeOf(this, AnalyticsApiError.prototype);
  }
}

/* -------------------------------------------------------------------------- */
/* Query building                                                             */
/* -------------------------------------------------------------------------- */

function buildParams(filters: Partial<AnalyticsQueryFilters> = {}): URLSearchParams {
  const params = new URLSearchParams();

  const countryCode = filters.countryCode?.trim();
  const department = filters.department?.trim();
  const role = filters.role?.trim();
  const currency = filters.currency?.trim();

  if (countryCode) {
    params.set('countryCode', countryCode);
  }

  if (department) {
    params.set('department', department);
  }

  if (role) {
    params.set('role', role);
  }

  if (currency) {
    params.set('currency', currency.toUpperCase());
  }

  return params;
}

function buildQuery(filters: Partial<AnalyticsQueryFilters> = {}): string {
  const params = buildParams(filters);
  const query = params.toString();

  return query ? `?${query}` : '';
}

/* -------------------------------------------------------------------------- */
/* Error handling                                                             */
/* -------------------------------------------------------------------------- */

interface ApiErrorShape {
  response?: {
    status?: number;

    data?: {
      message?: unknown;
      error?: unknown;
    };
  };

  message?: string;
  code?: string;
  name?: string;
}

function extractApiError(error: unknown): AnalyticsApiError {
  if (error instanceof AnalyticsApiError) {
    return error;
  }

  const apiError = error as ApiErrorShape;

  const status = apiError.response?.status ?? 0;

  const responseData = apiError.response?.data;

  const serverMessage =
    typeof responseData?.message === 'string'
      ? responseData.message
      : typeof responseData?.error === 'string'
        ? responseData.error
        : undefined;

  const message = serverMessage ?? apiError.message ?? 'Unable to load analytics data.';

  return new AnalyticsApiError(message, status, responseData);
}

/* -------------------------------------------------------------------------- */
/* API                                                                        */
/* -------------------------------------------------------------------------- */

export const analyticsApi = {
  /**
   * GET /api/v1/analytics/overview
   */
  async getOverview(
    filters: Partial<AnalyticsQueryFilters> = {},
    signal?: AbortSignal,
  ): Promise<AnalyticsOverview> {
    try {
      const response = await apiClient.get<AnalyticsResponse<AnalyticsOverview>>(
        `/analytics/overview${buildQuery(filters)}`,
        {
          signal,
        },
      );

      return response.data.data;
    } catch (error) {
      throw extractApiError(error);
    }
  },

  /**
   * GET /api/v1/analytics/distribution
   */
  async getDistribution(
    filters: Partial<AnalyticsQueryFilters> = {},
    signal?: AbortSignal,
  ): Promise<SalaryDistribution> {
    try {
      const response = await apiClient.get<AnalyticsResponse<SalaryDistribution>>(
        `/analytics/distribution${buildQuery(filters)}`,
        {
          signal,
        },
      );

      return response.data.data;
    } catch (error) {
      throw extractApiError(error);
    }
  },

  /**
   * GET /api/v1/analytics/countries
   */
  async getCountries(
    filters: Partial<AnalyticsQueryFilters> = {},
    signal?: AbortSignal,
  ): Promise<CountryAnalytics> {
    try {
      const response = await apiClient.get<AnalyticsResponse<CountryAnalytics>>(
        `/analytics/countries${buildQuery(filters)}`,
        {
          signal,
        },
      );

      return response.data.data;
    } catch (error) {
      throw extractApiError(error);
    }
  },

  /**
   * GET /api/v1/analytics/departments
   */
  async getDepartments(
    filters: Partial<AnalyticsQueryFilters> = {},
    signal?: AbortSignal,
  ): Promise<DepartmentAnalytics> {
    try {
      const response = await apiClient.get<AnalyticsResponse<DepartmentAnalytics>>(
        `/analytics/departments${buildQuery(filters)}`,
        {
          signal,
        },
      );

      return response.data.data;
    } catch (error) {
      throw extractApiError(error);
    }
  },

  /**
   * GET /api/v1/analytics/roles
   */
  async getRoles(
    filters: Partial<AnalyticsQueryFilters> = {},
    signal?: AbortSignal,
  ): Promise<RoleAnalytics> {
    try {
      const response = await apiClient.get<AnalyticsResponse<RoleAnalytics>>(
        `/analytics/roles${buildQuery(filters)}`,
        {
          signal,
        },
      );

      return response.data.data;
    } catch (error) {
      throw extractApiError(error);
    }
  },

  /**
   * Fetch the complete analytics dashboard.
   */
  async getAll(filters: Partial<AnalyticsQueryFilters> = {}, signal?: AbortSignal) {
    try {
      const query = buildQuery(filters);

      const [
        overviewResponse,
        distributionResponse,
        countriesResponse,
        departmentsResponse,
        rolesResponse,
      ] = await Promise.all([
        apiClient.get<AnalyticsResponse<AnalyticsOverview>>(`/analytics/overview${query}`, {
          signal,
        }),

        apiClient.get<AnalyticsResponse<SalaryDistribution>>(`/analytics/distribution${query}`, {
          signal,
        }),

        apiClient.get<AnalyticsResponse<CountryAnalytics>>(`/analytics/countries${query}`, {
          signal,
        }),

        apiClient.get<AnalyticsResponse<DepartmentAnalytics>>(`/analytics/departments${query}`, {
          signal,
        }),

        apiClient.get<AnalyticsResponse<RoleAnalytics>>(`/analytics/roles${query}`, {
          signal,
        }),
      ]);

      return {
        overview: overviewResponse.data.data,
        distribution: distributionResponse.data.data,
        countries: countriesResponse.data.data,
        departments: departmentsResponse.data.data,
        roles: rolesResponse.data.data,
        generatedAt: overviewResponse.data.meta.generatedAt,
      };
    } catch (error) {
      throw extractApiError(error);
    }
  },
};
