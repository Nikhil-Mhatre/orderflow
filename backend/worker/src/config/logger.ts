import pino from "pino";

import { env } from "./env.js";

// Keep log verbosity environment-aware without exposing environment checks
// throughout the application.
const logLevel = env.nodeEnv === "development" ? "debug" : "info";

// Configure Pino once and export a single logger instance for the service.
//
// Application modules should import this logger instead of creating their own
// Pino instances. This keeps formatting, metadata, and log levels consistent.
export const logger = pino({
  level: logLevel,

  // Structured metadata attached to every log entry.
  //
  // These fields make logs easier to filter and correlate in centralized
  // logging systems such as CloudWatch.
  base: {
    service: env.service.name,
    version: env.service.version,
    environment: env.nodeEnv,
  },

  // Use ISO-8601 timestamps so logs are consistent across local development,
  // containers, and production infrastructure.
  timestamp: pino.stdTimeFunctions.isoTime,

  // Pretty output is useful during local development but should not be used
  // in production because structured JSON logs are easier for log platforms
  // to parse and query.
  ...(env.nodeEnv === "development" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  }),
});
