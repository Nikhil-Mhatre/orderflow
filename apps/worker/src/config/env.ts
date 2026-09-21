// src/config/env.ts

import "dotenv/config";

interface Env {
  NODE_ENV: "development" | "test" | "production";

  AWS_REGION: string;
  SQS_QUEUE_URL: string;

  DATABASE_URL: string;

  WORKER_POLL_INTERVAL_MS: number;
  WORKER_VISIBILITY_TIMEOUT_SECONDS: number;
  WORKER_MAX_MESSAGES: number;

  SERVICE_NAME: string;
  SERVICE_VERSION: string;
}

function required(name: string): string {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function numberValue(name: string, defaultValue?: number): number {
  const value = process.env[name];

  if (value === undefined || value.trim() === "") {
    if (defaultValue !== undefined) {
      return defaultValue;
    }

    throw new Error(`Missing required environment variable: ${name}`);
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid number`);
  }

  return parsed;
}

function nodeEnv(): Env["NODE_ENV"] {
  const value = process.env.NODE_ENV ?? "development";

  if (!["development", "test", "production"].includes(value)) {
    throw new Error(`NODE_ENV must be development, test, or production`);
  }

  return value as Env["NODE_ENV"];
}

export const env: Env = {
  NODE_ENV: nodeEnv(),

  AWS_REGION: required("AWS_REGION"),
  SQS_QUEUE_URL: required("SQS_QUEUE_URL"),

  DATABASE_URL: required("DATABASE_URL"),

  WORKER_POLL_INTERVAL_MS: numberValue("WORKER_POLL_INTERVAL_MS", 1000),

  WORKER_VISIBILITY_TIMEOUT_SECONDS: numberValue("WORKER_VISIBILITY_TIMEOUT_SECONDS", 30),

  WORKER_MAX_MESSAGES: numberValue("WORKER_MAX_MESSAGES", 10),

  SERVICE_NAME: required("SERVICE_NAME"),
  SERVICE_VERSION: required("SERVICE_VERSION"),
};
