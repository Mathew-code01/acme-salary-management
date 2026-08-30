// server/src/services/analytics.service.ts

import { analyticsRepository } from '../repositories/analytics.repository';
import type {
  AnalyticsFilters,
  AnalyticsOverview,
  CountryAnalytics,
  DepartmentAnalytics,
  RoleAnalytics,
  SalaryDistribution,
  CurrencyPayrollSummary,
} from '../types/analytics';

const DISTRIBUTION_BUCKETS = [
  {
    key: 'under-40000',
    label: 'Under $40k',
    minCents: 0,
    maxCents: 39_999_00,
  },
  {
    key: '40000-59999',
    label: '$40k–$59,999',
    minCents: 40_000_00,
    maxCents: 59_999_99,
  },
  {
    key: '60000-79999',
    label: '$60k–$79,999',
    minCents: 60_000_00,
    maxCents: 79_999_99,
  },
  {
    key: '80000-99999',
    label: '$80k–$99,999',
    minCents: 80_000_00,
    maxCents: 99_999_99,
  },
  {
    key: '100000-plus',
    label: '$100k+',
    minCents: 100_000_00,
    maxCents: null,
  },
] as const;

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function toPercentage(value: number, total: number): number {
  if (total === 0) {
    return 0;
  }

  return round((value / total) * 100);
}

function createCurrencySummary(
  row: {
    currency: string;
    employeeCount: number;
    totalPayrollCents: number;
    averageSalaryCents: number | null;
    minimumSalaryCents: number | null;
    maximumSalaryCents: number | null;
  },
  medianSalaryCents: number | null,
): CurrencyPayrollSummary {
  return {
    currency: row.currency,
    employeeCount: row.employeeCount,
    totalPayrollCents: row.totalPayrollCents,
    averageSalaryCents: row.averageSalaryCents,
    medianSalaryCents,
    minimumSalaryCents: row.minimumSalaryCents,
    maximumSalaryCents: row.maximumSalaryCents,
  };
}

export class AnalyticsService {
  async getOverview(filters: AnalyticsFilters): Promise<AnalyticsOverview> {
    const [
      employeeCount,
      salaryRecordCount,
      currencies,
      aggregate,
      medianSalaryCents,
      currencyRows,
      mediansByCurrency,
    ] = await Promise.all([
      analyticsRepository.countEmployees(filters),
      analyticsRepository.countSalaryRecords(filters),
      analyticsRepository.countCurrencies(filters),
      analyticsRepository.aggregateOverallSalary(filters),
      analyticsRepository.findMedianSalary(filters),
      analyticsRepository.aggregateByCurrency(filters),
      analyticsRepository.findMedianByCurrency(filters),
    ]);

    const payrollByCurrency = currencyRows.map((row) =>
      createCurrencySummary(row, mediansByCurrency.get(row.currency) ?? null),
    );

    return {
      filters,
      metrics: {
        employeeCount,
        salaryRecordCount,
        currencies,
        averageSalaryCents: aggregate._avg.amountCents ?? null,
        medianSalaryCents,
      },
      payrollByCurrency,
    };
  }

  async getDistribution(filters: AnalyticsFilters): Promise<SalaryDistribution> {
    const salaryRows = await analyticsRepository.getSalaryRows(filters);

    const buckets = DISTRIBUTION_BUCKETS.map((bucket) => {
      const employeeCount = salaryRows.filter((salary) => {
        if (bucket.maxCents === null) {
          return salary.amountCents >= bucket.minCents;
        }

        return salary.amountCents >= bucket.minCents && salary.amountCents <= bucket.maxCents;
      }).length;

      return {
        ...bucket,
        employeeCount,
        percentage: toPercentage(employeeCount, salaryRows.length),
      };
    });

    return {
      filters,
      totalEmployees: salaryRows.length,
      buckets: [...buckets],
    };
  }

  async getCountries(filters: AnalyticsFilters): Promise<CountryAnalytics> {
    const salaryRows = await analyticsRepository.getCountrySalaryRows(filters);

    const countryMap = new Map<
      string,
      {
        countryCode: string;
        countryName: string;
        salaries: number[];
        currencies: Set<string>;
      }
    >();

    for (const row of salaryRows) {
      const countryCode = row.employee.country.code;
      const countryName = row.employee.country.name;

      let entry = countryMap.get(countryCode);

      if (!entry) {
        entry = {
          countryCode,
          countryName,
          salaries: [],
          currencies: new Set<string>(),
        };

        countryMap.set(countryCode, entry);
      }

      entry.salaries.push(row.amountCents);
      entry.currencies.add(row.currency);
    }

    const rows = Array.from(countryMap.values())
      .map((country) => {
        const salaries = [...country.salaries].sort((a, b) => a - b);

        const totalPayrollCents = salaries.reduce((total, salary) => total + salary, 0);

        const averageSalaryCents =
          salaries.length > 0 ? Math.round(totalPayrollCents / salaries.length) : null;

        const medianSalaryCents = this.calculateMedian(salaries);

        return {
          countryCode: country.countryCode,
          countryName: country.countryName,
          employeeCount: salaries.length,
          totalPayrollCents,
          averageSalaryCents,
          medianSalaryCents,
          currencies: Array.from(country.currencies).sort(),
        };
      })
      .sort((a, b) => b.employeeCount - a.employeeCount);

    return {
      filters,
      rows,
    };
  }

  async getDepartments(filters: AnalyticsFilters): Promise<DepartmentAnalytics> {
    const salaryRows = await analyticsRepository.getDepartmentSalaryRows(filters);

    const departmentMap = new Map<string, Map<string, number[]>>();

    for (const row of salaryRows) {
      const department = row.employee.department.name;

      if (!departmentMap.has(department)) {
        departmentMap.set(department, new Map());
      }

      const currencyMap = departmentMap.get(department)!;

      if (!currencyMap.has(row.currency)) {
        currencyMap.set(row.currency, []);
      }

      currencyMap.get(row.currency)!.push(row.amountCents);
    }

    const rows = Array.from(departmentMap.entries())
      .map(([department, currencyMap]) => {
        const totalEmployeeCount = Array.from(currencyMap.values()).reduce(
          (total, salaries) => total + salaries.length,
          0,
        );

        const totalPayrollByCurrency = Array.from(currencyMap.entries())
          .map(([currency, salaries]) => {
            const totalPayrollCents = salaries.reduce((total, salary) => total + salary, 0);

            return {
              currency,
              employeeCount: salaries.length,
              totalPayrollCents,
              averageSalaryCents:
                salaries.length > 0 ? Math.round(totalPayrollCents / salaries.length) : null,
              medianSalaryCents: this.calculateMedian(salaries),
              minimumSalaryCents: salaries.length > 0 ? Math.min(...salaries) : null,
              maximumSalaryCents: salaries.length > 0 ? Math.max(...salaries) : null,
            };
          })
          .sort((a, b) => a.currency.localeCompare(b.currency));

        return {
          department,
          employeeCount: totalEmployeeCount,
          totalPayrollByCurrency,
        };
      })
      .sort((a, b) => b.employeeCount - a.employeeCount);

    return {
      filters,
      rows,
    };
  }

  async getRoles(filters: AnalyticsFilters): Promise<RoleAnalytics> {
    const salaryRows = await analyticsRepository.getRoleSalaryRows(filters);

    const roleMap = new Map<string, Map<string, number[]>>();

    for (const row of salaryRows) {
      const role = row.employee.role.name;

      if (!roleMap.has(role)) {
        roleMap.set(role, new Map());
      }

      const currencyMap = roleMap.get(role)!;

      if (!currencyMap.has(row.currency)) {
        currencyMap.set(row.currency, []);
      }

      currencyMap.get(row.currency)!.push(row.amountCents);
    }

    const rows = Array.from(roleMap.entries())
      .map(([role, currencyMap]) => {
        const employeeCount = Array.from(currencyMap.values()).reduce(
          (total, salaries) => total + salaries.length,
          0,
        );

        const totalPayrollByCurrency = Array.from(currencyMap.entries())
          .map(([currency, salaries]) => {
            const totalPayrollCents = salaries.reduce((total, salary) => total + salary, 0);

            return {
              currency,
              employeeCount: salaries.length,
              totalPayrollCents,
              averageSalaryCents:
                salaries.length > 0 ? Math.round(totalPayrollCents / salaries.length) : null,
              medianSalaryCents: this.calculateMedian(salaries),
              minimumSalaryCents: salaries.length > 0 ? Math.min(...salaries) : null,
              maximumSalaryCents: salaries.length > 0 ? Math.max(...salaries) : null,
            };
          })
          .sort((a, b) => a.currency.localeCompare(b.currency));

        return {
          role,
          employeeCount,
          totalPayrollByCurrency,
        };
      })
      .sort((a, b) => b.employeeCount - a.employeeCount);

    return {
      filters,
      rows,
    };
  }

  private calculateMedian(values: number[]): number | null {
    if (values.length === 0) {
      return null;
    }

    const sorted = [...values].sort((a, b) => a - b);

    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return Math.round((sorted[middle - 1]! + sorted[middle]!) / 2);
    }

    return sorted[middle]!;
  }
}

export const analyticsService = new AnalyticsService();
