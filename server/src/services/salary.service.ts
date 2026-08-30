// server/src/services/salary.service.ts

import { Prisma } from '../generated/prisma/client';

import {
  ConflictError,
  NotFoundError,
} from '../lib/errors';

import { salaryRepository } from '../repositories/salary.repository';

import type {
  CreateSalaryInput,
  SalaryListQuery,
  UpdateSalaryInput,
} from '../types/salary';

export class SalaryService {
  /**
   * Return a paginated list of salary records.
   */
  async list(query: SalaryListQuery) {
    const result = await salaryRepository.list(query);

    const totalPages =
      result.total === 0
        ? 0
        : Math.ceil(result.total / query.limit);

    return {
      data: result.data,

      pagination: {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage:
          query.page > 1 && totalPages > 0,
      },
    };
  }

  /**
   * Find a salary record by its primary key.
   */
  async getById(id: number) {
    const salary = await salaryRepository.findById(id);

    if (!salary) {
      throw new NotFoundError(
        'Salary record not found.',
        {
          resource: 'salary',
          id,
        },
      );
    }

    return salary;
  }

  /**
   * Find a salary record belonging to an employee.
   */
  async getByEmployeeId(employeeId: number) {
    const salary =
      await salaryRepository.findByEmployeeId(employeeId);

    if (!salary) {
      throw new NotFoundError(
        'Salary record not found for this employee.',
        {
          resource: 'salary',
          employeeId,
        },
      );
    }

    return salary;
  }

  /**
   * Create a salary record.
   *
   * The database has a unique constraint on employeeId,
   * so the duplicate check is also protected against
   * concurrent requests by handling Prisma P2002.
   */
  async create(input: CreateSalaryInput) {
    const employeeExists =
      await salaryRepository.employeeExists(
        input.employeeId,
      );

    if (!employeeExists) {
      throw new NotFoundError(
        'Employee not found.',
        {
          resource: 'employee',
          employeeId: input.employeeId,
        },
      );
    }

    const existingSalary =
      await salaryRepository.findByEmployeeId(
        input.employeeId,
      );

    if (existingSalary) {
      throw new ConflictError(
        'This employee already has a salary record.',
        {
          resource: 'salary',
          employeeId: input.employeeId,
        },
      );
    }

    try {
      return await salaryRepository.create(input);
    } catch (error: unknown) {
      if (
        error instanceof
          Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictError(
          'This employee already has a salary record.',
          {
            resource: 'salary',
            employeeId: input.employeeId,
          },
        );
      }

      throw error;
    }
  }

  /**
   * Update an existing salary record.
   */
  async update(
    id: number,
    input: UpdateSalaryInput,
  ) {
    await this.getById(id);

    try {
      return await salaryRepository.update(
        id,
        input,
      );
    } catch (error: unknown) {
      if (
        error instanceof
          Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(
          'Salary record not found.',
          {
            resource: 'salary',
            id,
          },
        );
      }

      throw error;
    }
  }

  /**
   * Delete an existing salary record.
   */
  async delete(id: number) {
    await this.getById(id);

    try {
      await salaryRepository.delete(id);

      return {
        success: true,
      };
    } catch (error: unknown) {
      if (
        error instanceof
          Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(
          'Salary record not found.',
          {
            resource: 'salary',
            id,
          },
        );
      }

      throw error;
    }
  }
}

export const salaryService = new SalaryService();

