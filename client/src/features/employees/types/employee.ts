// client/src/features/employees/types/employee.ts

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;

  countryId: number;
  countryName?: string;

  departmentId: number;
  departmentName?: string;

  roleId: number;
  roleName?: string;

  status: EmployeeStatus;

  createdAt?: string;
  updatedAt?: string;
}

export interface EmployeeListFilters {
  search: string;
  countryId: number | null;
  departmentId: number | null;
  roleId: number | null;
}

export interface EmployeeListQuery extends EmployeeListFilters {
  page: number;
  pageSize: number;
}

export interface EmployeePagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface EmployeeListResponse {
  items: Employee[];
  pagination: EmployeePagination;
}

export interface EmployeeOption {
  id: number;
  name: string;
}

export interface EmployeeFilterOptions {
  countries: EmployeeOption[];
  departments: EmployeeOption[];
  roles: EmployeeOption[];
}
