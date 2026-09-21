/**
 * Global Express error-handling middleware.
 *
 * This middleware:
 *
 * 1. Logs the error using Pino.
 * 2. Determines the appropriate HTTP status code.
 * 3. Prevents internal error details from leaking to clients.
 * 4. Returns a consistent error response.
 */

import type { ErrorRequestHandler } from "express";

import { AppError } from "../errors/app.error.js";
import { logger } from "../config/logger.js";

/**
 * Global application error handler.
 *
 * Express identifies an error-handling middleware by its
 * four parameters: error, request, response, and next.
 */
export const errorMiddleware: ErrorRequestHandler = (error, request, response, _next): void => {
  /**
   * Handle expected application errors.
   */
  if (error instanceof AppError) {
    logger.warn(
      {
        err: error,
        method: request.method,
        url: request.originalUrl,
        statusCode: error.statusCode,
        requestId: request.id,
      },
      "Application error",
    );

    response.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });

    return;
  }

  /**
   * Handle unexpected errors.
   *
   * Do not send the original error message to the client.
   * It may contain database details, filesystem paths,
   * credentials, SQL statements, or other internal information.
   */
  logger.error(
    {
      err: error,
      method: request.method,
      url: request.originalUrl,
      requestId: request.id,
    },
    "Unhandled application error",
  );

  response.status(500).json({
    error: {
      message: "Internal server error",
    },
  });
};
