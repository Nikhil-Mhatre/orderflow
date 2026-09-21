/**
 * Worker service logger.
 *
 * Pino provides structured JSON logging for the worker service.
 *
 * In development, logs are formatted for readability.
 * In production, logs remain JSON so they can be consumed by
 * log aggregation systems such as CloudWatch.
 */

import pino from "pino";

import { env } from "../config/env.js";

/**
 * Worker logger instance.
 */
export const logger = pino({
  level: env.NODE_ENV === "development" ? "debug" : "info",

  base: {
    service: env.SERVICE_NAME,
    version: env.SERVICE_VERSION,
    environment: env.NODE_ENV,
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  ...(env.NODE_ENV === "development"
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
