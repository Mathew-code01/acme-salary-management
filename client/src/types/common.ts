// client/src/types/common.ts

export type ID = string;

export type Status = "active" | "inactive" | "pending" | "archived";

export type SortDirection = "asc" | "desc";

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiErrorShape {
  code?: string;
  message: string;
  details?: unknown;
  requestId?: string;
}

export interface SelectOption<T extends string = string> {
  label: string;
  value: T;
}

export interface DateRange {
  from?: string;
  to?: string;
}
