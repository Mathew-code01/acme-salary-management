// client/src/features/employees/utils/employee-formatters.ts

import type { EmployeeStatus } from '../types/employee';

export function formatEmployeeName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

export function formatEmployeeStatus(status: EmployeeStatus): string {
  return status === 'ACTIVE' ? 'Active' : 'Inactive';
}

export function formatEmployeeCount(count: number): string {
  return new Intl.NumberFormat('en-US').format(count);
}

export function formatDate(value?: string): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}