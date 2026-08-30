// client/src/features/dashboard/api/dashboard-api.ts

import type {
  AnalyticsOverview,
  AnalyticsResponse,
  CountryAnalytics,
  DashboardFilters,
  DepartmentAnalytics,
  SalaryDistribution,
} from '../types/dashboard';

const API_BASE_URL = (import.meta.env.VITE_API_URL?.trim() || '/api/v1').replace(/\/+$/, '');

class DashboardApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);

    this.name = 'DashboardApiError';
    this.status = status;
    this.details = details;
  }
}

function buildQueryString(filters: DashboardFilters = {}): string {
  const params = new URLSearchParams();

  if (filters.countryCode) {
    params.set('countryCode', filters.countryCode);
  }

  if (filters.department) {
    params.set('department', filters.department);
  }

  if (filters.role) {
    params.set('role', filters.role);
  }

  if (filters.currency) {
    params.set('currency', filters.currency);
  }

  const query = params.toString();

  return query ? `?${query}` : '';
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }

    throw new DashboardApiError('Unable to connect to the analytics service.', 0, error);
  }

  let body: unknown = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      typeof body.message === 'string'
        ? body.message
        : `Analytics request failed with status ${response.status}.`;

    throw new DashboardApiError(message, response.status, body);
  }

  return body as T;
}

export const dashboardApi = {
  async getOverview(
    filters: DashboardFilters = {},
    signal?: AbortSignal,
  ): Promise<AnalyticsOverview> {
    const response = await request<AnalyticsResponse<AnalyticsOverview>>(
      `/analytics/overview${buildQueryString(filters)}`,
      signal,
    );

    return response.data;
  },

  async getDistribution(
    filters: DashboardFilters = {},
    signal?: AbortSignal,
  ): Promise<SalaryDistribution> {
    const response = await request<AnalyticsResponse<SalaryDistribution>>(
      `/analytics/distribution${buildQueryString(filters)}`,
      signal,
    );

    return response.data;
  },

  async getCountries(
    filters: DashboardFilters = {},
    signal?: AbortSignal,
  ): Promise<CountryAnalytics> {
    const response = await request<AnalyticsResponse<CountryAnalytics>>(
      `/analytics/countries${buildQueryString(filters)}`,
      signal,
    );

    return response.data;
  },

  async getDepartments(
    filters: DashboardFilters = {},
    signal?: AbortSignal,
  ): Promise<DepartmentAnalytics> {
    const response = await request<AnalyticsResponse<DepartmentAnalytics>>(
      `/analytics/departments${buildQueryString(filters)}`,
      signal,
    );

    return response.data;
  },
};

export { DashboardApiError };
