// server/src/lib/response.ts

export interface ApiMeta {
  requestId?: string;
  [key: string]: unknown;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: ApiMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: ApiMeta;
}

export function successResponse<T>(data: T, meta?: ApiMeta): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    ...(meta ? { meta } : {}),
  };
}

export function errorResponse(
  code: string,
  message: string,
  details?: unknown,
  meta?: ApiMeta,
): ApiErrorResponse {
  return {
    success: false,

    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },

    ...(meta ? { meta } : {}),
  };
}