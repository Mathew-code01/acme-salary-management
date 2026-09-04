// server/src/repositories/employee.repository.ts

import { prisma } from '../lib/prisma';

import type {
  CreateEmployeeInput,
  EmployeeListQuery,
  UpdateEmployeeInput,
} from '../types/employee';

/**
 * Fields that are safe to expose in employee list responses.
 */
/**
 * Fields that are safe to expose in employee list responses.
 *
 * Relations are selected here because the service layer converts
 * them into the flat shape consumed by the frontend.
 */
const employeeListSelect = {
  id: true,

  employeeCode: true,

  firstName: true,

  lastName: true,

  email: true,

  status: true,

  country: {
    select: {
      id: true,
      code: true,
      name: true,
    },
  },

  department: {
    select: {
      id: true,
      name: true,
    },
  },

  role: {
    select: {
      id: true,
      name: true,
    },
  },

  createdAt: true,

  updatedAt: true,
} as const;

/**
 * Fields returned when working with an individual employee.
 */
const employeeDetailsSelect = {
  ...employeeListSelect,

  salary: {
    select: {
      id: true,
      amountCents: true,
      currency: true,
      effectiveFrom: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} as const;

/**
 * Prisma-supported employee sorting fields.
 *
 * These are deliberately restricted instead of allowing arbitrary
 * query-string values to become Prisma orderBy keys.
 */
const EMPLOYEE_SORT_FIELDS = [
  'id',
  'employeeCode',
  'firstName',
  'lastName',
  'email',
  'createdAt',
  'updatedAt',
] as const;

type EmployeeSortField = (typeof EMPLOYEE_SORT_FIELDS)[number];

type SortOrder = 'asc' | 'desc';

function isEmployeeSortField(
  value: unknown,
): value is EmployeeSortField {
  return (
    typeof value === 'string' &&
    EMPLOYEE_SORT_FIELDS.includes(
      value as EmployeeSortField,
    )
  );
}

function normalizeSortBy(
  value: unknown,
): EmployeeSortField {
  if (isEmployeeSortField(value)) {
    return value;
  }

  return 'createdAt';
}

function normalizeSortOrder(
  value: unknown,
): SortOrder {
  if (
    typeof value === 'string' &&
    value.toLowerCase() === 'asc'
  ) {
    return 'asc';
  }

  return 'desc';
}

/**
 * Converts any value into a safe positive integer.
 *
 * Express query parameters arrive as strings, so values such as
 * "25" must explicitly become the number 25 before being passed
 * to Prisma.
 */
function normalizePositiveInteger(
  value: unknown,
  fallback: number,
  maximum?: number,
): number {
  if (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value > 0
  ) {
    return maximum
      ? Math.min(value, maximum)
      : value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim();

    if (!normalized) {
      return fallback;
    }

    const parsed = Number.parseInt(
      normalized,
      10,
    );

    if (
      Number.isInteger(parsed) &&
      parsed > 0
    ) {
      return maximum
        ? Math.min(parsed, maximum)
        : parsed;
    }
  }

  return fallback;
}

/**
 * Normalizes pagination values before Prisma receives them.
 */
function normalizePagination(query: EmployeeListQuery) {
  const page = normalizePositiveInteger(
    query.page,
    1,
  );

  const pageSize = normalizePositiveInteger(
    query.pageSize,
    25,
    100,
  );

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
  };
}

/**
 * Normalizes optional text search input.
 */
function normalizeSearch(
  value: unknown,
): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value
    .trim()
    .replace(/\s+/g, ' ');

  return normalized || undefined;
}

/**
 * Normalizes optional numeric relation IDs.
 *
 * This provides an additional safety layer in case the controller
 * or validation middleware passes query values as strings.
 */
function normalizeOptionalInteger(
  value: unknown,
): number | undefined {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return undefined;
  }

  if (
    typeof value === 'number' &&
    Number.isInteger(value)
  ) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseInt(
      value.trim(),
      10,
    );

    if (Number.isInteger(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

export class EmployeeRepository {
  /**
   * Find employees using search, filters, pagination,
   * and safe server-side sorting.
   */
  async findMany(query: EmployeeListQuery) {
    const {
      page,
      pageSize,
      skip,
    } = normalizePagination(query);

    const search = normalizeSearch(
      query.search,
    );

    const countryId =
      normalizeOptionalInteger(
        query.countryId,
      );

    const departmentId =
      normalizeOptionalInteger(
        query.departmentId,
      );

    const roleId =
      normalizeOptionalInteger(
        query.roleId,
      );

    const sortBy = normalizeSortBy(
      query.sortBy,
    );

    const sortOrder = normalizeSortOrder(
      query.sortOrder,
    );

    const where = {
      ...(search
        ? {
            OR: [
              {
                firstName: {
                  contains: search,
                },
              },
              {
                lastName: {
                  contains: search,
                },
              },
              {
                email: {
                  contains: search,
                },
              },
              {
                employeeCode: {
                  contains: search,
                },
              },
            ],
          }
        : {}),

      ...(countryId !== undefined
        ? {
            countryId,
          }
        : {}),

      ...(departmentId !== undefined
        ? {
            departmentId,
          }
        : {}),

      ...(roleId !== undefined
        ? {
            roleId,
          }
        : {}),
    };

    const [items, total] =
      await Promise.all([
        prisma.employee.findMany({
          where,

          select: employeeListSelect,

          orderBy: {
            [sortBy]: sortOrder,
          },

          skip,

          take: pageSize,
        }),

        prisma.employee.count({
          where,
        }),
      ]);

    return {
      items,
      total,
      page,
      pageSize,
    };
  }

  /**
   * Find a single employee by primary key.
   */
  async findById(id: number) {
    return prisma.employee.findUnique({
      where: {
        id,
      },

      select: employeeDetailsSelect,
    });
  }

  /**
   * Find an employee using their unique employee code.
   */
  async findByEmployeeCode(
    employeeCode: string,
  ) {
    return prisma.employee.findUnique({
      where: {
        employeeCode,
      },

      select: {
        id: true,
        employeeCode: true,
      },
    });
  }

  /**
   * Find an employee using their unique email.
   */
  async findByEmail(email: string) {
    return prisma.employee.findUnique({
      where: {
        email,
      },

      select: {
        id: true,
        email: true,
      },
    });
  }

  /**
   * Check whether a country exists.
   */
  async countryExists(
    id: number,
  ): Promise<boolean> {
    const country =
      await prisma.country.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
        },
      });

    return country !== null;
  }

  /**
   * Check whether a department exists.
   */
  async departmentExists(
    id: number,
  ): Promise<boolean> {
    const department =
      await prisma.department.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
        },
      });

    return department !== null;
  }

  /**
   * Check whether a role exists.
   */
  async roleExists(
    id: number,
  ): Promise<boolean> {
    const role =
      await prisma.role.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
        },
      });

    return role !== null;
  }

  /**
   * Create an employee.
   */
  async create(
    input: CreateEmployeeInput,
  ) {
    return prisma.employee.create({
      data: {
        employeeCode:
          input.employeeCode,

        firstName:
          input.firstName,

        lastName:
          input.lastName,

        email:
          input.email,

        countryId:
          input.countryId,

        departmentId:
          input.departmentId,

        roleId:
          input.roleId,
      },

      select: employeeDetailsSelect,
    });
  }

  /**
   * Update an employee.
   */
  async update(
    id: number,
    input: UpdateEmployeeInput,
  ) {
    return prisma.employee.update({
      where: {
        id,
      },

      data: input,

      select: employeeDetailsSelect,
    });
  }

  /**
   * Delete an employee.
   */
  async delete(id: number) {
    return prisma.employee.delete({
      where: {
        id,
      },

      select: {
        id: true,
        employeeCode: true,
      },
    });
  }
}

export const employeeRepository =
  new EmployeeRepository();