// server/src/lib/logger.ts

import pino from 'pino';

import { env } from '../config/env.js';

export const logger = pino({
  level: env.logLevel,

  base: {
    service: env.appName,
    environment: env.nodeEnv,
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  serializers: {
    err: pino.stdSerializers.err,

    req(request) {
      return {
        method: request.method,
        url: request.url,
        requestId: request.id,
      };
    },

    res(response) {
      return {
        statusCode: response.statusCode,
      };
    },
  },
});

export function createRequestLogger(requestId: string) {
  return logger.child({
    requestId,
  });
}