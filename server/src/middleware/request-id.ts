// server/src/middleware/request-id.ts

import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

import { REQUEST_ID_HEADER } from '../config/constants.js';

declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

export function requestIdMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const incomingRequestId = request.get(REQUEST_ID_HEADER)?.trim();

  const requestId = incomingRequestId || randomUUID();

  request.requestId = requestId;

  response.setHeader(REQUEST_ID_HEADER, requestId);

  next();
}