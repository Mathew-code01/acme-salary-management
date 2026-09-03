// server/src/schemas/employee.schema.ts

import { z } from 'zod';

/**
 * Positive integer query parameter.
 *
 * HTTP query parameters are strings, so z.coerce.number()
 * converts values such as "25" into 25 before the value
 * reaches the application layer.
 */
const positiveInteger = z.coerce.number().int().positive();

/**
 * Optional nullable relation ID.
 */
const optionalRelationId = z
  .union([positiveInteger, z.literal(''), z.null()])
  .optional()
  .transform((value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }

    return value;
  });

/**
 * Employee ID parameter.
 */
export const employeeIdParamSchema = z.object({
  id: positiveInteger,
});

/**
 * Employee list query.
 */
export const employeeListQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .optional()
    .transform((value) => {
      if (!value) {
        return undefined;
      }

      return value.replace(/\s+/g, ' ');
    }),

  countryId: optionalRelationId,

  departmentId: optionalRelationId,

  roleId: optionalRelationId,

  page: positiveInteger.default(1),

  pageSize: positiveInteger.max(100).default(25),

  sortBy: z
    .enum(['id', 'employeeCode', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt'])
    .default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Create employee request.
 */
export const createEmployeeSchema = z.object({
  employeeCode: z.string().trim().min(1).max(50),

  firstName: z.string().trim().min(1).max(100),

  lastName: z.string().trim().min(1).max(100),

  email: z.string().trim().email().max(255),

  countryId: positiveInteger,

  departmentId: positiveInteger,

  roleId: positiveInteger,
});

/**
 * Update employee request.
 */
export const updateEmployeeSchema = z
  .object({
    employeeCode: z.string().trim().min(1).max(50).optional(),

    firstName: z.string().trim().min(1).max(100).optional(),

    lastName: z.string().trim().min(1).max(100).optional(),

    email: z.string().trim().email().max(255).optional(),

    countryId: positiveInteger.optional(),

    departmentId: positiveInteger.optional(),

    roleId: positiveInteger.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one employee field must be provided.',
  });
