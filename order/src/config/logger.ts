/**
 * Application logger.
 *
 * Pino provides structured JSON logging for the application.
 *
 * In development, logs are formatted for readability.
 * In production, logs remain JSON so they can be consumed by
 * log aggregation systems such as CloudWatch.
 */

import pino from "pino";

import { env } from "./env.js";

/**
 * Application logger instance.
 */
export const logger = pino({
  level: env.nodeEnv === "development" ? "debug" : "info",

  base: {
    service: env.service.name,
    version: env.service.version,
    environment: env.nodeEnv,
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  ...(env.nodeEnv === "development"
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      }
    : {}),
});
