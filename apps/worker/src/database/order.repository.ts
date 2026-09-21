import { eq } from "drizzle-orm";

import type { Order, OrderStatus } from "@orderflow/contracts";

import { db } from "./client.js";
import { orders } from "./schema/order.schema.js";

export class OrderRepository {
  async findById(orderId: string): Promise<Order | null> {
    const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);

    const order = result[0];

    if (!order) {
      return null;
    }

    return {
      id: order.id,
      customerName: order.customerName,
      product: order.product,
      quantity: order.quantity,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
    await db
      .update(orders)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));
  }
}
