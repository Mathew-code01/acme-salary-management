// server/src/app.ts

import express from 'express';
import helmet from 'helmet';

import { env } from './config/env.js';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFoundMiddleware } from './middleware/not-found.js';
import { requestIdMiddleware } from './middleware/request-id.js';
import routes from './routes/index.js';

export function createApp() {
  const app = express();

  if (env.trustProxy) {
    app.set('trust proxy', true);
  }

  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.use(requestIdMiddleware);

  app.use(corsMiddleware);

  app.use(
    express.json({
      limit: env.bodyLimit,

      strict: true,
    }),
  );

  app.use(
    express.urlencoded({
      extended: false,

      limit: env.bodyLimit,
    }),
  );

  app.use((request, response, next) => {
    response.setTimeout(env.requestTimeoutMs, () => {
      if (!response.headersSent) {
        response.status(408).json({
          success: false,
          error: {
            code: 'REQUEST_TIMEOUT',
            message: 'The request timed out.',
          },
          meta: {
            requestId: request.requestId,
          },
        });
      }

      next();
    });

    next();
  });

  app.use(routes);

  app.use(notFoundMiddleware);

  app.use(errorHandler);

  return app;
}

export const app = createApp();