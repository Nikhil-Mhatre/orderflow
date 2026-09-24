import { eq, desc, sql } from "drizzle-orm";

import { db } from "../../db/client.js";
import { orderItems, orders } from "../../db/schema/orders.js";
import { products } from "../../db/schema/products.js";

import type {
  CreateOrderInput,
  GetOrdersQuery,
  OrderItem,
  OrderListResponse,
  OrderResponse,
} from "./order.types.js";

// -----------------------------------------------------------------------------
// Create order
// -----------------------------------------------------------------------------

/**
 * Creates an order together with all of its order items.
 *
 * Product information is resolved from the products table.
 * Prices supplied by the client are never trusted.
 *
 * The entire operation runs inside one transaction.
 */
export async function createOrder(
  input: CreateOrderInput,
): Promise<OrderResponse> {
  return db.transaction(async (tx) => {
    const productIds = input.items.map((item) => item.productId);

    const productRows = await tx.select().from(products).where(
      // We intentionally query each requested product below instead of
      // relying on a client-supplied price.
      eq(products.active, true),
    );

    const requestedProducts = new Map(
      productRows
        .filter((product) => productIds.includes(product.id))
        .map((product) => [product.id, product]),
    );

    // -------------------------------------------------------------------------
    // Validate products
    // -------------------------------------------------------------------------

    for (const item of input.items) {
      const product = requestedProducts.get(item.productId);

      if (!product) {
        throw new Error(
          `Product ${item.productId} does not exist or is inactive`,
        );
      }
    }

    // -------------------------------------------------------------------------
    // Build order items and calculate total
    // -------------------------------------------------------------------------

    let totalAmount = 0;

    const itemsToInsert = input.items.map((item) => {
      const product = requestedProducts.get(item.productId);

      // The validation above guarantees that this exists.
      if (!product) {
        throw new Error(
          `Product ${item.productId} does not exist or is inactive`,
        );
      }

      const lineTotal = product.price * item.quantity;

      totalAmount += lineTotal;

      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
      };
    });

    // -------------------------------------------------------------------------
    // Create order
    // -------------------------------------------------------------------------

    const [order] = await tx
      .insert(orders)
      .values({
        customerName: input.customerName,
        totalAmount,
      })
      .returning();

    if (!order) {
      throw new Error("Failed to create order");
    }

    // -------------------------------------------------------------------------
    // Create order items
    // -------------------------------------------------------------------------

    const insertedItems = await tx
      .insert(orderItems)
      .values(
        itemsToInsert.map((item) => ({
          ...item,
          orderId: order.id,
        })),
      )
      .returning();

    // -------------------------------------------------------------------------
    // Return domain representation
    // -------------------------------------------------------------------------

    const mappedItems: OrderItem[] = insertedItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    return {
      id: order.id,
      customerName: order.customerName,
      items: mappedItems,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  });
}

// -----------------------------------------------------------------------------
// Get order
// -----------------------------------------------------------------------------

/**
 * Retrieves an order together with its order items.
 */
export async function getOrderById(
  orderId: string,
): Promise<OrderResponse | null> {
  const orderRows = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  const order = orderRows[0];

  if (!order) {
    return null;
  }

  const itemRows = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  const items: OrderItem[] = itemRows.map((item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  }));

  return {
    id: order.id,
    customerName: order.customerName,
    items,
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

// -----------------------------------------------------------------------------
// Get orders
// -----------------------------------------------------------------------------

/**
 * Retrieves all orders together with their order items.
 */
export async function getOrders(
  query: GetOrdersQuery,
): Promise<OrderListResponse> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;

  const offset = (page - 1) * limit;

  const orderRows = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset);

  const [countRow] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(orders);

  const total = Number(countRow?.count ?? 0);

  const result: OrderResponse[] = [];

  for (const order of orderRows) {
    const itemRows = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    const items: OrderItem[] = itemRows.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    result.push({
      id: order.id,
      customerName: order.customerName,
      items,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  }

  return {
    orders: result,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
