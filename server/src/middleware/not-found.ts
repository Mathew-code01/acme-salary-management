// server/src/middleware/not-found.ts


import type {
  NextFunction,
  Request,
  Response,
} from 'express';

import { NotFoundError } from '../lib/errors.js';

export function notFoundMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction,
): void {
  next(
    new NotFoundError(
      `Route ${request.method} ${request.originalUrl} was not found.`,
    ),
  );
}