import "dotenv/config";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",

  dbCredentials: {
    host: process.env.DATABASE_HOST ?? "localhost",
    port: Number(process.env.DATABASE_PORT ?? 5432),
    database: process.env.DATABASE_NAME ?? "orderflow",
    user: process.env.DATABASE_USER ?? "orderflow",
    password: process.env.DATABASE_PASSWORD ?? "",
  },

  strict: true,
  verbose: true,
});
