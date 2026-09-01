// client/src/features/analytics/types/analytics.ts

/**
 * Analytics feature domain types.
 *
 * This file is the single source of truth for the frontend analytics
 * contract. API clients, hooks and UI components should consume these
 * types rather than defining their own shapes.
 */

/* -------------------------------------------------------------------------- */
/* Filters                                                                    */
/* -------------------------------------------------------------------------- */

export interface AnalyticsQueryFilters {
  countryCode: string;
  department: string;
  role: string;
  currency: string;
}

/* -------------------------------------------------------------------------- */
/* Currency payroll                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Payroll summary for one currency.
 *
 * Amounts are represented in cents to match the backend money contract.
 */
export interface CurrencyPayrollSummary {
  currency: string;
  employeeCount: number;
  totalPayrollCents: number;
  averageSalaryCents: number;
  minimumSalaryCents: number;
  maximumSalaryCents: number;
}

/* -------------------------------------------------------------------------- */
/* Overview                                                                   */
/* -------------------------------------------------------------------------- */

export interface AnalyticsOverviewMetrics {
  employeeCount: number;
  salaryRecordCount: number;
  averageSalaryCents: number;
  medianSalaryCents: number;
  currencies: number;
}

/**
 * High-level analytics overview.
 */
export interface AnalyticsOverview {
  metrics: AnalyticsOverviewMetrics;
  payrollByCurrency: CurrencyPayrollSummary[];
}

/* -------------------------------------------------------------------------- */
/* Salary distribution                                                        */
/* -------------------------------------------------------------------------- */

export interface SalaryDistributionBucket {
  /**
   * Stable frontend/API identifier for the bucket.
   *
   * Example:
   * "0-50000"
   */
  key: string;

  label: string;

  minSalaryCents: number;

  maxSalaryCents: number;

  employeeCount: number;

  percentage: number;
}

export interface SalaryDistribution {
  currency: string | null;

  totalEmployees: number;

  buckets: SalaryDistributionBucket[];
}

/* -------------------------------------------------------------------------- */
/* Country analytics                                                          */
/* -------------------------------------------------------------------------- */

export interface CountryAnalyticsRow {
  countryCode: string;

  countryName: string;

  employeeCount: number;

  averageSalaryCents: number;

  medianSalaryCents: number;

  currencies: string[];
}

export interface CountryAnalytics {
  rows: CountryAnalyticsRow[];
}

/* -------------------------------------------------------------------------- */
/* Department analytics                                                       */
/* -------------------------------------------------------------------------- */

export interface DepartmentAnalyticsRow {
  department: string;

  employeeCount: number;

  totalPayrollByCurrency: CurrencyPayrollSummary[];
}

export interface DepartmentAnalytics {
  rows: DepartmentAnalyticsRow[];
}

/* -------------------------------------------------------------------------- */
/* Role analytics                                                             */
/* -------------------------------------------------------------------------- */

export interface RoleAnalyticsRow {
  role: string;

  employeeCount: number;

  totalPayrollByCurrency: CurrencyPayrollSummary[];
}

export interface RoleAnalytics {
  rows: RoleAnalyticsRow[];
}

/* -------------------------------------------------------------------------- */
/* API metadata                                                               */
/* -------------------------------------------------------------------------- */

export interface AnalyticsMeta {
  generatedAt: string;
}

/**
 * Generic analytics API response.
 */
export interface AnalyticsResponse<T> {
  success?: boolean;

  data: T;

  meta: AnalyticsMeta;

  message?: string;
}

/* -------------------------------------------------------------------------- */
/* Aggregated frontend state                                                  */
/* -------------------------------------------------------------------------- */

export interface AnalyticsData {
  overview: AnalyticsOverview;

  distribution: SalaryDistribution;

  countries: CountryAnalytics;

  departments: DepartmentAnalytics;

  roles: RoleAnalytics;

  generatedAt: string;
}