// server/tests/unit/salary.service.test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Prisma } from '../../src/generated/prisma/client';

import { salaryService } from '../../src/services/salary.service';

import { salaryRepository } from '../../src/repositories/salary.repository';

import { ConflictError, NotFoundError } from '../../src/lib/errors';

import { salaryFixture, secondSalaryFixture } from '../fixtures/salary.fixture';

vi.mock('../../src/repositories/salary.repository', () => ({
  salaryRepository: {
    list: vi.fn(),
    findById: vi.fn(),
    findByEmployeeId: vi.fn(),
    employeeExists: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('SalaryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('returns paginated salary records', async () => {
      vi.mocked(salaryRepository.list).mockResolvedValue({
        data: [salaryFixture, secondSalaryFixture],
        total: 2,
      });

      const result = await salaryService.list({
        page: 1,
        limit: 10,

        sortBy: 'effectiveFrom',
        sortOrder: 'desc',
      });

      expect(result.data).toHaveLength(2);

      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });

    it('returns zero pages for an empty result', async () => {
      vi.mocked(salaryRepository.list).mockResolvedValue({
        data: [],
        total: 0,
      });

      const result = await salaryService.list({
        page: 1,
        limit: 10,

        sortBy: 'effectiveFrom',
        sortOrder: 'desc',
      });

      expect(result.pagination.totalPages).toBe(0);

      expect(result.pagination.hasNextPage).toBe(false);

      expect(result.pagination.hasPreviousPage).toBe(false);
    });
  });

  describe('getById', () => {
    it('returns a salary record', async () => {
      vi.mocked(salaryRepository.findById).mockResolvedValue(salaryFixture);

      const result = await salaryService.getById(1);

      expect(result).toEqual(salaryFixture);
    });

    it('throws NotFoundError when missing', async () => {
      vi.mocked(salaryRepository.findById).mockResolvedValue(null);

      await expect(salaryService.getById(999)).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('getByEmployeeId', () => {
    it('returns the employee salary', async () => {
      vi.mocked(salaryRepository.findByEmployeeId).mockResolvedValue(salaryFixture);

      const result = await salaryService.getByEmployeeId(1);

      expect(result).toEqual(salaryFixture);
    });

    it('throws when no salary exists', async () => {
      vi.mocked(salaryRepository.findByEmployeeId).mockResolvedValue(null);

      await expect(salaryService.getByEmployeeId(999)).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('create', () => {
    const input = {
      employeeId: 1,

      amountCents: 120_000_00,

      currency: 'USD',

      effectiveFrom: new Date('2026-01-01T00:00:00.000Z'),
    };

    beforeEach(() => {
      vi.mocked(salaryRepository.employeeExists).mockResolvedValue(true);

      vi.mocked(salaryRepository.findByEmployeeId).mockResolvedValue(null);
    });

    it('creates a salary successfully', async () => {
      vi.mocked(salaryRepository.create).mockResolvedValue(salaryFixture);

      const result = await salaryService.create(input);

      expect(result).toEqual(salaryFixture);

      expect(salaryRepository.create).toHaveBeenCalledWith(input);
    });

    it('rejects a missing employee', async () => {
      vi.mocked(salaryRepository.employeeExists).mockResolvedValue(false);

      await expect(salaryService.create(input)).rejects.toBeInstanceOf(NotFoundError);

      expect(salaryRepository.create).not.toHaveBeenCalled();
    });

    it('rejects an existing salary record', async () => {
      vi.mocked(salaryRepository.employeeExists).mockResolvedValue(true);

      vi.mocked(salaryRepository.findByEmployeeId).mockResolvedValue(salaryFixture);

      await expect(salaryService.create(input)).rejects.toBeInstanceOf(ConflictError);

      expect(salaryRepository.create).not.toHaveBeenCalled();
    });

    it('converts Prisma P2002 into ConflictError', async () => {
      vi.mocked(salaryRepository.employeeExists).mockResolvedValue(true);

      vi.mocked(salaryRepository.findByEmployeeId).mockResolvedValue(null);

      const prismaError = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: 'test',
      });

      vi.mocked(salaryRepository.create).mockRejectedValue(prismaError);

      await expect(salaryService.create(input)).rejects.toBeInstanceOf(ConflictError);
    });
  });

  describe('update', () => {
    it('updates an existing salary', async () => {
      vi.mocked(salaryRepository.findById).mockResolvedValue(salaryFixture);

      vi.mocked(salaryRepository.update).mockResolvedValue({
        ...salaryFixture,

        amountCents: 130_000_00,
      });

      const result = await salaryService.update(1, {
        amountCents: 130_000_00,
      });

      expect(result.amountCents).toBe(130_000_00);
    });

    it('converts Prisma P2025 into NotFoundError', async () => {
      vi.mocked(salaryRepository.findById).mockResolvedValue(salaryFixture);

      const prismaError = new Prisma.PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: 'test',
      });

      vi.mocked(salaryRepository.update).mockRejectedValue(prismaError);

      await expect(
        salaryService.update(1, {
          amountCents: 130_000_00,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('delete', () => {
    it('deletes an existing salary', async () => {
      vi.mocked(salaryRepository.findById).mockResolvedValue(salaryFixture);

      vi.mocked(salaryRepository.delete).mockResolvedValue(salaryFixture);

      const result = await salaryService.delete(1);

      expect(result).toEqual({
        success: true,
      });
    });

    it('converts Prisma P2025 into NotFoundError', async () => {
      vi.mocked(salaryRepository.findById).mockResolvedValue(salaryFixture);

      const prismaError = new Prisma.PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: 'test',
      });

      vi.mocked(salaryRepository.delete).mockRejectedValue(prismaError);

      await expect(salaryService.delete(1)).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
