import "dotenv/config";

/**
 * Application environment configuration.
 *
 * This module reads environment variables, validates required values,
 * applies safe defaults for local development, and exposes a typed
 * configuration object to the rest of the application.
 */

/**
 * Converts an environment variable into a number.
 *
 * @param value - The environment variable value.
 * @param fallback - The value to use when the variable is undefined.
 * @returns The parsed number.
 *
 * @throws {Error} If the value is defined but is not a valid number.
 */
function parseNumber(value: string | undefined, fallback: number): number {
  if (value === undefined || value.trim() === "") {
    return fallback;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    throw new Error(`Invalid numeric environment variable: "${value}"`);
  }

  return parsedValue;
}

/**
 * Reads a required environment variable.
 *
 * @param name - The name of the environment variable.
 * @returns The environment variable value.
 *
 * @throws {Error} If the environment variable is missing or empty.
 */
function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (value === undefined || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

/**
 * Application configuration loaded from environment variables.
 */
export const env = {
  /**
   * Current application environment.
   */
  nodeEnv: process.env.NODE_ENV ?? "development",

  /**
   * HTTP port used by the Order API.
   */
  port: parseNumber(process.env.PORT, 3000),

  /**
   * PostgreSQL connection settings.
   */
  database: {
    url: getRequiredEnv("DATABASE_URL"),
  },

  /**
   * AWS region used by AWS SDK clients.
   */
  aws: {
    region: process.env.AWS_REGION ?? "ap-south-1",
  },

  /**
   * EventBridge event bus name.
   */
  eventBusName: process.env.EVENT_BUS_NAME ?? "orderflow",

  /**
   * Service metadata used for logging and observability.
   */
  service: {
    name: process.env.SERVICE_NAME ?? "orderflow-order-api",
    version: process.env.SERVICE_VERSION ?? "0.1.0",
  },
} as const;
