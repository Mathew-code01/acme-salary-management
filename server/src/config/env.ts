// server/src/config/env.ts


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

function getNumber(value: string | undefined, fallback: number): number {
  if (!value?.trim()) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return parsed;
}

function getBoolean(value: string | undefined, fallback: boolean): boolean {
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
      return fallback;
  }
}

function getNodeEnvironment(): NodeEnvironment {
  const value = process.env.NODE_ENV?.trim().toLowerCase();

  if (value && NODE_ENVIRONMENTS.includes(value as NodeEnvironment)) {
    return value as NodeEnvironment;
  }

  return 'development';
}

function getCorsOrigins(): string[] {
  const value = process.env.CORS_ORIGINS?.trim();

  if (!value) {
    return ['http://localhost:5173'];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const environment = getNodeEnvironment();

export const env = Object.freeze({
  nodeEnv: environment,

  isDevelopment: environment === 'development',

  isTest: environment === 'test',

  isProduction: environment === 'production',

  appName: getString(process.env.APP_NAME, 'ACME Salary Management'),

  host: getString(process.env.HOST, DEFAULT_HOST),

  port: getNumber(process.env.PORT, DEFAULT_PORT),

  logLevel: getString(process.env.LOG_LEVEL, DEFAULT_LOG_LEVEL),

  corsOrigins: getCorsOrigins(),

  bodyLimit: getString(process.env.BODY_LIMIT, DEFAULT_BODY_LIMIT),

  requestTimeoutMs: getNumber(process.env.REQUEST_TIMEOUT_MS, DEFAULT_REQUEST_TIMEOUT_MS),

  trustProxy: getBoolean(process.env.TRUST_PROXY, false),

  clientUrl: getString(process.env.CLIENT_URL, 'http://localhost:5173'),
});