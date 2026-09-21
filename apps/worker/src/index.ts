import { closeDatabaseConnection } from "./database/client.js";
import { OrderRepository } from "./database/order.repository.js";
import { OrderProcessorService } from "./services/order-processor.service.js";
import { OrderWorker } from "./workers/order.worker.js";
import { SqsConsumer } from "./infrastructure/sqs.consumer.js";
import { logger } from "./infrastructure/logger.js";

const orderRepository = new OrderRepository();

const orderProcessor = new OrderProcessorService(orderRepository);

const orderWorker = new OrderWorker(orderProcessor);

const sqsConsumer = new SqsConsumer((message) => orderWorker.handleMessage(message));

async function shutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal}. Shutting down...`);

  await sqsConsumer.stop();
  await closeDatabaseConnection();

  process.exit(0);
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

async function bootstrap(): Promise<void> {
  logger.info("Starting Order Worker...");

  await sqsConsumer.start();
}

bootstrap().catch(async (error) => {
  logger.error("Worker failed to start", error);

  await closeDatabaseConnection();

  process.exit(1);
});
