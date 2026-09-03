// server/src/config/load-env.ts

import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import path from 'node:path';

function findRepositoryRoot(startDirectory: string): string {
  let currentDirectory = path.resolve(startDirectory);

  while (true) {
    const hasPrismaConfig = existsSync(path.join(currentDirectory, 'prisma.config.ts'));

    const hasGitDirectory = existsSync(path.join(currentDirectory, '.git'));

    if (hasPrismaConfig || hasGitDirectory) {
      return currentDirectory;
    }

    const parentDirectory = path.dirname(currentDirectory);

    if (parentDirectory === currentDirectory) {
      return path.resolve(startDirectory);
    }

    currentDirectory = parentDirectory;
  }
}

export const repositoryRoot = findRepositoryRoot(process.cwd());

export const environmentFile = path.join(repositoryRoot, '.env');

const nodeEnvironment = process.env.NODE_ENV?.trim().toLowerCase() ?? 'development';

const shouldOverrideEnvironment = nodeEnvironment !== 'production';

const result = existsSync(environmentFile)
  ? dotenv.config({
      path: environmentFile,
      override: shouldOverrideEnvironment,
    })
  : dotenv.config({
      override: shouldOverrideEnvironment,
    });

if (result.error) {
  throw new Error(`Failed to load environment file "${environmentFile}": ${result.error.message}`);
}
