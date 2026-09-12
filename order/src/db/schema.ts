import { check, integer, index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import type { OrderStatus } from "../types/order.types.js";

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    customerName: varchar("customer_name", {
      length: 255,
    }).notNull(),

    product: varchar("product", {
      length: 255,
    }).notNull(),

    quantity: integer("quantity").notNull(),

    status: varchar("status", {
      length: 20,
    })
      .$type<OrderStatus>()
      .notNull()
      .default("PENDING"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_orders_created_at").on(table.createdAt),
    index("idx_orders_status").on(table.status),

    check("orders_quantity_positive", sql`${table.quantity} > 0`),

    check(
      "orders_status_valid",
      sql`${table.status} IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')`,
    ),
  ],
);
