import { desc, eq } from "drizzle-orm";

import { db } from "../db/client.js";
import { orders } from "../db/schema.js";
import { AppError } from "../errors/app.error.js";
import type {
  CreateOrderInput,
  GetOrderResponse,
  GetOrdersResponse,
  Order,
} from "../types/order.types.js";

type OrderRow = typeof orders.$inferSelect;

function mapOrderRow(row: OrderRow): Order {
  return {
    id: row.id,
    customerName: row.customerName,
    product: row.product,
    quantity: row.quantity,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const [createdOrder] = await db
    .insert(orders)
    .values({
      customerName: input.customerName,
      product: input.product,
      quantity: input.quantity,
      status: "PENDING",
    })
    .returning();

  if (createdOrder === undefined) {
    throw new Error("Order was not returned after creation");
  }

  return mapOrderRow(createdOrder);
}

export async function getOrders(): Promise<GetOrdersResponse> {
  const orderRows = await db.select().from(orders).orderBy(desc(orders.createdAt));

  return {
    orders: orderRows.map(mapOrderRow),
    total: orderRows.length,
  };
}

export async function getOrderById(orderId: string): Promise<GetOrderResponse> {
  const [orderRow] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);

  if (orderRow === undefined) {
    throw new AppError(`Order not found: ${orderId}`, 404);
  }

  return {
    order: mapOrderRow(orderRow),
  };
}
