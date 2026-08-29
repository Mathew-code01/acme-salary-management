// server/src/middleware/cors.ts


import cors from 'cors';

import { env } from '../config/env.js';

export const corsMiddleware = cors({
  origin(origin, callback) {
    // Allow server-to-server requests and tools that don't send Origin.
    if (!origin) {
      callback(null, true);
      return;
    }

    if (env.corsOrigins.includes('*')) {
      callback(null, true);
      return;
    }

    if (env.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS policy rejected origin: ${origin}`));
  },

  credentials: true,

  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],

  exposedHeaders: ['X-Request-ID'],

  maxAge: 86400,
});