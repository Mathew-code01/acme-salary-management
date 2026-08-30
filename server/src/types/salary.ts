// server/src/types/salary.ts

export const SALARY_SORT_FIELDS = [
  'amountCents',
  'currency',
  'effectiveFrom',
  'createdAt',
  'updatedAt',
] as const;

export type SalarySortField = (typeof SALARY_SORT_FIELDS)[number];

export const SORT_DIRECTIONS = ['asc', 'desc'] as const;

export type SortDirection = (typeof SORT_DIRECTIONS)[number];

export interface SalaryListQuery {
  page: number;
  limit: number;
  employeeId?: number;
  currency?: string;
  minAmountCents?: number;
  maxAmountCents?: number;
  effectiveFrom?: Date;
  effectiveTo?: Date;
  search?: string;
  sortBy: SalarySortField;
  sortOrder: SortDirection;
}

export interface CreateSalaryInput {
  employeeId: number;
  amountCents: number;
  currency: string;
  effectiveFrom: Date;
}

export interface UpdateSalaryInput {
  amountCents?: number;
  currency?: string;
  effectiveFrom?: Date;
}

export interface SalaryResponse {
  id: number;
  employeeId: number;
  amountCents: number;
  currency: string;
  effectiveFrom: Date;
  createdAt: Date;
  updatedAt: Date;
  employee: {
    id: number;
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    country: {
      id: number;
      code: string;
      name: string;
    };
    department: {
      id: number;
      name: string;
    };
    role: {
      id: number;
      name: string;
    };
  };
}

export interface PaginatedSalaryResponse {
  data: SalaryResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
