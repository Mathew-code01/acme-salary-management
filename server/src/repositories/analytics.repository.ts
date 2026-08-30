// server/src/repositories/analytics.repository.ts

import { prisma } from '../lib/prisma';
import type { AnalyticsFilters } from '../types/analytics';

interface SalaryWhere {
  employee: {
    country?: {
      code: string;
    };
    department?: {
      name: string;
    };
    role?: {
      name: string;
    };
  };
  currency?: string;
}

interface CurrencyAggregateRow {
  currency: string;
  employeeCount: number;
  totalPayrollCents: number;
  averageSalaryCents: number | null;
  minimumSalaryCents: number | null;
  maximumSalaryCents: number | null;
}

interface MedianRow {
  median: number | null;
}

export class AnalyticsRepository {
  private buildSalaryWhere(filters: AnalyticsFilters): SalaryWhere {
    const where: SalaryWhere = {
      employee: {},
    };

    if (filters.countryCode) {
      where.employee.country = {
        code: filters.countryCode,
      };
    }

    if (filters.department) {
      where.employee.department = {
        name: filters.department,
      };
    }

    if (filters.role) {
      where.employee.role = {
        name: filters.role,
      };
    }

    if (filters.currency) {
      where.currency = filters.currency;
    }

    return where;
  }

  async countEmployees(filters: AnalyticsFilters): Promise<number> {
    return prisma.employee.count({
      where: {
        ...(filters.countryCode
          ? {
              country: {
                code: filters.countryCode,
              },
            }
          : {}),

        ...(filters.department
          ? {
              department: {
                name: filters.department,
              },
            }
          : {}),

        ...(filters.role
          ? {
              role: {
                name: filters.role,
              },
            }
          : {}),
      },
    });
  }

  async countSalaryRecords(filters: AnalyticsFilters): Promise<number> {
    return prisma.salary.count({
      where: this.buildSalaryWhere(filters),
    });
  }

  async countCurrencies(filters: AnalyticsFilters): Promise<number> {
    const currencies = await prisma.salary.findMany({
      where: this.buildSalaryWhere(filters),
      select: {
        currency: true,
      },
      distinct: ['currency'],
    });

    return currencies.length;
  }

  async aggregateOverallSalary(filters: AnalyticsFilters) {
    return prisma.salary.aggregate({
      where: this.buildSalaryWhere(filters),
      _avg: {
        amountCents: true,
      },
    });
  }

  async findMedianSalary(filters: AnalyticsFilters): Promise<number | null> {
    const rows = await prisma.$queryRaw<MedianRow[]>`
      SELECT AVG(amountCents) AS median
      FROM (
        SELECT
          amountCents,
          ROW_NUMBER() OVER (ORDER BY amountCents) AS row_number,
          COUNT(*) OVER () AS total_count
        FROM Salary s
        INNER JOIN Employee e
          ON e.id = s.employeeId
        INNER JOIN Country c
          ON c.id = e.countryId
        INNER JOIN Department d
          ON d.id = e.departmentId
        INNER JOIN Role r
          ON r.id = e.roleId
        WHERE
          (${filters.countryCode ?? null} IS NULL OR c.code = ${filters.countryCode ?? null})
          AND (${filters.department ?? null} IS NULL OR d.name = ${filters.department ?? null})
          AND (${filters.role ?? null} IS NULL OR r.name = ${filters.role ?? null})
          AND (${filters.currency ?? null} IS NULL OR s.currency = ${filters.currency ?? null})
      ) ranked
      WHERE row_number IN (
        (total_count + 1) / 2,
        (total_count + 2) / 2
      )
    `;

    const median = rows[0]?.median;

    return median === null || median === undefined ? null : Number(median);
  }

  async aggregateByCurrency(filters: AnalyticsFilters): Promise<CurrencyAggregateRow[]> {
    const rows = await prisma.salary.groupBy({
      by: ['currency'],
      where: this.buildSalaryWhere(filters),
      _count: {
        employeeId: true,
      },
      _sum: {
        amountCents: true,
      },
      _avg: {
        amountCents: true,
      },
      _min: {
        amountCents: true,
      },
      _max: {
        amountCents: true,
      },
      orderBy: {
        currency: 'asc',
      },
    });

    return rows.map((row) => ({
      currency: row.currency,
      employeeCount: row._count.employeeId,
      totalPayrollCents: row._sum.amountCents ?? 0,
      averageSalaryCents: row._avg.amountCents ?? null,
      minimumSalaryCents: row._min.amountCents ?? null,
      maximumSalaryCents: row._max.amountCents ?? null,
    }));
  }

  async findMedianByCurrency(filters: AnalyticsFilters): Promise<Map<string, number | null>> {
    const rows = await prisma.$queryRaw<
      Array<{
        currency: string;
        median: number | null;
      }>
    >`
      WITH ranked AS (
        SELECT
          s.currency,
          s.amountCents,
          ROW_NUMBER() OVER (
            PARTITION BY s.currency
            ORDER BY s.amountCents
          ) AS row_number,
          COUNT(*) OVER (
            PARTITION BY s.currency
          ) AS total_count
        FROM Salary s
        INNER JOIN Employee e
          ON e.id = s.employeeId
        INNER JOIN Country c
          ON c.id = e.countryId
        INNER JOIN Department d
          ON d.id = e.departmentId
        INNER JOIN Role r
          ON r.id = e.roleId
        WHERE
          (${filters.countryCode ?? null} IS NULL OR c.code = ${filters.countryCode ?? null})
          AND (${filters.department ?? null} IS NULL OR d.name = ${filters.department ?? null})
          AND (${filters.role ?? null} IS NULL OR r.name = ${filters.role ?? null})
          AND (${filters.currency ?? null} IS NULL OR s.currency = ${filters.currency ?? null})
      )
      SELECT
        currency,
        AVG(amountCents) AS median
      FROM ranked
      WHERE row_number IN (
        (total_count + 1) / 2,
        (total_count + 2) / 2
      )
      GROUP BY currency
      ORDER BY currency ASC
    `;

    return new Map(
      rows.map((row) => [row.currency, row.median === null ? null : Number(row.median)]),
    );
  }

  async getSalaryRows(filters: AnalyticsFilters) {
    return prisma.salary.findMany({
      where: this.buildSalaryWhere(filters),
      select: {
        amountCents: true,
      },
      orderBy: {
        amountCents: 'asc',
      },
    });
  }

  async aggregateCountries(filters: AnalyticsFilters) {
    return prisma.salary.groupBy({
      by: ['currency'],
      where: this.buildSalaryWhere(filters),
      _count: {
        employeeId: true,
      },
      _sum: {
        amountCents: true,
      },
      _avg: {
        amountCents: true,
      },
      orderBy: {
        currency: 'asc',
      },
    });
  }

  async getCountrySalaryRows(filters: AnalyticsFilters) {
    return prisma.salary.findMany({
      where: this.buildSalaryWhere(filters),
      select: {
        amountCents: true,
        currency: true,
        employee: {
          select: {
            country: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        amountCents: 'asc',
      },
    });
  }

  async getDepartmentSalaryRows(filters: AnalyticsFilters) {
    return prisma.salary.findMany({
      where: this.buildSalaryWhere(filters),
      select: {
        amountCents: true,
        currency: true,
        employee: {
          select: {
            department: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async getRoleSalaryRows(filters: AnalyticsFilters) {
    return prisma.salary.findMany({
      where: this.buildSalaryWhere(filters),
      select: {
        amountCents: true,
        currency: true,
        employee: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }
}

export const analyticsRepository = new AnalyticsRepository();
