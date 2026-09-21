import { integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import type { OrderStatus } from "@orderflow/contracts";

export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
]);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),

  customerName: text("customer_name").notNull(),

  product: text("product").notNull(),

  quantity: integer("quantity").notNull(),

  status: orderStatusEnum("status").$type<OrderStatus>().notNull().default("PENDING"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});
