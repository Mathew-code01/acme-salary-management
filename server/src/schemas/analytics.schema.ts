// server/src/schemas/analytics.schema.ts

import { z } from 'zod';

const optionalText = z.string().trim().min(1).max(100).optional();

const currencySchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/)
  .optional();

export const analyticsQuerySchema = z.object({
  countryCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}$/)
    .optional(),

  department: optionalText,

  role: optionalText,

  currency: currencySchema,
});

export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;
