// server/src/middleware/error-handler.ts


import type { ErrorRequestHandler, Request } from 'express';

import { env } from '../config/env.js';
import { AppError } from '../lib/errors.js';
import { errorResponse } from '../lib/response.js';
import { logger } from '../lib/logger.js';

function getRequestId(request: Request): string | undefined {
  return request.requestId;
}

function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof SyntaxError) {
    return new AppError('The request body contains invalid JSON.', {
      code: 'BAD_REQUEST',
      statusCode: 400,
      cause: error,
    });
  }

  if (error instanceof Error) {
    return new AppError(env.isProduction ? 'An unexpected server error occurred.' : error.message, {
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
      isOperational: false,
      cause: error,
    });
  }

  return new AppError('An unexpected server error occurred.', {
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500,
    isOperational: false,
    cause: error,
  });
}

export const errorHandler: ErrorRequestHandler = (error, request, response, _next) => {
  const normalizedError = normalizeError(error);

  const requestId = getRequestId(request);

  const logPayload = {
    requestId,

    method: request.method,

    path: request.originalUrl,

    statusCode: normalizedError.statusCode,

    errorCode: normalizedError.code,

    err: error instanceof Error ? error : undefined,
  };

  if (normalizedError.statusCode >= 500) {
    logger.error(logPayload, 'Unhandled server error');
  } else {
    logger.warn(logPayload, 'Request failed');
  }

  if (response.headersSent) {
    return;
  }

  const includeDetails = !env.isProduction || normalizedError.statusCode < 500;

  response.status(normalizedError.statusCode).json(
    errorResponse(
      normalizedError.code,
      normalizedError.message,
      includeDetails ? normalizedError.details : undefined,
      {
        requestId,
      },
    ),
  );
};