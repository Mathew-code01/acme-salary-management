// server/src/lib/errors.ts

// server/src/lib/errors.ts

export type ErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'INTERNAL_SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE';

export interface AppErrorOptions {
  code?: ErrorCode;
  statusCode?: number;
  details?: unknown;
  isOperational?: boolean;
  cause?: unknown;
}

export class AppError extends Error {
  public readonly code: ErrorCode;

  public readonly statusCode: number;

  public readonly details: unknown;

  public readonly isOperational: boolean;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message);

    this.name = 'AppError';

    this.code = options.code ?? 'INTERNAL_SERVER_ERROR';

    this.statusCode = options.statusCode ?? 500;

    this.details = options.details;

    this.isOperational = options.isOperational ?? true;

    if (options.cause !== undefined) {
      this.cause = options.cause;
    }

    Error.captureStackTrace?.(this, AppError);
  }
}

export class BadRequestError extends AppError {
  constructor(
    message = 'The request is invalid.',
    details?: unknown,
  ) {
    super(message, {
      code: 'BAD_REQUEST',
      statusCode: 400,
      details,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(
    message = 'The requested resource was not found.',
    details?: unknown,
  ) {
    super(message, {
      code: 'NOT_FOUND',
      statusCode: 404,
      details,
    });
  }
}

export class ConflictError extends AppError {
  constructor(
    message = 'The requested operation conflicts with existing data.',
    details?: unknown,
  ) {
    super(message, {
      code: 'CONFLICT',
      statusCode: 409,
      details,
    });
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    message = 'Authentication is required.',
  ) {
    super(message, {
      code: 'UNAUTHORIZED',
      statusCode: 401,
    });
  }
}

export class ForbiddenError extends AppError {
  constructor(
    message = 'You do not have permission to perform this action.',
  ) {
    super(message, {
      code: 'FORBIDDEN',
      statusCode: 403,
    });
  }
}

export class ValidationError extends AppError {
  constructor(
    message = 'The provided data is invalid.',
    details?: unknown,
  ) {
    super(message, {
      code: 'VALIDATION_ERROR',
      statusCode: 422,
      details,
    });
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(
    message = 'The service is temporarily unavailable.',
  ) {
    super(message, {
      code: 'SERVICE_UNAVAILABLE',
      statusCode: 503,
    });
  }
}