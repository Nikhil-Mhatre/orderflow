import {
  ORDER_CREATED_EVENT_TYPE,
  ORDER_CREATED_EVENT_VERSION,
  type OrderCreatedEvent,
} from "../../events/order-created.js";

// -----------------------------------------------------------------------------
// OrderCreated event input
// -----------------------------------------------------------------------------

/**
 * Values owned by the Order API when creating an OrderCreated event.
 *
 * The event timestamp is optional so callers can provide a deterministic
 * timestamp when needed, particularly in tests.
 */
export interface CreateOrderCreatedEventInput {
  orderId: string;
  timestamp?: Date;
}

// -----------------------------------------------------------------------------
// OrderCreated event factory
// -----------------------------------------------------------------------------

/**
 * Creates the canonical OrderCreated event.
 *
 * This function is responsible only for constructing the event payload.
 * Transport concerns such as EventBridge, SQS, or AWS SDK clients do not belong
 * here.
 *
 * The resulting object conforms to the shared @orderflow/contracts definition.
 */
export function createOrderCreatedEvent({
  orderId,
  timestamp = new Date(),
}: CreateOrderCreatedEventInput): OrderCreatedEvent {
  return {
    eventType: ORDER_CREATED_EVENT_TYPE,
    eventVersion: ORDER_CREATED_EVENT_VERSION,
    orderId,
    timestamp: timestamp.toISOString(),
  };
}
