// server/tests/unit/analytics.service.test.ts


import { beforeEach, describe, expect, it, vi } from 'vitest';

import { analyticsService } from '../../src/services/analytics.service';

import { analyticsRepository } from '../../src/repositories/analytics.repository';

vi.mock('../../src/repositories/analytics.repository', () => ({
  analyticsRepository: {
    countEmployees: vi.fn(),
    countSalaryRecords: vi.fn(),
    countCurrencies: vi.fn(),
    aggregateOverallSalary: vi.fn(),
    findMedianSalary: vi.fn(),
    aggregateByCurrency: vi.fn(),
    findMedianByCurrency: vi.fn(),

    getSalaryRows: vi.fn(),
    getCountrySalaryRows: vi.fn(),
    getDepartmentSalaryRows: vi.fn(),
    getRoleSalaryRows: vi.fn(),
  },
}));

describe('AnalyticsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOverview', () => {
    it('returns overview analytics', async () => {
      vi.mocked(analyticsRepository.countEmployees)
        .mockResolvedValue(3);

      vi.mocked(analyticsRepository.countSalaryRecords)
        .mockResolvedValue(3);

      vi.mocked(analyticsRepository.countCurrencies)
        .mockResolvedValue(2);

      vi.mocked(
        analyticsRepository.aggregateOverallSalary,
      ).mockResolvedValue({
        _avg: {
          amountCents: 100_000_00,
        },
      });

      vi.mocked(
        analyticsRepository.findMedianSalary,
      ).mockResolvedValue(90_000_00);

      vi.mocked(
        analyticsRepository.aggregateByCurrency,
      ).mockResolvedValue([
        {
          currency: 'USD',
          employeeCount: 2,
          totalPayrollCents: 220_000_00,
          averageSalaryCents: 110_000_00,
          minimumSalaryCents: 100_000_00,
          maximumSalaryCents: 120_000_00,
        },
      ]);

      vi.mocked(
        analyticsRepository.findMedianByCurrency,
      ).mockResolvedValue(
        new Map([
          ['USD', 110_000_00],
        ]),
      );

      const result =
        await analyticsService.getOverview({});

      expect(result.metrics).toEqual({
        employeeCount: 3,
        salaryRecordCount: 3,
        currencies: 2,
        averageSalaryCents: 100_000_00,
        medianSalaryCents: 90_000_00,
      });

      expect(result.payrollByCurrency[0])
        .toEqual({
          currency: 'USD',
          employeeCount: 2,
          totalPayrollCents: 220_000_00,
          averageSalaryCents: 110_000_00,
          medianSalaryCents: 110_000_00,
          minimumSalaryCents: 100_000_00,
          maximumSalaryCents: 120_000_00,
        });
    });
  });

  describe('getDistribution', () => {
    it('places salaries into the correct buckets', async () => {
      vi.mocked(
        analyticsRepository.getSalaryRows,
      ).mockResolvedValue([
        { amountCents: 30_000_00 },
        { amountCents: 50_000_00 },
        { amountCents: 70_000_00 },
        { amountCents: 90_000_00 },
        { amountCents: 120_000_00 },
      ]);

      const result =
        await analyticsService.getDistribution({});

      expect(result.totalEmployees)
        .toBe(5);

      expect(result.buckets).toHaveLength(5);

      expect(result.buckets[0]?.employeeCount)
        .toBe(1);

      expect(result.buckets[1]?.employeeCount)
        .toBe(1);

      expect(result.buckets[2]?.employeeCount)
        .toBe(1);

      expect(result.buckets[3]?.employeeCount)
        .toBe(1);

      expect(result.buckets[4]?.employeeCount)
        .toBe(1);

      expect(result.buckets[0]?.percentage)
        .toBe(20);

      expect(result.buckets[4]?.percentage)
        .toBe(20);
    });

    it('returns zero percentages when there are no salaries', async () => {
      vi.mocked(
        analyticsRepository.getSalaryRows,
      ).mockResolvedValue([]);

      const result =
        await analyticsService.getDistribution({});

      expect(result.totalEmployees)
        .toBe(0);

      expect(
        result.buckets.every(
          (bucket) => bucket.employeeCount === 0,
        ),
      ).toBe(true);

      expect(
        result.buckets.every(
          (bucket) => bucket.percentage === 0,
        ),
      ).toBe(true);
    });
  });

  describe('getCountries', () => {
    it('groups salary records by country', async () => {
      vi.mocked(
        analyticsRepository.getCountrySalaryRows,
      ).mockResolvedValue([
        {
          amountCents: 100_000_00,
          currency: 'USD',
          employee: {
            country: {
              code: 'US',
              name: 'United States',
            },
          },
        },
        {
          amountCents: 120_000_00,
          currency: 'USD',
          employee: {
            country: {
              code: 'US',
              name: 'United States',
            },
          },
        },
        {
          amountCents: 80_000_00,
          currency: 'GBP',
          employee: {
            country: {
              code: 'GB',
              name: 'United Kingdom',
            },
          },
        },
      ]);

      const result =
        await analyticsService.getCountries({});

      expect(result.rows).toHaveLength(2);

      const unitedStates =
        result.rows.find(
          (row) => row.countryCode === 'US',
        );

      expect(unitedStates).toEqual({
        countryCode: 'US',
        countryName: 'United States',
        employeeCount: 2,
        totalPayrollCents: 220_000_00,
        averageSalaryCents: 110_000_00,
        medianSalaryCents: 110_000_00,
        currencies: ['USD'],
      });
    });
  });

  describe('getDepartments', () => {
    it('groups salaries by department and currency', async () => {
      vi.mocked(
        analyticsRepository.getDepartmentSalaryRows,
      ).mockResolvedValue([
        {
          amountCents: 100_000_00,
          currency: 'USD',
          employee: {
            department: {
              name: 'Engineering',
            },
          },
        },
        {
          amountCents: 120_000_00,
          currency: 'USD',
          employee: {
            department: {
              name: 'Engineering',
            },
          },
        },
        {
          amountCents: 70_000_00,
          currency: 'GBP',
          employee: {
            department: {
              name: 'Finance',
            },
          },
        },
      ]);

      const result =
        await analyticsService.getDepartments({});

      expect(result.rows).toHaveLength(2);

      const engineering =
        result.rows.find(
          (row) => row.department === 'Engineering',
        );

      expect(engineering?.employeeCount)
        .toBe(2);

      expect(
        engineering?.totalPayrollByCurrency[0],
      ).toEqual({
        currency: 'USD',
        employeeCount: 2,
        totalPayrollCents: 220_000_00,
        averageSalaryCents: 110_000_00,
        medianSalaryCents: 110_000_00,
        minimumSalaryCents: 100_000_00,
        maximumSalaryCents: 120_000_00,
      });
    });
  });

  describe('getRoles', () => {
    it('groups salaries by role and currency', async () => {
      vi.mocked(
        analyticsRepository.getRoleSalaryRows,
      ).mockResolvedValue([
        {
          amountCents: 100_000_00,
          currency: 'USD',
          employee: {
            role: {
              name: 'Software Engineer',
            },
          },
        },
        {
          amountCents: 140_000_00,
          currency: 'USD',
          employee: {
            role: {
              name: 'Software Engineer',
            },
          },
        },
      ]);

      const result =
        await analyticsService.getRoles({});

      expect(result.rows).toHaveLength(1);

      expect(result.rows[0]?.role)
        .toBe('Software Engineer');

      expect(result.rows[0]?.employeeCount)
        .toBe(2);

      expect(
        result.rows[0]?.totalPayrollByCurrency[0]
          ?.medianSalaryCents,
      ).toBe(120_000_00);
    });

    it('returns empty rows when no salary records exist', async () => {
      vi.mocked(
        analyticsRepository.getRoleSalaryRows,
      ).mockResolvedValue([]);

      const result =
        await analyticsService.getRoles({});

      expect(result.rows).toEqual([]);
    });
  });
});