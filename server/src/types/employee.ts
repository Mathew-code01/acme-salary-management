// server/src/types/employee.ts

export interface EmployeeListQuery {
  page: number;
  pageSize: number;

  search?: string;

  countryId?: number;
  departmentId?: number;
  roleId?: number;

  sortBy: EmployeeSortField;
  sortOrder: EmployeeSortOrder;
}

export type EmployeeSortField = 'employeeCode' | 'firstName' | 'lastName' | 'email' | 'createdAt';

export type EmployeeSortOrder = 'asc' | 'desc';

export interface CreateEmployeeInput {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  countryId: number;
  departmentId: number;
  roleId: number;
}

export interface UpdateEmployeeInput {
  employeeCode?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  countryId?: number;
  departmentId?: number;
  roleId?: number;
}

export interface EmployeeListItem {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
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

  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeDetails extends EmployeeListItem {
  salary: {
    id: number;
    amountCents: number;
    currency: string;
    effectiveFrom: Date;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export interface EmployeePagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface EmployeeListResult {
  items: EmployeeListItem[];
  pagination: EmployeePagination;
}
