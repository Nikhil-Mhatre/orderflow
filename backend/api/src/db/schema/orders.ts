import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { products } from "./products.js";

// -----------------------------------------------------------------------------
// Order status
// -----------------------------------------------------------------------------

export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
]);

// -----------------------------------------------------------------------------
// Orders
// -----------------------------------------------------------------------------

export const orders = pgTable("orders", {
  /**
   * Unique order identifier.
   */
  id: uuid("id").defaultRandom().primaryKey(),

  /**
   * Customer who placed the order.
   */
  customerName: text("customer_name").notNull(),

  /**
   * Authoritative total amount for the order.
   *
   * Stored in the smallest currency unit.
   *
   * Example:
   * $2,897.00 = 289700
   */
  totalAmount: integer("total_amount").notNull(),

  /**
   * Current order-processing state.
   */
  status: orderStatusEnum("status").notNull().default("PENDING"),

  /**
   * Order creation timestamp.
   */
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  /**
   * Last order update timestamp.
   */
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

// -----------------------------------------------------------------------------
// Order items
// -----------------------------------------------------------------------------

export const orderItems = pgTable("order_items", {
  /**
   * Unique identifier for the individual order item.
   */
  id: uuid("id").defaultRandom().primaryKey(),

  /**
   * Parent order.
   *
   * Deleting an order also deletes its items.
   */
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, {
      onDelete: "cascade",
    }),

  /**
   * Product that was ordered.
   */
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),

  /**
   * Snapshot of the product name at purchase time.
   */
  productName: text("product_name").notNull(),

  /**
   * Number of units purchased.
   */
  quantity: integer("quantity").notNull(),

  /**
   * Snapshot of the product price at purchase time.
   *
   * This protects historical orders if the product price changes later.
   */
  unitPrice: integer("unit_price").notNull(),
});
