import { desc, eq } from "drizzle-orm";
import type { CreateOrderInput } from "./order.types.js";
import { db } from "../../db/client.js";
import { orders } from "../../db/schema/index.js";

// -----------------------------------------------------------------------------
// Repository types
// -----------------------------------------------------------------------------

// Represents a complete order returned from the database.
export type Order = typeof orders.$inferSelect;

// Represents the fields accepted by Drizzle when inserting an order.
export type NewOrder = typeof orders.$inferInsert;

// -----------------------------------------------------------------------------
// Order repository
// -----------------------------------------------------------------------------

// The repository is the persistence boundary for the order module.
//
// Responsibilities:
// - Execute Drizzle queries.
// - Read and write the orders table.
// - Return database records.
//
// It does not:
// - Validate HTTP requests.
// - Apply business rules.
// - Publish events.
// - Know about EventBridge or SQS.
// - Know about Express.
export class OrderRepository {
  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  // Creates a new order.
  //
  // The database schema provides:
  // - id
  // - status = PENDING
  // - createdAt
  // - updatedAt
  async create(input: CreateOrderInput): Promise<Order> {
    const [order] = await db.insert(orders).values(input).returning();

    if (!order) {
      throw new Error("Failed to create order");
    }

    return order;
  }

  // ---------------------------------------------------------------------------
  // Find by ID
  // ---------------------------------------------------------------------------

  // Returns the order when it exists.
  //
  // Returns null when no order matches the supplied ID.
  async findById(id: string): Promise<Order | null> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    return order ?? null;
  }

  // ---------------------------------------------------------------------------
  // Find many
  // ---------------------------------------------------------------------------

  // Returns orders from newest to oldest.
  async findMany(): Promise<Order[]> {
    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  // ---------------------------------------------------------------------------
  // Update status
  // ---------------------------------------------------------------------------

  // Updates the persisted processing status of an order.
  //
  // Business rules governing valid status transitions belong outside the
  // repository.
  async updateStatus(
    id: string,
    status: Order["status"],
  ): Promise<Order | null> {
    const [order] = await db
      .update(orders)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();

    return order ?? null;
  }
}

// -----------------------------------------------------------------------------
// Repository instance
// -----------------------------------------------------------------------------

// The repository is stateless, so a single shared instance is sufficient.
export const orderRepository = new OrderRepository();
