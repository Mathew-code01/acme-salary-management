// client/src/lib/logger.ts


// client/src/lib/logger.ts

type LogContext = Record<string, unknown>;

const isDevelopment = import.meta.env.DEV;

function serializeContext(context?: LogContext): string {
  if (!context || Object.keys(context).length === 0) {
    return "";
  }

  try {
    return JSON.stringify(context);
  } catch {
    return "[unserializable-context]";
  }
}

export const logger = {
  debug(message: string, context?: LogContext): void {
    if (!isDevelopment) {
      return;
    }

    console.debug(
      `[ACME] ${message}`,
      serializeContext(context),
    );
  },

  info(message: string, context?: LogContext): void {
    if (!isDevelopment) {
      return;
    }

    console.info(
      `[ACME] ${message}`,
      serializeContext(context),
    );
  },

  warn(message: string, context?: LogContext): void {
    console.warn(
      `[ACME] ${message}`,
      serializeContext(context),
    );
  },

  error(
    message: string,
    error?: unknown,
    context?: LogContext,
  ): void {
    console.error(
      `[ACME] ${message}`,
      {
        error,
        ...context,
      },
    );
  },
};