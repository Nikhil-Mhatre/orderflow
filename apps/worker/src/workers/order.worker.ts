import type { Message } from "@aws-sdk/client-sqs";

import { isOrderCreatedEvent, type OrderCreatedEvent } from "@orderflow/contracts";
import { logger } from "../infrastructure/logger.js";
import { OrderProcessorService } from "../services/order-processor.service.js";

export class OrderWorker {
  constructor(private readonly orderProcessor: OrderProcessorService) {}

  async handleMessage(message: Message): Promise<void> {
    const messageId = message.MessageId ?? "unknown";

    if (!message.Body) {
      logger.error(
        {
          messageId,
        },
        "SQS message has no body",
      );

      throw new Error(`SQS message ${messageId} has no body`);
    }

    let payload: unknown;

    try {
      payload = JSON.parse(message.Body);
    } catch (error) {
      logger.error(
        {
          err: error,
          messageId,
        },
        "Invalid JSON in SQS message",
      );

      throw new Error(`Invalid JSON in SQS message ${messageId}`);
    }

    if (!isOrderCreatedEvent(payload)) {
      logger.error(
        {
          messageId,
        },
        "Invalid OrderCreated event",
      );

      throw new Error(`Invalid OrderCreated event in message ${messageId}`);
    }

    const event: OrderCreatedEvent = payload;

    logger.info(
      {
        messageId,
        orderId: event.orderId,
      },
      "Received OrderCreated event",
    );

    await this.orderProcessor.process(event.orderId);
  }
}
