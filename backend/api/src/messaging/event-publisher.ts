import type { OrderCreatedEvent } from "../events/order-created.js";

// -----------------------------------------------------------------------------
// Event publisher contract
// -----------------------------------------------------------------------------

/**
 * Defines the messaging capabilities required by the application.
 *
 * The order module depends on this interface instead of depending directly
 * on AWS EventBridge or any other messaging provider.
 *
 * This keeps application logic independent from the transport implementation.
 */
export interface EventPublisher {
  /**
   * Publishes an OrderCreated event.
   *
   * The implementation is responsible for delivering the event to the
   * configured messaging infrastructure.
   */
  publishOrderCreated(event: OrderCreatedEvent): Promise<void>;
}
