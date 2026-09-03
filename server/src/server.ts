// server/src/server.ts

import { createServer } from 'node:http';

import { app } from './app.js';
import { env } from './config/env.js';
import { SHUTDOWN_TIMEOUT_MS } from './config/constants.js';
import { logger } from './lib/logger.js';

const httpServer = createServer(app);

let isShuttingDown = false;

function startServer(): void {
  httpServer.once('error', (error) => {
    logger.fatal(
      {
        err: error,
        host: env.host,
        port: env.port,
      },
      'HTTP server failed to start',
    );

    process.exit(1);
  });

  httpServer.listen(env.port, env.host, () => {
    logger.info(
      {
        host: env.host,
        port: env.port,
        environment: env.nodeEnv,
      },
      `API server listening on ${env.host}:${env.port}`,
    );
  });
}

function closeServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!httpServer.listening) {
      resolve();
      return;
    }

    httpServer.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  logger.info({ signal }, 'Shutdown signal received');

  const forceShutdownTimer = setTimeout(() => {
    logger.error('Graceful shutdown timed out; forcing process exit');

    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

  forceShutdownTimer.unref();

  try {
    await closeServer();

    logger.info('HTTP server closed successfully');

    clearTimeout(forceShutdownTimer);

    process.exit(0);
  } catch (error) {
    clearTimeout(forceShutdownTimer);

    logger.error(
      {
        err: error,
      },
      'Failed to shut down cleanly',
    );

    process.exit(1);
  }
}

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('uncaughtException', (error) => {
  logger.fatal(
    {
      err: error,
    },
    'Uncaught exception',
  );

  void shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  logger.fatal(
    {
      reason,
    },
    'Unhandled promise rejection',
  );

  void shutdown('unhandledRejection');
});

startServer();