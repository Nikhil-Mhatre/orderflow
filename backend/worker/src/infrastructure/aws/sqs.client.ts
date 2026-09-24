import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
  type Message,
} from "@aws-sdk/client-sqs";

import { env } from "../../config/env.js";

/**
 * Small wrapper around AWS SQS.
 *
 * The worker uses this class to:
 * - receive messages from the order queue
 * - delete messages after successful processing
 *
 * Keeping AWS code here means the rest of the worker does not
 * need to know how the AWS SDK works.
 */
export class SqsClient {
  private readonly client: SQSClient;

  constructor() {
    this.client = new SQSClient({
      region: env.aws.region,
    });
  }

  /**
   * Receive messages from the order queue.
   *
   * We use long polling so SQS waits for messages instead of
   * making the worker repeatedly ask an empty queue.
   */
  async receiveMessages(): Promise<Message[]> {
    const command = new ReceiveMessageCommand({
      QueueUrl: env.sqs.queueUrl,

      // Process several messages in one worker cycle.
      MaxNumberOfMessages: 10,

      // Wait up to 20 seconds when the queue is empty.
      WaitTimeSeconds: 20,

      // Keep the message hidden while the worker processes it.
      VisibilityTimeout: 30,

      // The worker needs the receipt handle to delete the message.
      AttributeNames: ["All"],
    });

    const response = await this.client.send(command);

    return response.Messages ?? [];
  }

  /**
   * Delete a message after it has been processed successfully.
   *
   * If processing fails, the worker should NOT call this method.
   * SQS can then make the message visible again after the
   * visibility timeout.
   */
  async deleteMessage(receiptHandle: string): Promise<void> {
    const command = new DeleteMessageCommand({
      QueueUrl: env.sqs.queueUrl,
      ReceiptHandle: receiptHandle,
    });

    await this.client.send(command);
  }
}
