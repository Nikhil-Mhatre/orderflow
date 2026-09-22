import { SqsClient } from "./clients/sqs.client.js";
import { OrderCreatedHandler } from "./handlers/order-created.handler.js";
import { PostgresOrderRepository } from "./repositories/order.repository.js";
import { OrderProcessingService } from "./services/order-processing.service.js";
import { OrderWorker } from "./worker/order-worker.js";

import { pool } from "./db/client.db.js";
import { connectToDatabase } from "./db/connection.db.js";
import { createShutdownHandler } from "./db/shutdown.db.js";
import { logger } from "./config/logger.js";

/**
 * Application entry point.
 *
 * Startup lifecycle:
 *
 * PostgreSQL connection
 *        ↓
 * Application dependencies
 *        ↓
 * Order Worker
 *        ↓
 * SQS polling
 */
async function main(): Promise<void> {
  // Verify PostgreSQL connectivity before starting the worker.
  await connectToDatabase();

  // The database pool is owned by db/client.ts and shared by
  // repositories throughout the worker process.
  const orderRepository = new PostgresOrderRepository(pool);

  const orderProcessingService = new OrderProcessingService(orderRepository);

  const sqsClient = new SqsClient();

  const orderCreatedHandler = new OrderCreatedHandler();

  const orderWorker = new OrderWorker(
    sqsClient,
    orderCreatedHandler,
    orderProcessingService,
  );

  // Register graceful shutdown before starting the worker.
  const shutdown = createShutdownHandler(orderWorker);

  process.on("SIGTERM", () => {
    shutdown("SIGTERM");
  });

  process.on("SIGINT", () => {
    shutdown("SIGINT");
  });

  // Start the background SQS consumer.
  await orderWorker.start();
}

main().catch((error: unknown) => {
  logger.error(
    {
      err: error,
    },
    "Order Worker failed to start",
  );

  process.exit(1);
});
