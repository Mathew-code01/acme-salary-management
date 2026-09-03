// server/src/lib/prisma.ts

import '../config/load-env.js';

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'node:path';
import { existsSync } from 'node:fs';

import { PrismaClient } from '../generated/prisma/client';

const configuredDatabaseUrl = process.env.DATABASE_URL;

if (!configuredDatabaseUrl) {
  throw new Error(
    'DATABASE_URL is not configured. Define DATABASE_URL in the environment before starting the server.',
  );
}

function resolveDatabaseUrl(databaseUrl: string): string {
  const trimmedUrl = databaseUrl.trim();

  if (!trimmedUrl.startsWith('file:')) {
    return trimmedUrl;
  }

  const databasePath = trimmedUrl.slice('file:'.length);

  if (!databasePath) {
    throw new Error('DATABASE_URL contains an empty SQLite database path.');
  }

  if (path.isAbsolute(databasePath)) {
    return trimmedUrl;
  }

  const repositoryRoot =
    process.cwd().endsWith(`${path.sep}server`) ||
    process.cwd().endsWith(`${path.sep}server${path.sep}`)
      ? path.resolve(process.cwd(), '..')
      : process.cwd();

  const absoluteDatabasePath = path.resolve(repositoryRoot, databasePath);

  const databaseDirectory = path.dirname(absoluteDatabasePath);

  if (!existsSync(databaseDirectory)) {
    throw new Error(`SQLite database directory does not exist: ${databaseDirectory}`);
  }

  return `file:${absoluteDatabasePath}`;
}

const databaseUrl = resolveDatabaseUrl(configuredDatabaseUrl);

const adapter = new PrismaBetterSqlite3({
  url: databaseUrl,
});

export const prisma = new PrismaClient({
  adapter,
});

export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}