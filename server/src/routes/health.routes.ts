// server/src/routes/health.routes.ts


import { Router, type Request, type Response } from 'express';

import { APP_NAME } from '../config/constants.js';
import { env } from '../config/env.js';
import { successResponse } from '../lib/response.js';

const router = Router();

const startedAt = Date.now();

router.get('/', (_request: Request, response: Response) => {
  const uptimeSeconds = Math.floor((Date.now() - startedAt) / 1000);

  response.status(200).json(
    successResponse(
      {
        status: 'ok',

        service: APP_NAME,

        environment: env.nodeEnv,

        uptimeSeconds,

        timestamp: new Date().toISOString(),
      },
      {
        requestId: response.getHeader('X-Request-ID')?.toString(),
      },
    ),
  );
});

export default router;

