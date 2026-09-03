import { environmentFile, repositoryRoot } from './load-env.js';

import {
  DEFAULT_BODY_LIMIT,
  DEFAULT_HOST,
  DEFAULT_LOG_LEVEL,
  DEFAULT_PORT,
  DEFAULT_REQUEST_TIMEOUT_MS,
  NODE_ENVIRONMENTS,
  type NodeEnvironment,
} from './constants.js';

function getString(value: string | undefined, fallback?: string): string {
  const normalized = value?.trim();

  if (normalized) {
    return normalized;
  }

  if (fallback !== undefined) {
    return fallback;
  }

  return '';
}

function getRequiredString(value: string | undefined, name: string): string {
  const normalized = value?.trim();

  if (!normalized) {
    throw new Error(`${name} is required. Define ${name} in "${environmentFile}".`);
  }

  return normalized;
}

function getNumber(value: string | undefined, fallback: number, name: string): number {
  if (!value?.trim()) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${name} must be a valid number. Received: "${value}".`);
  }

  return parsed;
}

function getBoolean(value: string | undefined, fallback: boolean, name: string): boolean {
  if (!value?.trim()) {
    return fallback;
  }

  switch (value.trim().toLowerCase()) {
    case 'true':
    case '1':
    case 'yes':
      return true;

    case 'false':
    case '0':
    case 'no':
      return false;

    default:
      throw new Error(`${name} must be true/false, 1/0, or yes/no. Received: "${value}".`);
  }
}

function getNodeEnvironment(): NodeEnvironment {
  const value = process.env.NODE_ENV?.trim().toLowerCase();

  if (!value) {
    return 'development';
  }

  if (NODE_ENVIRONMENTS.includes(value as NodeEnvironment)) {
    return value as NodeEnvironment;
  }

  throw new Error(
    `NODE_ENV must be one of: ${NODE_ENVIRONMENTS.join(', ')}. Received: "${value}".`,
  );
}

function getCorsOrigins(): string[] {
  const value = process.env.CORS_ORIGINS?.trim();

  if (!value) {
    return ['http://127.0.0.1:5173', 'http://localhost:5173'];
  }

  const origins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error('CORS_ORIGINS must contain at least one valid origin.');
  }

  return [...new Set(origins)];
}

const environment = getNodeEnvironment();

const port = getNumber(process.env.PORT, DEFAULT_PORT, 'PORT');

if (port < 1 || port > 65_535) {
  throw new Error(`PORT must be between 1 and 65535. Received: ${port}.`);
}

const requestTimeoutMs = getNumber(
  process.env.REQUEST_TIMEOUT_MS,
  DEFAULT_REQUEST_TIMEOUT_MS,
  'REQUEST_TIMEOUT_MS',
);

if (requestTimeoutMs <= 0) {
  throw new Error(`REQUEST_TIMEOUT_MS must be greater than 0. Received: ${requestTimeoutMs}.`);
}

const bodyLimit = getString(process.env.BODY_LIMIT, DEFAULT_BODY_LIMIT);

if (!bodyLimit) {
  throw new Error('BODY_LIMIT must not be empty.');
}

const clientUrl = getString(process.env.CLIENT_URL, 'http://127.0.0.1:5173');

const databaseUrl = getRequiredString(process.env.DATABASE_URL, 'DATABASE_URL');

export const env = Object.freeze({
  nodeEnv: environment,

  isDevelopment: environment === 'development',

  isTest: environment === 'test',

  isProduction: environment === 'production',

  appName: getString(process.env.APP_NAME, 'ACME Salary Management'),

  host: getString(process.env.HOST, DEFAULT_HOST),

  port,

  logLevel: getString(process.env.LOG_LEVEL, DEFAULT_LOG_LEVEL),

  corsOrigins: getCorsOrigins(),

  bodyLimit,

  requestTimeoutMs,

  trustProxy: getBoolean(process.env.TRUST_PROXY, false, 'TRUST_PROXY'),

  clientUrl,

  databaseUrl,

  repositoryRoot,

  environmentFile,
});

export type AppEnvironment = typeof env;
