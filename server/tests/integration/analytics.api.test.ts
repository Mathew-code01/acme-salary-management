// server/tests/integration/analytics.api.test.ts

import request from 'supertest';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { app } from '../../src/app';

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

describe('Analytics API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/analytics/overview', () => {
    it('returns overview analytics', async () => {
      vi.mocked(analyticsRepository.countEmployees).mockResolvedValue(10);

      vi.mocked(analyticsRepository.countSalaryRecords).mockResolvedValue(10);

      vi.mocked(analyticsRepository.countCurrencies).mockResolvedValue(2);

      vi.mocked(analyticsRepository.aggregateOverallSalary).mockResolvedValue({
        _avg: {
          amountCents: 100_000_00,
        },
      });

      vi.mocked(analyticsRepository.findMedianSalary).mockResolvedValue(95_000_00);

      vi.mocked(analyticsRepository.aggregateByCurrency).mockResolvedValue([]);

      vi.mocked(analyticsRepository.findMedianByCurrency).mockResolvedValue(new Map());

      const response = await request(app).get('/api/v1/analytics/overview').expect(200);

      expect(response.body).toHaveProperty('success', true);

      expect(response.body.data.metrics).toEqual({
        employeeCount: 10,
        salaryRecordCount: 10,
        currencies: 2,
        averageSalaryCents: 100_000_00,
        medianSalaryCents: 95_000_00,
      });

      expect(response.body.meta).toHaveProperty('generatedAt');

      expect(response.body.meta).toHaveProperty('requestId');
    });

    it('accepts analytics filters', async () => {
      vi.mocked(analyticsRepository.countEmployees).mockResolvedValue(0);

      vi.mocked(analyticsRepository.countSalaryRecords).mockResolvedValue(0);

      vi.mocked(analyticsRepository.countCurrencies).mockResolvedValue(0);

      vi.mocked(analyticsRepository.aggregateOverallSalary).mockResolvedValue({
        _avg: {
          amountCents: null,
        },
      });

      vi.mocked(analyticsRepository.findMedianSalary).mockResolvedValue(null);

      vi.mocked(analyticsRepository.aggregateByCurrency).mockResolvedValue([]);

      vi.mocked(analyticsRepository.findMedianByCurrency).mockResolvedValue(new Map());

      const response = await request(app)
        .get(
          '/api/v1/analytics/overview' +
            '?countryCode=US' +
            '&department=Engineering' +
            '&role=Software%20Engineer' +
            '&currency=USD',
        )
        .expect(200);

      expect(response.body.data.filters).toEqual({
        countryCode: 'US',
        department: 'Engineering',
        role: 'Software Engineer',
        currency: 'USD',
      });
    });

    it('rejects invalid country codes', async () => {
      const response = await request(app)
        .get('/api/v1/analytics/overview?countryCode=USA')
        .expect(400);

      expect(response.body).toBeDefined();
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/analytics/distribution', () => {
    it('returns salary distribution', async () => {
      vi.mocked(analyticsRepository.getSalaryRows).mockResolvedValue([
        {
          amountCents: 30_000_00,
        },
        {
          amountCents: 50_000_00,
        },
        {
          amountCents: 70_000_00,
        },
        {
          amountCents: 90_000_00,
        },
        {
          amountCents: 120_000_00,
        },
      ]);

      const response = await request(app).get('/api/v1/analytics/distribution').expect(200);

      expect(response.body).toHaveProperty('success', true);

      expect(response.body.data.totalEmployees).toBe(5);

      expect(response.body.data.buckets).toHaveLength(5);
    });
  });

  describe('GET /api/v1/analytics/countries', () => {
    it('returns country analytics', async () => {
      vi.mocked(analyticsRepository.getCountrySalaryRows).mockResolvedValue([
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
      ]);

      const response = await request(app).get('/api/v1/analytics/countries').expect(200);

      expect(response.body).toHaveProperty('success', true);

      expect(response.body.data.rows[0]).toMatchObject({
        countryCode: 'US',
        countryName: 'United States',
        employeeCount: 1,
      });
    });
  });

  describe('GET /api/v1/analytics/departments', () => {
    it('returns department analytics', async () => {
      vi.mocked(analyticsRepository.getDepartmentSalaryRows).mockResolvedValue([
        {
          amountCents: 100_000_00,
          currency: 'USD',
          employee: {
            department: {
              name: 'Engineering',
            },
          },
        },
      ]);

      const response = await request(app).get('/api/v1/analytics/departments').expect(200);

      expect(response.body).toHaveProperty('success', true);

      expect(response.body.data.rows[0]).toMatchObject({
        department: 'Engineering',
        employeeCount: 1,
      });
    });
  });

  describe('GET /api/v1/analytics/roles', () => {
    it('returns role analytics', async () => {
      vi.mocked(analyticsRepository.getRoleSalaryRows).mockResolvedValue([
        {
          amountCents: 100_000_00,
          currency: 'USD',
          employee: {
            role: {
              name: 'Software Engineer',
            },
          },
        },
      ]);

      const response = await request(app).get('/api/v1/analytics/roles').expect(200);

      expect(response.body).toHaveProperty('success', true);

      expect(response.body.data.rows[0]).toMatchObject({
        role: 'Software Engineer',
        employeeCount: 1,
      });
    });
  });
});
