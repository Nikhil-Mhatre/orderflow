import type { Pool } from "pg";

import type {
  Order,
  OrderRepository,
  OrderStatus,
} from "./order-processing.service.js";

/**
 * PostgreSQL implementation of the OrderRepository interface.
 *
 * This class is responsible only for database access.
 * Business rules belong in OrderProcessingService.
 */
export class PostgresOrderRepository implements OrderRepository {
  constructor(private readonly db: Pool) {}

  /**
   * Find an order by its ID.
   *
   * @param orderId - Unique order identifier.
   * @returns The order when found, otherwise null.
   */
  async findById(orderId: string): Promise<Order | null> {
    const result = await this.db.query<{
      id: string;
      status: OrderStatus;
    }>(
      `
        SELECT id, status
        FROM orders
        WHERE id = $1
      `,
      [orderId],
    );

    const row = result.rows[0];

    // PostgreSQL returned no matching order.
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      status: row.status,
    };
  }

  /**
   * Update the status of an order.
   *
   * @param orderId - Unique order identifier.
   * @param status - New order status.
   */
  async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
    await this.db.query(
      `
        UPDATE orders
        SET
          status = $1,
          updated_at = NOW()
        WHERE id = $2
      `,
      [status, orderId],
    );
  }
}
