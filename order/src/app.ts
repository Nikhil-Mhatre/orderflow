import express from "express";
import { pinoHttp } from "pino-http";

import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/not-found.middleware.js";
import orderRoutes from "./routes/order.routes.js";

/**
 * Creates and configures the Express application.
 *
 * This function only builds the application instance.
 * It does not:
 * - open a database connection;
 * - start listening on a port;
 * - execute business logic;
 * - manage process shutdown.
 *
 * Those responsibilities belong to server.ts and the relevant
 * service or lifecycle modules.
 */
function createApp(): express.Express {
  const app = express();

  /*
   * --------------------------------------------------------------------------
   * 1. Request logging
   * --------------------------------------------------------------------------
   *
   * pino-http creates a request-scoped logger and records HTTP request
   * information such as:
   * - HTTP method;
   * - request URL;
   * - response status code;
   * - response duration;
   * - request ID.
   *
   * It also makes request.log available inside route handlers and middleware.
   */
  app.use(
    pinoHttp({
      logger,
      autoLogging: true,
    }),
  );

  /*
   * --------------------------------------------------------------------------
   * 2. Request body parsing
   * --------------------------------------------------------------------------
   *
   * This middleware parses JSON request bodies and makes the parsed object
   * available through request.body.
   *
   * The size limit prevents unnecessarily large JSON payloads from reaching
   * the application. The value can be adjusted as the API evolves.
   */
  app.use(
    express.json({
      limit: "1mb",
    }),
  );

  /*
   * --------------------------------------------------------------------------
   * 3. Basic service health endpoint
   * --------------------------------------------------------------------------
   *
   * This endpoint confirms that the HTTP application is running.
   *
   * It does not verify PostgreSQL or other dependencies. That distinction is
   * useful for Kubernetes and load-balancer health checks:
   *
   * - liveness: Is the process responding?
   * - readiness: Can the process safely receive traffic?
   *
   * A separate readiness endpoint can be added later to check dependencies.
   */
  app.get("/health", (_request, response) => {
    response.status(200).json({
      status: "ok",
      service: env.service.name,
      version: env.service.version,
      environment: env.nodeEnv,
      timestamp: new Date().toISOString(),
    });
  });

  /*
   * --------------------------------------------------------------------------
   * 4. API routes
   * --------------------------------------------------------------------------
   *
   * Order-related endpoints are grouped in order.routes.ts.
   *
   * Keeping route definitions in a separate module prevents app.ts from
   * becoming a large file as more resources are introduced.
   */
  app.use(orderRoutes);

  /*
   * --------------------------------------------------------------------------
   * 5. Not-found middleware
   * --------------------------------------------------------------------------
   *
   * Express reaches this middleware only when no previous route matched
   * the incoming request.
   *
   * It must be registered after all valid routes.
   */
  app.use(notFoundMiddleware);

  /*
   * --------------------------------------------------------------------------
   * 6. Centralized error middleware
   * --------------------------------------------------------------------------
   *
   * This must be the final middleware in the chain.
   *
   * It converts application errors into HTTP responses and prevents internal
   * error details from being exposed to clients.
   */
  app.use(errorMiddleware);

  return app;
}

/**
 * Export a fully configured Express application.
 *
 * server.ts imports this application and decides when to call app.listen().
 */
const app = createApp();

export default app;
