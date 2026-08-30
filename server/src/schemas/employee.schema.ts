// server/src/schemas/employee.schema.ts

import { z } from 'zod';

const employeeCodeSchema = z
  .string()
  .trim()
  .min(2, 'Employee code must contain at least 2 characters.')
  .max(50, 'Employee code must not exceed 50 characters.')
  .regex(
    /^[A-Za-z0-9_-]+$/,
    'Employee code may only contain letters, numbers, underscores, and hyphens.',
  );

const nameSchema = z
  .string()
  .trim()
  .min(1, 'Name is required.')
  .max(100, 'Name must not exceed 100 characters.');

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('A valid email address is required.')
  .max(255, 'Email must not exceed 255 characters.');

const positiveIntegerSchema = z.coerce
  .number()
  .int('Value must be an integer.')
  .positive('Value must be greater than zero.');

export const employeeIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'Employee ID must be a positive integer.')
    .transform(Number)
    .refine((value) => value > 0, {
      message: 'Employee ID must be greater than zero.',
    }),
});

export const employeeListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  pageSize: z.coerce.number().int().min(1).max(100).default(25),

  search: z.string().trim().max(100).optional(),

  countryId: positiveIntegerSchema.optional(),

  departmentId: positiveIntegerSchema.optional(),

  roleId: positiveIntegerSchema.optional(),

  sortBy: z
    .enum(['employeeCode', 'firstName', 'lastName', 'email', 'createdAt'])
    .default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const createEmployeeSchema = z
  .object({
    employeeCode: employeeCodeSchema,

    firstName: nameSchema,

    lastName: nameSchema,

    email: emailSchema,

    countryId: positiveIntegerSchema,

    departmentId: positiveIntegerSchema,

    roleId: positiveIntegerSchema,
  })
  .strict();

export const updateEmployeeSchema = z
  .object({
    employeeCode: employeeCodeSchema.optional(),

    firstName: nameSchema.optional(),

    lastName: nameSchema.optional(),

    email: emailSchema.optional(),

    countryId: positiveIntegerSchema.optional(),

    departmentId: positiveIntegerSchema.optional(),

    roleId: positiveIntegerSchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one employee field must be provided.',
  });

export type EmployeeIdParams = z.infer<typeof employeeIdParamSchema>;

export type EmployeeListQueryInput = z.infer<typeof employeeListQuerySchema>;

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
