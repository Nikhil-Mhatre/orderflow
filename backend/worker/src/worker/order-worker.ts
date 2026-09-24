import type { Message } from "@aws-sdk/client-sqs";

import { OrderCreatedHandler } from "../orders/order-created.handler.js";
import { OrderProcessingService } from "../orders/order-processing.service.js";
import { logger } from "../config/logger.js";
import type { SqsClient } from "../infrastructure/aws/sqs.client.js";

/**
 * Background worker responsible for consuming OrderCreated
 * events from SQS.
 *
 * Worker lifecycle:
 *
 * start()
 *   ↓
 * poll SQS
 *   ↓
 * process message
 *   ↓
 * delete successful message
 *
 * During shutdown:
 *
 * stop()
 *   ↓
 * stop polling for new messages
 *   ↓
 * finish the current poll
 *   ↓
 * return from start()
 */
export class OrderWorker {
  private isRunning = false;

  constructor(
    private readonly sqsClient: SqsClient,
    private readonly orderCreatedHandler: OrderCreatedHandler,
    private readonly orderProcessingService: OrderProcessingService,
  ) {}

  /**
   * Start the SQS polling loop.
   *
   * This method resolves when stop() has been called and
   * the current polling operation has completed.
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    logger.debug("Order Worker started");

    while (this.isRunning) {
      try {
        await this.poll();
      } catch (error) {
        // A polling error should not immediately terminate the worker.
        //
        // Wait briefly and then attempt to poll again.
        logger.error(
          {
            err: error,
          },
          "SQS polling failed",
        );

        if (this.isRunning) {
          await this.delay(5_000);
        }
      }
    }

    logger.debug("Order Worker stopped");
  }

  /**
   * Request a graceful shutdown.
   *
   * This does not forcibly terminate the current operation.
   * It prevents the worker from starting another polling cycle.
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    logger.debug("Stopping Order Worker");

    this.isRunning = false;
  }

  /**
   * Receive and process one batch of SQS messages.
   */
  private async poll(): Promise<void> {
    const messages = await this.sqsClient.receiveMessages();

    if (messages.length === 0) {
      return;
    }

    for (const message of messages) {
      await this.processMessage(message);
    }
  }

  /**
   * Process a single SQS message.
   *
   * The message is deleted only after the complete order-processing
   * workflow succeeds.
   */
  private async processMessage(message: Message): Promise<void> {
    if (!message.Body) {
      logger.error("Received SQS message without a body");
      return;
    }

    if (!message.ReceiptHandle) {
      logger.error("Received SQS message without a receipt handle");
      return;
    }

    try {
      // Parse and validate the raw SQS message.
      const event = this.orderCreatedHandler.handle(message.Body);

      logger.debug(
        {
          orderId: event.orderId,
          eventType: event.eventType,
          eventVersion: event.eventVersion,
        },
        "Processing OrderCreated event",
      );

      // Execute the actual order-processing workflow.
      await this.orderProcessingService.process(event);

      // Delete the message only after successful processing.
      await this.sqsClient.deleteMessage(message.ReceiptHandle);

      logger.debug(
        {
          orderId: event.orderId,
        },
        "Order processed successfully",
      );
    } catch (error) {
      logger.error({ err: error }, "Failed to process SQS message");

      // IMPORTANT:
      //
      // Do not delete the message when processing fails.
      //
      // SQS will make the message visible again after the visibility
      // timeout and its retry/DLQ policy can take effect.
    }
  }

  /**
   * Pause execution for the specified duration.
   */
  private async delay(milliseconds: number): Promise<void> {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
}
