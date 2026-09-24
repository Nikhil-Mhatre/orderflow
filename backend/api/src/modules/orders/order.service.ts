import { and, eq, sql } from "drizzle-orm";

import { db } from "../../db/client.js";
import { orderItems, orders, products } from "../../db/schema/index.js";
import { AppError } from "../../lib/errors/app.error.js";
import {
  ORDER_CREATED_EVENT_TYPE,
  ORDER_CREATED_EVENT_VERSION,
  type OrderCreatedEvent,
} from "../../lib/events/order-created.js";
import { eventBridgePublisher } from "../../messaging/eventbridge.publisher.js";
import type { EventPublisher } from "../../messaging/event-publisher.js";

import type {
  CreateOrderRequest,
  GetOrdersQuery,
  Order,
  Pagination,
} from "./order.types.js";
import { logger } from "../../config/logger.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export class OrderService {
  constructor(private readonly eventPublisher: EventPublisher) {}

  async createOrder(input: CreateOrderRequest): Promise<Order> {
    const productIds = input.items.map((item) => item.productId);

    const productRows = await db
      .select()
      .from(products)
      .where(
        and(eq(products.active, true), sql`${products.id} IN ${productIds}`),
      );

    if (productRows.length !== productIds.length) {
      throw new AppError(
        "One or more products were not found",
        404,
        "PRODUCT_NOT_FOUND",
      );
    }

    const productMap = new Map(
      productRows.map((product) => [product.id, product]),
    );

    let totalAmount = 0;

    const items = input.items.map((item) => {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");
      }

      totalAmount += product.price * item.quantity;

      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
      };
    });

    // The database transaction must complete successfully
    // before we publish the OrderCreated event.
    const order = await db.transaction(async (tx) => {
      const [createdOrder] = await tx
        .insert(orders)
        .values({
          customerName: input.customerName,
          totalAmount,
          status: "PENDING",
        })
        .returning();

      if (!createdOrder) {
        throw new AppError(
          "Failed to create order",
          500,
          "ORDER_CREATION_FAILED",
        );
      }

      const createdItems = await tx
        .insert(orderItems)
        .values(
          items.map((item) => ({
            orderId: createdOrder.id,
            ...item,
          })),
        )
        .returning();

      return {
        ...createdOrder,
        items: createdItems,
      };
    });

    const event: OrderCreatedEvent = {
      eventType: ORDER_CREATED_EVENT_TYPE,
      eventVersion: ORDER_CREATED_EVENT_VERSION,
      orderId: order.id,
      timestamp: new Date().toISOString(),
    };
    await this.eventPublisher.publishOrderCreated(event);
    logger.info({ event }, "Event Published!");

    return order;
  }

  async getOrderById(orderId: string): Promise<Order> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    return {
      ...order,
      items,
    };
  }

  async getOrders(query: GetOrdersQuery) {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, MAX_LIMIT);

    const offset = (page - 1) * limit;

    const [orderRows, countResult] = await Promise.all([
      db
        .select()
        .from(orders)
        .limit(limit)
        .offset(offset)
        .orderBy(orders.createdAt),

      db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(orders),
    ]);

    const total = Number(countResult[0]?.count ?? 0);

    const ordersWithItems = await Promise.all(
      orderRows.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));

        return {
          ...order,
          items,
        };
      }),
    );

    const pagination: Pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    return {
      orders: ordersWithItems,
      pagination,
    };
  }
}

export const orderService = new OrderService(eventBridgePublisher);
