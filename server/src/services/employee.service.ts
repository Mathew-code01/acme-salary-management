// server/src/services/employee.service.ts

import { ConflictError, NotFoundError } from '../lib/errors';

import { employeeRepository } from '../repositories/employee.repository';

import type {
  CreateEmployeeInput,
  EmployeeListQuery,
  UpdateEmployeeInput,
} from '../types/employee';

export class EmployeeService {
  /**
   * List employees with their organizational relationships
   * flattened into the API contract expected by the frontend.
   */
  async list(query: EmployeeListQuery) {
    const { items, total } = await employeeRepository.findMany(query);

    const totalPages = total === 0 ? 0 : Math.ceil(total / query.pageSize);

    return {
      items: items.map((employee) => ({
        id: employee.id,

        employeeCode: employee.employeeCode,

        firstName: employee.firstName,

        lastName: employee.lastName,

        fullName: `${employee.firstName} ${employee.lastName}`,

        email: employee.email,

        status: employee.status,

        countryId: employee.country.id,

        countryName: employee.country.name,

        departmentId: employee.department.id,

        departmentName: employee.department.name,

        roleId: employee.role.id,

        roleName: employee.role.name,

        createdAt: employee.createdAt,

        updatedAt: employee.updatedAt,
      })),

      pagination: {
        page: query.page,

        pageSize: query.pageSize,

        total,

        totalPages,

        hasNextPage: query.page < totalPages,

        hasPreviousPage: query.page > 1 && totalPages > 0,
      },
    };
  }

  /**
   * Get a single employee with full relational data.
   */
  async getById(id: number) {
    const employee = await employeeRepository.findById(id);

    if (!employee) {
      throw new NotFoundError(`Employee with ID ${id} was not found.`);
    }

    return {
      ...employee,

      fullName: `${employee.firstName} ${employee.lastName}`,
    };
  }

  /**
   * Create an employee.
   */
  async create(input: CreateEmployeeInput) {
    const [existingCode, existingEmail, countryExists, departmentExists, roleExists] =
      await Promise.all([
        employeeRepository.findByEmployeeCode(input.employeeCode),

        employeeRepository.findByEmail(input.email),

        employeeRepository.countryExists(input.countryId),

        employeeRepository.departmentExists(input.departmentId),

        employeeRepository.roleExists(input.roleId),
      ]);

    if (existingCode) {
      throw new ConflictError('An employee with this employee code already exists.', {
        field: 'employeeCode',
        value: input.employeeCode,
      });
    }

    if (existingEmail) {
      throw new ConflictError('An employee with this email already exists.', {
        field: 'email',
        value: input.email,
      });
    }

    if (!countryExists) {
      throw new NotFoundError(`Country with ID ${input.countryId} was not found.`);
    }

    if (!departmentExists) {
      throw new NotFoundError(`Department with ID ${input.departmentId} was not found.`);
    }

    if (!roleExists) {
      throw new NotFoundError(`Role with ID ${input.roleId} was not found.`);
    }

    const employee = await employeeRepository.create(input);

    return {
      ...employee,

      fullName: `${employee.firstName} ${employee.lastName}`,
    };
  }

  /**
   * Update an employee.
   */
  async update(id: number, input: UpdateEmployeeInput) {
    const existing = await employeeRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Employee with ID ${id} was not found.`);
    }

    if (input.employeeCode !== undefined) {
      const existingCode = await employeeRepository.findByEmployeeCode(input.employeeCode);

      if (existingCode && existingCode.id !== id) {
        throw new ConflictError('An employee with this employee code already exists.', {
          field: 'employeeCode',
          value: input.employeeCode,
        });
      }
    }

    if (input.email !== undefined) {
      const existingEmail = await employeeRepository.findByEmail(input.email);

      if (existingEmail && existingEmail.id !== id) {
        throw new ConflictError('An employee with this email already exists.', {
          field: 'email',
          value: input.email,
        });
      }
    }

    if (input.countryId !== undefined) {
      const exists = await employeeRepository.countryExists(input.countryId);

      if (!exists) {
        throw new NotFoundError(`Country with ID ${input.countryId} was not found.`);
      }
    }

    if (input.departmentId !== undefined) {
      const exists = await employeeRepository.departmentExists(input.departmentId);

      if (!exists) {
        throw new NotFoundError(`Department with ID ${input.departmentId} was not found.`);
      }
    }

    if (input.roleId !== undefined) {
      const exists = await employeeRepository.roleExists(input.roleId);

      if (!exists) {
        throw new NotFoundError(`Role with ID ${input.roleId} was not found.`);
      }
    }

    const employee = await employeeRepository.update(id, input);

    return {
      ...employee,

      fullName: `${employee.firstName} ${employee.lastName}`,
    };
  }

  /**
   * Delete an employee.
   */
  async delete(id: number) {
    const existing = await employeeRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Employee with ID ${id} was not found.`);
    }

    return employeeRepository.delete(id);
  }
}

export const employeeService = new EmployeeService();