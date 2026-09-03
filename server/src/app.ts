// server/src/app.ts

import express, { type Express, type NextFunction, type Request, type Response } from 'express';

import helmet from 'helmet';

import { env } from './config/env.js';

import { corsMiddleware } from './middleware/cors.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFoundMiddleware } from './middleware/not-found.js';
import { requestIdMiddleware } from './middleware/request-id.js';

import routes from './routes/index.js';

export function createApp(): Express {
  const app = express();

  /**
   * ---------------------------------------------------------
   * Proxy configuration
   * ---------------------------------------------------------
   *
   * Required when running behind a trusted reverse proxy such
   * as Render, Railway, Fly.io, Nginx, Cloudflare, etc.
   */
  if (env.trustProxy) {
    app.set('trust proxy', true);
  }

  /**
   * ---------------------------------------------------------
   * Basic hardening
   * ---------------------------------------------------------
   */
  app.disable('x-powered-by');

  app.use(
    helmet({
      /**
       * CSP is disabled here because the API may be consumed
       * by different frontend applications/environments.
       *
       * If you later serve HTML from this Express application,
       * enable and configure CSP explicitly.
       */
      contentSecurityPolicy: false,

      /**
       * Allows compatibility with applications that need to
       * embed resources across origins.
       */
      crossOriginEmbedderPolicy: false,
    }),
  );

  /**
   * ---------------------------------------------------------
   * Request ID
   * ---------------------------------------------------------
   */
  app.use(requestIdMiddleware);

  /**
   * ---------------------------------------------------------
   * CORS
   * ---------------------------------------------------------
   */
  app.use(corsMiddleware);

  /**
   * ---------------------------------------------------------
   * Body parsing
   * ---------------------------------------------------------
   */
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

  /**
   * ---------------------------------------------------------
   * Request timeout
   * ---------------------------------------------------------
   *
   * Express' response timeout is used as a safety net.
   *
   * We intentionally do not call next() from the timeout
   * callback after sending a response because that could cause
   * downstream middleware to execute after the request has
   * already been terminated.
   */
  app.use((request: Request, response: Response, next: NextFunction) => {
    response.setTimeout(env.requestTimeoutMs, () => {
      if (response.headersSent || response.writableEnded) {
        return;
      }

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
    });

    next();
  });

  /**
   * ---------------------------------------------------------
   * API routes
   * ---------------------------------------------------------
   */
  app.use('/api/v1', routes);

  /**
   * ---------------------------------------------------------
   * 404 handler
   * ---------------------------------------------------------
   */
  app.use(notFoundMiddleware);

  /**
   * ---------------------------------------------------------
   * Global error handler
   * ---------------------------------------------------------
   *
   * Must be registered after all routes and middleware.
   */
  app.use(errorHandler);

  return app;
}

/**
 * Application instance.
 *
 * Export both named and default versions so consumers can use
 * either:
 *
 *   import { app } from './app.js';
 *
 * or:
 *
 *   import app from './app.js';
 */
export const app = createApp();

export default app;
