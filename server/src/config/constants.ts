// server/src/config/constants.ts

export const APP_NAME = 'ACME Salary Management';

export const API_VERSION = 'v1';

export const API_PREFIX = `/api/${API_VERSION}`;

export const HEALTH_PATH = '/health';

export const DEFAULT_PORT = 5000;

export const DEFAULT_HOST = '127.0.0.1';

export const DEFAULT_LOG_LEVEL = 'info';

export const DEFAULT_BODY_LIMIT = '1mb';

export const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;

export const SHUTDOWN_TIMEOUT_MS = 10_000;

export const REQUEST_ID_HEADER = 'X-Request-ID';

export const NODE_ENVIRONMENTS = ['development', 'test', 'production'] as const;

export type NodeEnvironment = (typeof NODE_ENVIRONMENTS)[number];
