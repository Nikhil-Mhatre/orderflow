// src/infrastructure/sqs.consumer.ts

import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
  type Message,
} from "@aws-sdk/client-sqs";

import { env } from "../config/env.js";
import { logger } from "./logger.js";

export type MessageHandler = (message: Message) => Promise<void>;

export class SqsConsumer {
  private readonly sqsClient: SQSClient;
  private readonly queueUrl: string;
  private readonly maxMessages: number;
  private readonly visibilityTimeout: number;

  private isRunning = false;

  constructor(private readonly handler: MessageHandler) {
    this.sqsClient = new SQSClient({
      region: env.AWS_REGION,
    });

    this.queueUrl = env.SQS_QUEUE_URL;
    this.maxMessages = env.WORKER_MAX_MESSAGES;
    this.visibilityTimeout = env.WORKER_VISIBILITY_TIMEOUT_SECONDS;
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn("SQS consumer is already running");
      return;
    }

    this.isRunning = true;

    logger.info(
      {
        queueUrl: this.queueUrl,
      },
      "SQS consumer started",
    );

    while (this.isRunning) {
      try {
        await this.poll();
      } catch (error) {
        logger.error(
          {
            err: error,
          },
          "SQS polling failed",
        );

        if (this.isRunning) {
          await this.sleep(env.WORKER_POLL_INTERVAL_MS);
        }
      }
    }

    logger.info("SQS consumer stopped");
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    logger.info("Stopping SQS consumer...");

    this.isRunning = false;

    this.sqsClient.destroy();
  }

  private async poll(): Promise<void> {
    const command = new ReceiveMessageCommand({
      QueueUrl: this.queueUrl,

      MaxNumberOfMessages: this.maxMessages,

      VisibilityTimeout: this.visibilityTimeout,

      WaitTimeSeconds: 5,

      MessageAttributeNames: ["All"],

      MessageSystemAttributeNames: ["ApproximateReceiveCount"],
    });

    const response = await this.sqsClient.send(command);

    const messages = response.Messages ?? [];

    if (messages.length === 0) {
      return;
    }

    logger.info(
      {
        messageCount: messages.length,
      },
      "Messages received",
    );

    await Promise.all(messages.map((message) => this.processMessage(message)));
  }

  private async processMessage(message: Message): Promise<void> {
    const messageId = message.MessageId ?? "unknown";

    const receiveCount = message.Attributes?.ApproximateReceiveCount;

    const attempt = receiveCount ? Number(receiveCount) : 1;

    const orderId = this.getOrderId(message);

    const messageLogger = logger.child({
      messageId,
      orderId,
      attempt,
    });

    try {
      messageLogger.info("Processing message");

      await this.handler(message);

      await this.deleteMessage(message);

      messageLogger.info("Successfully processed message");
    } catch (error) {
      messageLogger.error({ err: error }, "Failed to process message");

      /*
       * Do NOT delete the message when processing fails.
       *
       * SQS will make the message visible again after the
       * visibility timeout and retry it.
       *
       * After the configured maximum receive count, SQS
       * moves the message to the DLQ.
       */
    }
  }

  private getOrderId(message: Message): string {
    if (!message.Body) {
      return "unknown";
    }

    try {
      const event = JSON.parse(message.Body);

      return typeof event.orderId === "string" ? event.orderId : "unknown";
    } catch {
      return "unknown";
    }
  }

  private async deleteMessage(message: Message): Promise<void> {
    if (!message.ReceiptHandle) {
      throw new Error(`Cannot delete message ${message.MessageId}: missing ReceiptHandle`);
    }

    const command = new DeleteMessageCommand({
      QueueUrl: this.queueUrl,
      ReceiptHandle: message.ReceiptHandle,
    });

    await this.sqsClient.send(command);
  }

  private sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
}
