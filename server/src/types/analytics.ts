// server/src/types/analytics.ts

export type AnalyticsCurrency = string;

export interface AnalyticsFilters {
  countryCode?: string;
  department?: string;
  role?: string;
  currency?: string;
}

export interface AnalyticsOverviewMetrics {
  employeeCount: number;
  salaryRecordCount: number;
  currencies: number;
  averageSalaryCents: number | null;
  medianSalaryCents: number | null;
}

export interface CurrencyPayrollSummary {
  currency: AnalyticsCurrency;
  employeeCount: number;
  totalPayrollCents: number;
  averageSalaryCents: number | null;
  medianSalaryCents: number | null;
  minimumSalaryCents: number | null;
  maximumSalaryCents: number | null;
}

export interface AnalyticsOverview {
  filters: AnalyticsFilters;
  metrics: AnalyticsOverviewMetrics;
  payrollByCurrency: CurrencyPayrollSummary[];
}

export interface SalaryDistributionBucket {
  key: string;
  label: string;
  minCents: number;
  maxCents: number | null;
  employeeCount: number;
  percentage: number;
}

export interface SalaryDistribution {
  filters: AnalyticsFilters;
  totalEmployees: number;
  buckets: SalaryDistributionBucket[];
}

export interface CountryAnalyticsRow {
  countryCode: string;
  countryName: string;
  employeeCount: number;
  totalPayrollCents: number;
  averageSalaryCents: number | null;
  medianSalaryCents: number | null;
  currencies: string[];
}

export interface CountryAnalytics {
  filters: AnalyticsFilters;
  rows: CountryAnalyticsRow[];
}

export interface DepartmentAnalyticsRow {
  department: string;
  employeeCount: number;
  totalPayrollByCurrency: CurrencyPayrollSummary[];
}

export interface DepartmentAnalytics {
  filters: AnalyticsFilters;
  rows: DepartmentAnalyticsRow[];
}

export interface RoleAnalyticsRow {
  role: string;
  employeeCount: number;
  totalPayrollByCurrency: CurrencyPayrollSummary[];
}

export interface RoleAnalytics {
  filters: AnalyticsFilters;
  rows: RoleAnalyticsRow[];
}

export interface AnalyticsResponse<T> {
  data: T;
  meta: {
    generatedAt: string;
  };
}
