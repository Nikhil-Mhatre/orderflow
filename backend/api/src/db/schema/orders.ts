// order-api/src/db/schema/orders.ts

import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// -----------------------------------------------------------------------------
// Order status
// -----------------------------------------------------------------------------
//
// The order lifecycle is intentionally simple:
//
// PENDING → PROCESSING → COMPLETED
//                    └→ FAILED
//
// The API creates orders in PENDING state. The worker is responsible for
// asynchronous processing and subsequent status updates.
export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
]);

// -----------------------------------------------------------------------------
// Orders table
// -----------------------------------------------------------------------------
//
// This schema represents the PostgreSQL persistence model for orders owned by
// the Order API.
//
// Keep database concerns here. Business operations and application workflows
// belong in the orders module, not in the database schema definition.
export const orders = pgTable("orders", {
  // Public identifier for the order.
  id: uuid("id").defaultRandom().primaryKey(),

  // Customer associated with the order.
  customerName: text("customer_name").notNull(),

  // Product being ordered.
  product: text("product").notNull(),

  // Number of units ordered.
  quantity: integer("quantity").notNull(),

  // Current processing state of the order.
  status: orderStatusEnum("status").notNull().default("PENDING"),

  // Timestamp indicating when the order was created.
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  // Timestamp updated whenever the persisted order state changes.
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});
