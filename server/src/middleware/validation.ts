
// server/src/middleware/validation.ts

import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

import { ValidationError } from '../lib/errors';

interface RequestSchemas {
  params?: ZodType;
  query?: ZodType;
  body?: ZodType;
}

/**
 * Validates incoming Express request data with Zod schemas.
 *
 * Validation is performed before the request reaches the controller.
 *
 * Supported request sections:
 * - params
 * - query
 * - body
 *
 * Parsed values are written back onto the existing Express request
 * objects instead of replacing req.params / req.query. This avoids
 * incompatibilities between Zod's inferred `unknown` output and
 * Express's ParamsDictionary / ParsedQs types.
 */
export function validate(
  schemas: RequestSchemas,
): RequestHandler {
  return (req, _res, next) => {
    try {
      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);

        if (!result.success) {
          throw new ValidationError(
            'Invalid route parameters.',
            result.error.flatten(),
          );
        }

        Object.assign(req.params, result.data);
      }

      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);

        if (!result.success) {
          throw new ValidationError(
            'Invalid query parameters.',
            result.error.flatten(),
          );
        }

        Object.assign(req.query, result.data);
      }

      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);

        if (!result.success) {
          throw new ValidationError(
            'Invalid request body.',
            result.error.flatten(),
          );
        }

        req.body = result.data;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
