// server/tests/unit/employee.service.test.ts

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { employeeService } from '../../src/services/employee.service';

import { employeeRepository } from '../../src/repositories/employee.repository';

import {
  ConflictError,
  NotFoundError,
} from '../../src/lib/errors';

import {
  employeeFixture,
  secondEmployeeFixture,
} from '../fixtures/employee.fixture';

vi.mock('../../src/repositories/employee.repository', () => ({
  employeeRepository: {
    findMany: vi.fn(),
    findById: vi.fn(),
    findByEmployeeCode: vi.fn(),
    findByEmail: vi.fn(),
    countryExists: vi.fn(),
    departmentExists: vi.fn(),
    roleExists: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('EmployeeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('returns employees with fullName and pagination metadata', async () => {
      vi.mocked(employeeRepository.findMany).mockResolvedValue({
        items: [
          employeeFixture,
          secondEmployeeFixture,
        ],
        total: 2,
      });

      const result = await employeeService.list({
        page: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(result.items).toHaveLength(2);

      expect(result.items[0]?.fullName)
        .toBe('John Doe');

      expect(result.items[1]?.fullName)
        .toBe('Jane Smith');

      expect(result.pagination).toEqual({
        page: 1,
        pageSize: 10,
        total: 2,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      expect(
        employeeRepository.findMany,
      ).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
    });

    it('returns zero pages when there are no employees', async () => {
      vi.mocked(employeeRepository.findMany).mockResolvedValue({
        items: [],
        total: 0,
      });

      const result = await employeeService.list({
        page: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(result.pagination.totalPages)
        .toBe(0);

      expect(result.pagination.hasNextPage)
        .toBe(false);

      expect(result.pagination.hasPreviousPage)
        .toBe(false);
    });
  });

  describe('getById', () => {
    it('returns an employee with fullName', async () => {
      vi.mocked(employeeRepository.findById)
        .mockResolvedValue(employeeFixture);

      const result =
        await employeeService.getById(1);

      expect(result.id).toBe(1);

      expect(result.fullName)
        .toBe('John Doe');
    });

    it('throws NotFoundError when employee does not exist', async () => {
      vi.mocked(employeeRepository.findById)
        .mockResolvedValue(null);

      await expect(
        employeeService.getById(999),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('create', () => {
    const input = {
      employeeCode: 'EMP-0001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      countryId: 1,
      departmentId: 1,
      roleId: 1,
    };

    beforeEach(() => {
      vi.mocked(employeeRepository.findByEmployeeCode)
        .mockResolvedValue(null);

      vi.mocked(employeeRepository.findByEmail)
        .mockResolvedValue(null);

      vi.mocked(employeeRepository.countryExists)
        .mockResolvedValue(true);

      vi.mocked(employeeRepository.departmentExists)
        .mockResolvedValue(true);

      vi.mocked(employeeRepository.roleExists)
        .mockResolvedValue(true);
    });

    it('creates an employee successfully', async () => {
      vi.mocked(employeeRepository.create)
        .mockResolvedValue(employeeFixture);

      const result =
        await employeeService.create(input);

      expect(result.fullName)
        .toBe('John Doe');

      expect(
        employeeRepository.create,
      ).toHaveBeenCalledWith(input);
    });

    it('rejects duplicate employee codes', async () => {
      vi.mocked(employeeRepository.findByEmployeeCode)
        .mockResolvedValue(employeeFixture);

      await expect(
        employeeService.create(input),
      ).rejects.toBeInstanceOf(ConflictError);

      expect(
        employeeRepository.create,
      ).not.toHaveBeenCalled();
    });

    it('rejects duplicate emails', async () => {
      vi.mocked(employeeRepository.findByEmail)
        .mockResolvedValue(employeeFixture);

      await expect(
        employeeService.create(input),
      ).rejects.toBeInstanceOf(ConflictError);

      expect(
        employeeRepository.create,
      ).not.toHaveBeenCalled();
    });

    it('rejects a missing country', async () => {
      vi.mocked(employeeRepository.countryExists)
        .mockResolvedValue(false);

      await expect(
        employeeService.create(input),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it('rejects a missing department', async () => {
      vi.mocked(employeeRepository.departmentExists)
        .mockResolvedValue(false);

      await expect(
        employeeService.create(input),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it('rejects a missing role', async () => {
      vi.mocked(employeeRepository.roleExists)
        .mockResolvedValue(false);

      await expect(
        employeeService.create(input),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('update', () => {
    it('updates an employee successfully', async () => {
      vi.mocked(employeeRepository.findById)
        .mockResolvedValue(employeeFixture);

      vi.mocked(employeeRepository.update)
        .mockResolvedValue({
          ...employeeFixture,
          firstName: 'Updated',
        });

      const result =
        await employeeService.update(1, {
          firstName: 'Updated',
        });

      expect(result.fullName)
        .toBe('Updated Doe');

      expect(
        employeeRepository.update,
      ).toHaveBeenCalledWith(1, {
        firstName: 'Updated',
      });
    });

    it('throws when employee does not exist', async () => {
      vi.mocked(employeeRepository.findById)
        .mockResolvedValue(null);

      await expect(
        employeeService.update(999, {
          firstName: 'Updated',
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it('rejects an employee-code conflict', async () => {
      vi.mocked(employeeRepository.findById)
        .mockResolvedValue(employeeFixture);

      vi.mocked(
        employeeRepository.findByEmployeeCode,
      ).mockResolvedValue(secondEmployeeFixture);

      await expect(
        employeeService.update(1, {
          employeeCode: 'EMP-0002',
        }),
      ).rejects.toBeInstanceOf(ConflictError);

      expect(
        employeeRepository.update,
      ).not.toHaveBeenCalled();
    });

    it('rejects an email conflict', async () => {
      vi.mocked(employeeRepository.findById)
        .mockResolvedValue(employeeFixture);

      vi.mocked(employeeRepository.findByEmail)
        .mockResolvedValue(secondEmployeeFixture);

      await expect(
        employeeService.update(1, {
          email: 'jane.smith@example.com',
        }),
      ).rejects.toBeInstanceOf(ConflictError);
    });
  });

  describe('delete', () => {
    it('deletes an existing employee', async () => {
      vi.mocked(employeeRepository.findById)
        .mockResolvedValue(employeeFixture);

      vi.mocked(employeeRepository.delete)
        .mockResolvedValue(employeeFixture);

      const result =
        await employeeService.delete(1);

      expect(result).toEqual(employeeFixture);

      expect(
        employeeRepository.delete,
      ).toHaveBeenCalledWith(1);
    });

    it('throws when deleting a missing employee', async () => {
      vi.mocked(employeeRepository.findById)
        .mockResolvedValue(null);

      await expect(
        employeeService.delete(999),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});