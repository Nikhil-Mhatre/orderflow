import { z } from "zod";

/**
 * Current schema version for the OrderCreated event.
 *
 * The version is part of the event contract and must be changed deliberately
 * when the event's structure becomes incompatible with existing consumers.
 */
export const ORDER_CREATED_EVENT_VERSION = "1" as const;

/**
 * Event name used across the OrderFlow event-driven architecture.
 */
export const ORDER_CREATED_EVENT_TYPE = "OrderCreated" as const;

/**
 * Runtime schema for the OrderCreated event.
 *
 * This is the contract shared between producers and consumers.
 */
export const orderCreatedEventSchema = z.object({
  eventType: z.literal(ORDER_CREATED_EVENT_TYPE),

  eventVersion: z.literal(ORDER_CREATED_EVENT_VERSION),

  orderId: z.string().min(1),

  timestamp: z.iso.datetime(),
});

/**
 * TypeScript representation of a valid OrderCreated event.
 *
 * The type is inferred from the runtime schema so that the runtime validation
 * and compile-time type cannot drift apart.
 */
export type OrderCreatedEvent = z.infer<typeof orderCreatedEventSchema>;

/**
 * Validate and parse an unknown value as an OrderCreated event.
 *
 * Use this at trust boundaries, particularly when consuming messages from
 * SQS.
 */
export function parseOrderCreatedEvent(value: unknown): OrderCreatedEvent {
  return orderCreatedEventSchema.parse(value);
}
