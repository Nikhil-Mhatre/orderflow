/**
 * HTTP server entry point.
 *
 * This module starts the Express application and listens
 * for incoming HTTP requests.
 */

import app from "./app.js";
import { env } from "./config/env.js";

/**
 * Start the Order API HTTP server.
 */
const server = app.listen(env.port, () => {
  console.log(`${env.service.name} is running on http://localhost:${env.port}`);
});

/**
 * Handle graceful shutdown when the process receives
 * a termination signal.
 */
function shutdown(signal: string): void {
  console.log(`${signal} received. Shutting down server...`);

  server.close((error?: Error) => {
    if (error) {
      console.error("Error while shutting down the server:", error);
      process.exitCode = 1;
      return;
    }

    console.log("HTTP server closed successfully.");
  });
}

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});
