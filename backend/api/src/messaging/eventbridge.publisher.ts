import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

import type { OrderCreatedEvent } from "../events/order-created.js";

import { env } from "../config/env.js";
import type { EventPublisher } from "./event-publisher.js";

// -----------------------------------------------------------------------------
// EventBridge publisher
// -----------------------------------------------------------------------------

/**
 * Publishes application events to Amazon EventBridge.
 *
 * This class is the infrastructure implementation of the EventPublisher
 * interface. Application services should depend on EventPublisher rather than
 * this class directly.
 *
 * EventBridge is used in both development and production environments so that
 * the application's event flow remains consistent across environments.
 */
export class EventBridgePublisher implements EventPublisher {
  private readonly client: EventBridgeClient;

  constructor(
    client: EventBridgeClient = new EventBridgeClient({
      region: env.aws.region,
    }),
  ) {
    this.client = client;
  }

  /**
   * Publishes an OrderCreated event to EventBridge.
   *
   * The event itself is serialized into the EventBridge detail payload.
   */
  async publishOrderCreated(event: OrderCreatedEvent): Promise<void> {
    const command = new PutEventsCommand({
      Entries: [
        {
          EventBusName: env.eventBridge.busName,
          Source: env.eventBridge.source,
          DetailType: event.eventType,
          Detail: JSON.stringify(event),
        },
      ],
    });

    const result = await this.client.send(command);

    const failedEntryCount = result.FailedEntryCount ?? 0;

    if (failedEntryCount > 0) {
      const failedEntry = result.Entries?.find(
        (entry) => entry.ErrorCode || entry.ErrorMessage,
      );

      throw new Error(
        `Failed to publish OrderCreated event to EventBridge: ${
          failedEntry?.ErrorMessage ?? "Unknown EventBridge error"
        }`,
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Shared publisher instance
// -----------------------------------------------------------------------------

/**
 * Shared EventBridge publisher used by the Order API.
 *
 * The underlying AWS client is intentionally reused rather than creating a
 * new client for every published event.
 */
export const eventBridgePublisher = new EventBridgePublisher();
