// server/src/repositories/employee.repository.ts

import { prisma } from '../lib/prisma';

import type {
  CreateEmployeeInput,
  EmployeeListQuery,
  UpdateEmployeeInput,
} from '../types/employee';

const employeeListSelect = {
  id: true,
  employeeCode: true,
  firstName: true,
  lastName: true,
  email: true,

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

export class EmployeeRepository {
  async findMany(query: EmployeeListQuery) {
    const { page, pageSize, search, countryId, departmentId, roleId, sortBy, sortOrder } = query;

    const skip = (page - 1) * pageSize;

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

    const [items, total] = await Promise.all([
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
    };
  }

  async findById(id: number) {
    return prisma.employee.findUnique({
      where: {
        id,
      },

      select: employeeDetailsSelect,
    });
  }

  async findByEmployeeCode(employeeCode: string) {
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

  async countryExists(id: number): Promise<boolean> {
    const country = await prisma.country.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
      },
    });

    return country !== null;
  }

  async departmentExists(id: number): Promise<boolean> {
    const department = await prisma.department.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
      },
    });

    return department !== null;
  }

  async roleExists(id: number): Promise<boolean> {
    const role = await prisma.role.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
      },
    });

    return role !== null;
  }

  async create(input: CreateEmployeeInput) {
    return prisma.employee.create({
      data: {
        employeeCode: input.employeeCode,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        countryId: input.countryId,
        departmentId: input.departmentId,
        roleId: input.roleId,
      },

      select: employeeDetailsSelect,
    });
  }

  async update(id: number, input: UpdateEmployeeInput) {
    return prisma.employee.update({
      where: {
        id,
      },

      data: input,

      select: employeeDetailsSelect,
    });
  }

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

export const employeeRepository = new EmployeeRepository();
