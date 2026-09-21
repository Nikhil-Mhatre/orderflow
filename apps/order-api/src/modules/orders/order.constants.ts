/**
 * Order domain constants.
 *
 * This module contains stable values that define the Order domain.
 *
 * Keep domain-level constants here instead of scattering string literals
 * throughout controllers, services, repositories, and database code.
 */

/**
 * Lifecycle states supported by an order.
 *
 * Order lifecycle:
 *
 * PENDING
 *   ↓
 * PROCESSING
 *   ↓
 * COMPLETED
 *
 * A processing failure can transition the order to FAILED.
 */
export const ORDER_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

/**
 * Union type representing every valid order status.
 *
 * `as const` on ORDER_STATUS keeps these values as string literals rather
 * than widening them to `string`.
 */
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
