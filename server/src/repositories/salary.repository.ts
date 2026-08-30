// server/src/repositories/salary.repository.ts

import type { Prisma } from '../generated/prisma/client';

import { prisma } from '../lib/prisma';

import type { CreateSalaryInput, SalaryListQuery, UpdateSalaryInput } from '../types/salary';

const salaryInclude = {
  employee: {
    select: {
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
    },
  },
} satisfies Prisma.SalaryInclude;

export class SalaryRepository {
  async findById(id: number) {
    return prisma.salary.findUnique({
      where: {
        id,
      },
      include: salaryInclude,
    });
  }

  async findByEmployeeId(employeeId: number) {
    return prisma.salary.findUnique({
      where: {
        employeeId,
      },
      include: salaryInclude,
    });
  }

  async create(input: CreateSalaryInput) {
    return prisma.salary.create({
      data: {
        employeeId: input.employeeId,
        amountCents: input.amountCents,
        currency: input.currency,
        effectiveFrom: input.effectiveFrom,
      },
      include: salaryInclude,
    });
  }

  async update(id: number, input: UpdateSalaryInput) {
    return prisma.salary.update({
      where: {
        id,
      },
      data: {
        ...(input.amountCents !== undefined && {
          amountCents: input.amountCents,
        }),

        ...(input.currency !== undefined && {
          currency: input.currency,
        }),

        ...(input.effectiveFrom !== undefined && {
          effectiveFrom: input.effectiveFrom,
        }),
      },
      include: salaryInclude,
    });
  }

  async delete(id: number) {
    return prisma.salary.delete({
      where: {
        id,
      },
    });
  }

  async employeeExists(employeeId: number): Promise<boolean> {
    const employee = await prisma.employee.findUnique({
      where: {
        id: employeeId,
      },
      select: {
        id: true,
      },
    });

    return employee !== null;
  }

  async list(query: SalaryListQuery) {
    const where: Prisma.SalaryWhereInput = {};

    if (query.employeeId !== undefined) {
      where.employeeId = query.employeeId;
    }

    if (query.currency !== undefined) {
      where.currency = query.currency;
    }

    if (query.minAmountCents !== undefined || query.maxAmountCents !== undefined) {
      where.amountCents = {
        ...(query.minAmountCents !== undefined && {
          gte: query.minAmountCents,
        }),

        ...(query.maxAmountCents !== undefined && {
          lte: query.maxAmountCents,
        }),
      };
    }

    if (query.effectiveFrom !== undefined || query.effectiveTo !== undefined) {
      where.effectiveFrom = {
        ...(query.effectiveFrom !== undefined && {
          gte: query.effectiveFrom,
        }),

        ...(query.effectiveTo !== undefined && {
          lte: query.effectiveTo,
        }),
      };
    }

    if (query.search) {
      where.employee = {
        OR: [
          {
            employeeCode: {
              contains: query.search,
            },
          },
          {
            firstName: {
              contains: query.search,
            },
          },
          {
            lastName: {
              contains: query.search,
            },
          },
          {
            email: {
              contains: query.search,
            },
          },
        ],
      };
    }

    const skip = (query.page - 1) * query.limit;

    const orderBy = {
      [query.sortBy]: query.sortOrder,
    } as Prisma.SalaryOrderByWithRelationInput;

    const [data, total] = await prisma.$transaction([
      prisma.salary.findMany({
        where,
        skip,
        take: query.limit,
        orderBy,
        include: salaryInclude,
      }),

      prisma.salary.count({
        where,
      }),
    ]);

    return {
      data,
      total,
    };
  }
}

export const salaryRepository = new SalaryRepository();
