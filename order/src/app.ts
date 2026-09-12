/**
 * Express application configuration.
 *
 * This module creates and configures the Express application.
 * The HTTP server is started separately in server.ts.
 */

import express, { type Express, type Request, type Response } from "express";
import { pinoHttp } from "pino-http";

import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/not-found.middleware.js";

/**
 * Creates the Express application.
 *
 * @returns Configured Express application.
 */
function createApp(): Express {
  const app = express();

  /**
   * Register HTTP request logging first so that every request
   * receives a request ID and is included in the logs.
   */
  app.use(
    pinoHttp({
      logger,
      autoLogging: true,
    }),
  );

  /**
   * Parse incoming JSON request bodies.
   */
  app.use(express.json());

  /**
   * Health check endpoint.
   */
  app.get("/health", (_request: Request, response: Response): void => {
    response.status(200).json({
      status: "ok",
      service: env.service.name,
      version: env.service.version,
      environment: env.nodeEnv,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * Handle requests that did not match any route.
   *
   * This must be registered after all application routes.
   */
  app.use(notFoundMiddleware);

  /**
   * Global error handler.
   *
   * This must be the final middleware in the application.
   */
  app.use(errorMiddleware);

  return app;
}

/**
 * Configured Express application instance.
 */
const app = createApp();

export default app;
