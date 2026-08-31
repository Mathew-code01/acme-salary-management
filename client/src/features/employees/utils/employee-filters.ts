// client/src/features/employees/utils/employee-filters.ts

import type { EmployeeListFilters, EmployeeListQuery } from '../types/employee';

const DEFAULT_PAGE_SIZE = 25;

export function createDefaultEmployeeFilters(): EmployeeListFilters {
  return {
    search: '',
    countryId: null,
    departmentId: null,
    roleId: null,
  };
}

export function normalizeEmployeeSearch(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function createEmployeeQuery(
  filters: EmployeeListFilters,
  page: number,
  pageSize = DEFAULT_PAGE_SIZE,
): EmployeeListQuery {
  return {
    search: normalizeEmployeeSearch(filters.search),
    countryId: filters.countryId,
    departmentId: filters.departmentId,
    roleId: filters.roleId,
    page: Math.max(1, page),
    pageSize: Math.max(1, pageSize),
  };
}

export function hasActiveEmployeeFilters(filters: EmployeeListFilters): boolean {
  return Boolean(
    filters.search.trim() ||
    filters.countryId !== null ||
    filters.departmentId !== null ||
    filters.roleId !== null,
  );
}