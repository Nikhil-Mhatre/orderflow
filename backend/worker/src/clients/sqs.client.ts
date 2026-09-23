import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
  type Message,
} from "@aws-sdk/client-sqs";

import { env } from "../config/env.js";

/**
 * AWS SQS client wrapper used by the Order Worker.
 *
 * This class isolates AWS SDK-specific code from the rest of
 * the worker application.
 */
export class SqsClient {
  private readonly client: SQSClient;

  constructor() {
    this.client = new SQSClient({
      region: env.aws.region,
    });
  }

  /**
   * Receive messages from the Order Worker SQS queue.
   *
   * Long polling is used to reduce unnecessary requests when
   * the queue is empty.
   *
   * @returns Messages received from SQS.
   */
  async receiveMessages(): Promise<Message[]> {
    const command = new ReceiveMessageCommand({
      QueueUrl: env.sqs.queueUrl,

      // Receive up to 10 messages in one request.
      MaxNumberOfMessages: 10,

      // Wait for messages instead of continuously polling an
      // empty queue.
      WaitTimeSeconds: 20,

      // Make the message invisible while the worker processes it.
      // This value should eventually be aligned with the expected
      // processing time and SQS visibility-timeout configuration.
      VisibilityTimeout: 30,

      // We need the receipt handle to delete a successfully
      // processed message.
      AttributeNames: ["All"],
    });

    const response = await this.client.send(command);

    return response.Messages ?? [];
  }

  /**
   * Delete a successfully processed message from the queue.
   *
   * A message should only be deleted after the order-processing
   * workflow has completed successfully.
   *
   * @param receiptHandle - Receipt handle returned by SQS.
   */
  async deleteMessage(receiptHandle: string): Promise<void> {
    const command = new DeleteMessageCommand({
      QueueUrl: env.sqs.queueUrl,
      ReceiptHandle: receiptHandle,
    });

    await this.client.send(command);
  }
}
