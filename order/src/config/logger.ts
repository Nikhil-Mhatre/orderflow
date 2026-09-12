/**
 * Minimal application logger.
 *
 * This is intentionally small for the initial project foundation.
 * A structured logger can be introduced later.
 */

/**
 * Logs an informational message.
 *
 * @param message - Message to log.
 * @param metadata - Optional additional structured data.
 */
export function logInfo(message: string, metadata?: Record<string, unknown>): void {
  console.log(
    JSON.stringify({
      level: "info",
      message,
      timestamp: new Date().toISOString(),
      ...metadata,
    }),
  );
}

/**
 * Logs an error message.
 *
 * @param message - Error description.
 * @param error - Optional error object or additional metadata.
 */
export function logError(message: string, error?: unknown): void {
  console.error(
    JSON.stringify({
      level: "error",
      message,
      timestamp: new Date().toISOString(),
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
    }),
  );
}
