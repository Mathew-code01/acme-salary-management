// server/src/schemas/salary.schema.ts

import { z } from 'zod';

import { SALARY_SORT_FIELDS, SORT_DIRECTIONS } from '../types/salary';

const currencySchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/, {
    message: 'Currency must be a valid 3-letter ISO-style currency code.',
  });

const positiveIntegerSchema = z.number().int().positive();

const nonNegativeIntegerSchema = z.number().int().nonnegative();

const dateSchema = z.coerce.date();

export const salaryIdParamSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict();

export const salaryEmployeeIdParamSchema = z
  .object({
    employeeId: z.coerce.number().int().positive(),
  })
  .strict();

export const createSalarySchema = z
  .object({
    employeeId: positiveIntegerSchema,

    amountCents: nonNegativeIntegerSchema,

    currency: currencySchema,

    effectiveFrom: dateSchema,
  })
  .strict()
  .superRefine((value, context) => {
    if (value.amountCents === 0) {
      context.addIssue({
        code: 'custom',
        path: ['amountCents'],
        message: 'Salary amount must be greater than zero.',
      });
    }

    if (value.effectiveFrom.getTime() > Date.now()) {
      context.addIssue({
        code: 'custom',
        path: ['effectiveFrom'],
        message: 'Effective date cannot be in the future.',
      });
    }
  });

export const updateSalarySchema = z
  .object({
    amountCents: nonNegativeIntegerSchema.optional(),

    currency: currencySchema.optional(),

    effectiveFrom: dateSchema.optional(),
  })
  .strict()
  .refine(
    (value) =>
      value.amountCents !== undefined ||
      value.currency !== undefined ||
      value.effectiveFrom !== undefined,
    {
      message: 'At least one salary field must be provided.',
    },
  )
  .superRefine((value, context) => {
    if (value.amountCents !== undefined && value.amountCents === 0) {
      context.addIssue({
        code: 'custom',
        path: ['amountCents'],
        message: 'Salary amount must be greater than zero.',
      });
    }

    if (value.effectiveFrom !== undefined && value.effectiveFrom.getTime() > Date.now()) {
      context.addIssue({
        code: 'custom',
        path: ['effectiveFrom'],
        message: 'Effective date cannot be in the future.',
      });
    }
  });

export const salaryListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(25),

    employeeId: z.coerce.number().int().positive().optional(),

    currency: currencySchema.optional(),

    minAmountCents: nonNegativeIntegerSchema.optional(),

    maxAmountCents: nonNegativeIntegerSchema.optional(),

    effectiveFrom: dateSchema.optional(),

    effectiveTo: dateSchema.optional(),

    search: z.string().trim().min(1).max(100).optional(),

    sortBy: z.enum(SALARY_SORT_FIELDS).default('effectiveFrom'),

    sortOrder: z.enum(SORT_DIRECTIONS).default('desc'),
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.minAmountCents !== undefined &&
      value.maxAmountCents !== undefined &&
      value.minAmountCents > value.maxAmountCents
    ) {
      context.addIssue({
        code: 'custom',
        path: ['minAmountCents'],
        message: 'Minimum salary cannot be greater than maximum salary.',
      });
    }

    if (
      value.effectiveFrom !== undefined &&
      value.effectiveTo !== undefined &&
      value.effectiveFrom > value.effectiveTo
    ) {
      context.addIssue({
        code: 'custom',
        path: ['effectiveFrom'],
        message: 'Effective-from date cannot be later than effective-to date.',
      });
    }
  });

export const salarySchemas = {
  params: salaryIdParamSchema,
  create: createSalarySchema,
  update: updateSalarySchema,
  list: salaryListQuerySchema,
  employeeParams: salaryEmployeeIdParamSchema,
};
