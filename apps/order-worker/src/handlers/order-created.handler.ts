import { z } from "zod";

import {
  parseOrderCreatedEvent,
  type OrderCreatedEvent,
} from "@orderflow/contracts";

/**
 * EventBridge wraps the actual domain event inside its `detail` property
 * before delivering the event to SQS.
 *
 * The EventBridge envelope is an infrastructure/transport concern, so
 * it is intentionally handled here rather than added to the shared
 * OrderCreated domain contract.
 */
const eventBridgeEnvelopeSchema = z.object({
  detail: z.unknown(),
});

/**
 * Handles an OrderCreated message received from SQS.
 *
 * Processing flow:
 *
 * SQS message body
 *      ↓
 * JSON.parse()
 *      ↓
 * EventBridge envelope
 *      ↓
 * envelope.detail
 *      ↓
 * OrderCreated contract validation
 *      ↓
 * OrderCreatedEvent
 *
 * Responsibilities:
 * - Parse the raw SQS message body as JSON.
 * - Extract the EventBridge `detail` property.
 * - Validate the detail against the shared OrderCreated contract.
 *
 * This handler does not process the order or access the database.
 * Those responsibilities belong to the service and repository layers.
 */
export class OrderCreatedHandler {
  /**
   * Parse and validate a raw SQS message body.
   *
   * @param messageBody Raw SQS message body.
   * @returns A validated OrderCreatedEvent.
   *
   * @throws Error when the message is invalid JSON, does not contain
   *         an EventBridge detail property, or the detail does not
   *         conform to the OrderCreated contract.
   */
  handle(messageBody: string): OrderCreatedEvent {
    let payload: unknown;

    // SQS provides the message body as a string.
    // Convert it into an unknown JavaScript value first.
    try {
      payload = JSON.parse(messageBody);
    } catch {
      throw new Error("Invalid SQS message: message body is not valid JSON");
    }

    // Validate that the message has the expected EventBridge
    // envelope structure.
    const envelope = eventBridgeEnvelopeSchema.parse(payload);

    // The actual OrderCreated domain event is inside `detail`.
    //
    // The shared contract performs the authoritative runtime
    // validation of the domain event.
    return parseOrderCreatedEvent(envelope.detail);
  }
}
