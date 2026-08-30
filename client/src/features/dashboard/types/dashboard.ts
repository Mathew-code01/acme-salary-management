// client/src/features/dashboard/types/dashboard.ts

export interface DashboardFilters {
  countryCode?: string;
  department?: string;
  role?: string;
  currency?: string;
}

export interface AnalyticsMeta {
  generatedAt: string;
}

export interface AnalyticsResponse<T> {
  data: T;
  meta: AnalyticsMeta;
}

export interface AnalyticsOverviewMetrics {
  employeeCount: number;
  salaryRecordCount: number;
  currencies: number;
  averageSalaryCents: number | null;
  medianSalaryCents: number | null;
}

export interface CurrencyPayrollSummary {
  currency: string;
  employeeCount: number;
  totalPayrollCents: number;
  averageSalaryCents: number | null;
  medianSalaryCents: number | null;
  minimumSalaryCents: number | null;
  maximumSalaryCents: number | null;
}

export interface AnalyticsOverview {
  filters: DashboardFilters;
  metrics: AnalyticsOverviewMetrics;
  payrollByCurrency: CurrencyPayrollSummary[];
}

export interface SalaryDistributionBucket {
  key: 'under-40000' | '40000-59999' | '60000-79999' | '80000-99999' | '100000-plus';
  label: string;
  minCents: number;
  maxCents: number | null;
  employeeCount: number;
  percentage: number;
}

export interface SalaryDistribution {
  filters: DashboardFilters;
  totalEmployees: number;
  buckets: SalaryDistributionBucket[];
}

export interface CountrySalaryRow {
  countryCode: string;
  countryName: string;
  employeeCount: number;
  totalPayrollCents: number;
  averageSalaryCents: number | null;
  medianSalaryCents: number | null;
  currencies: string[];
}

export interface CountryAnalytics {
  filters: DashboardFilters;
  rows: CountrySalaryRow[];
}

export interface DepartmentCurrencyPayroll {
  currency: string;
  employeeCount: number;
  totalPayrollCents: number;
  averageSalaryCents: number | null;
  medianSalaryCents: number | null;
  minimumSalaryCents: number | null;
  maximumSalaryCents: number | null;
}

export interface DepartmentSalaryRow {
  department: string;
  employeeCount: number;
  totalPayrollByCurrency: DepartmentCurrencyPayroll[];
}

export interface DepartmentAnalytics {
  filters: DashboardFilters;
  rows: DepartmentSalaryRow[];
}

export interface DashboardData {
  overview: AnalyticsOverview;
  distribution: SalaryDistribution;
  countries: CountryAnalytics;
  departments: DepartmentAnalytics;
}
