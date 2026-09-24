/**
 * Handles requests that do not match any registered route.
 */

import type { NextFunction, Request, Response } from "express";

import { AppError } from "../lib/errors/app.error.js";

/**
 * Express middleware for unmatched routes.
 *
 * @param request - Incoming HTTP request.
 * @param _response - HTTP response.
 * @param next - Express middleware continuation function.
 */
export function notFoundMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction,
): void {
  next(
    new AppError(
      `Route not found: ${request.method} ${request.originalUrl}`,
      404,
    ),
  );
}
