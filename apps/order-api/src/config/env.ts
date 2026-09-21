// Load variables from the local .env file when running the service locally.
//
// In production, environment variables should normally be supplied by the
// container/orchestration environment rather than a committed .env file.
import "dotenv/config";

import { z } from "zod";

// Define and validate the complete environment contract for Order API.
//
// Keep this schema limited to configuration that Order API actually owns.
// For example, SQS configuration belongs to order-worker because the worker
// is the service that consumes messages from SQS.
const envSchema = z.object({
  // Application environment.
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // HTTP server port.
  //
  // z.coerce.number() converts the string supplied by process.env into
  // a number before validation.
  PORT: z.coerce.number().int().min(1).max(65_535).default(3001),

  // PostgreSQL connection string used by the Order API.
  DATABASE_URL: z.url(),

  // AWS region used by AWS SDK clients.
  AWS_REGION: z.string().trim().min(1).default("ap-south-1"),

  // EventBridge bus to which Order API publishes domain events.
  EVENT_BUS_NAME: z.string().trim().min(1).default("orderflow-dev"),
  EVENTBRIDGE_SOURCE: z
    .string()
    .trim()
    .min(1, "EVENTBRIDGE_SOURCE is required"),

  // Service identity used by structured logging and observability.
  SERVICE_NAME: z.string().trim().min(1).default("orderflow-order-api"),

  // Application/service version included in structured logs.
  SERVICE_VERSION: z.string().trim().min(1).default("0.0.0"),
});

// Validate the environment once when this module is loaded.
//
// Using safeParse allows us to format the configuration errors into a
// readable startup error instead of exposing Zod's raw error structure.
const result = envSchema.safeParse(process.env);

if (!result.success) {
  const formattedErrors = result.error.issues
    .map((issue) => {
      const path = issue.path.join(".");
      return `${path || "environment"}: ${issue.message}`;
    })
    .join("\n");

  throw new Error(
    `Invalid Order API environment configuration:\n${formattedErrors}`,
  );
}

// From this point onward, the application can safely consume validated
// configuration instead of accessing process.env directly.
const values = result.data;

// Export a structured configuration object.
//
// Keeping environment variables behind this object prevents process.env
// access from spreading throughout the application.
export const env = {
  nodeEnv: values.NODE_ENV,

  port: values.PORT,

  database: {
    url: values.DATABASE_URL,
  },

  aws: {
    region: values.AWS_REGION,
  },

  eventBridge: {
    busName: values.EVENT_BUS_NAME,
    source: values.EVENTBRIDGE_SOURCE,
  },

  service: {
    name: values.SERVICE_NAME,
    version: values.SERVICE_VERSION,
  },
} as const;
