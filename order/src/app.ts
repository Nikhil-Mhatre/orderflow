/**
 * Express application configuration.
 *
 * This module creates and configures the Express application.
 * The HTTP server is started separately in server.ts.
 */

import express, { type Express, type Request, type Response } from "express";

import { env } from "./config/env.js";

/**
 * Creates the Express application.
 *
 * @returns Configured Express application.
 */
function createApp(): Express {
  const app = express();

  /**
   * Parse incoming JSON request bodies.
   */
  app.use(express.json());

  /**
   * Health check endpoint.
   *
   * This endpoint is used by local development tools, Docker,
   * load balancers, and later Kubernetes health checks.
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

  return app;
}

/**
 * Configured Express application instance.
 */
const app = createApp();

export default app;
