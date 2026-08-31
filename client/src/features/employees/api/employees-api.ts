// client/src/features/employees/api/employees-api.ts

import type { EmployeeListQuery, EmployeeListResponse, EmployeeOption } from '../types/employee';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? '';

const EMPLOYEES_ENDPOINT = `${API_BASE_URL}/api/v1/employees`;

class EmployeesApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'EmployeesApiError';
    this.status = status;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  let message = 'Unable to complete the employee request.';

  try {
    const body: unknown = await response.json();

    if (
      typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      typeof body.message === 'string'
    ) {
      message = body.message;
    }
  } catch {
    // Ignore invalid/non-JSON error responses.
  }

  throw new EmployeesApiError(message, response.status);
}

function buildQueryString(query: EmployeeListQuery): string {
  const params = new URLSearchParams();

  if (query.search) {
    params.set('search', query.search);
  }

  if (query.countryId !== null) {
    params.set('countryId', String(query.countryId));
  }

  if (query.departmentId !== null) {
    params.set('departmentId', String(query.departmentId));
  }

  if (query.roleId !== null) {
    params.set('roleId', String(query.roleId));
  }

  params.set('page', String(query.page));
  params.set('pageSize', String(query.pageSize));

  return params.toString();
}

async function getEmployees(
  query: EmployeeListQuery,
  signal?: AbortSignal,
): Promise<EmployeeListResponse> {
  const queryString = buildQueryString(query);

  const response = await fetch(`${EMPLOYEES_ENDPOINT}?${queryString}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  return parseResponse<EmployeeListResponse>(response);
}

async function getCountries(signal?: AbortSignal): Promise<EmployeeOption[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/countries`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  return parseResponse<EmployeeOption[]>(response);
}

async function getDepartments(signal?: AbortSignal): Promise<EmployeeOption[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/departments`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  return parseResponse<EmployeeOption[]>(response);
}

async function getRoles(signal?: AbortSignal): Promise<EmployeeOption[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/roles`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  return parseResponse<EmployeeOption[]>(response);
}

export const employeesApi = {
  getEmployees,
  getCountries,
  getDepartments,
  getRoles,
};

export { EmployeesApiError };
