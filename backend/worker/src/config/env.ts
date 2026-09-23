// Load variables from the local .env file when running the service locally.
//
// In production, environment variables should normally be supplied by the
// container/orchestration environment rather than a committed .env file.
import "dotenv/config";

import { z } from "zod";

// Define and validate the complete environment contract for Order Worker.
//
// Keep this schema limited to configuration that Order Worker actually owns.
// For example, EventBridge configuration belongs to order-api because the API
// publishes events. The worker consumes messages from SQS.
const envSchema = z.object({
  // Application environment.
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // AWS region used by AWS SDK clients.
  AWS_REGION: z.string().trim().min(1).default("ap-south-1"),

  // SQS queue consumed by the Order Worker.
  SQS_QUEUE_URL: z.url().min(1, "SQS_QUEUE_URL is required"),

  // PostgreSQL connection string used by the Order Worker.
  DATABASE_URL: z.url(),

  // Service identity used by structured logging and observability.
  SERVICE_NAME: z.string().trim().min(1).default("orderflow-order-worker"),

  // Application/service version included in structured logs.
  SERVICE_VERSION: z.string().trim().min(1).default("0.0.0"),
});

// Validate the environment once when this module is loaded.
//
// Using safeParse allows us to format configuration errors into a readable
// startup error instead of exposing Zod's raw error structure.
const result = envSchema.safeParse(process.env);

if (!result.success) {
  const formattedErrors = result.error.issues
    .map((issue) => {
      const path = issue.path.join(".");
      return `${path || "environment"}: ${issue.message}`;
    })
    .join("\n");

  throw new Error(
    `Invalid Order Worker environment configuration:\n${formattedErrors}`,
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

  database: {
    url: values.DATABASE_URL,
  },

  aws: {
    region: values.AWS_REGION,
  },

  sqs: {
    queueUrl: values.SQS_QUEUE_URL,
  },

  service: {
    name: values.SERVICE_NAME,
    version: values.SERVICE_VERSION,
  },
} as const;
