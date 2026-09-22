import type { OrderCreatedEvent } from "@orderflow/contracts";

/**
 * The order statuses used by the worker during processing.
 *
 * The database/repository layer will persist these values.
 */
export type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

/**
 * Minimal order representation required by the processing service.
 *
 * The worker does not need the complete database record to process
 * an OrderCreated event.
 */
export interface Order {
  id: string;
  status: OrderStatus;
}

/**
 * Database operations required by the order-processing service.
 *
 * Keeping this as an interface means the service does not depend
 * directly on PostgreSQL or a specific database library.
 */
export interface OrderRepository {
  findById(orderId: string): Promise<Order | null>;

  updateStatus(orderId: string, status: OrderStatus): Promise<void>;
}

/**
 * Handles the business workflow for an OrderCreated event.
 *
 * Processing flow:
 *
 * PENDING
 *    |
 *    v
 * PROCESSING
 *    |
 *    v
 * COMPLETED
 *
 * If processing fails:
 *
 * PROCESSING
 *    |
 *    v
 * FAILED
 */
export class OrderProcessingService {
  constructor(private readonly orderRepository: OrderRepository) {}

  /**
   * Process an OrderCreated event.
   *
   * @param event Validated OrderCreated event.
   */
  async process(event: OrderCreatedEvent): Promise<void> {
    const { orderId } = event;

    // Retrieve the current order state from the database.
    const order = await this.orderRepository.findById(orderId);

    // The event references an order that no longer exists.
    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    // The worker should only process newly created orders.
    //
    // If the order has already been processed, we do not process it
    // again. This is important because SQS provides at-least-once
    // delivery and the same message can potentially be delivered
    // more than once.
    if (order.status !== "PENDING") {
      return;
    }

    // Move the order into the processing state before doing work.
    await this.orderRepository.updateStatus(orderId, "PROCESSING");

    try {
      // Simulate the actual order-processing work.
      //
      // There is intentionally no real payment, inventory, or
      // fulfillment logic in OrderFlow.
      await this.simulateProcessing();

      // Processing completed successfully.
      await this.orderRepository.updateStatus(orderId, "COMPLETED");
    } catch (error) {
      // Record the failure in the database before propagating
      // the error back to the worker.
      //
      // The worker can then allow SQS to retry the message.
      await this.orderRepository.updateStatus(orderId, "FAILED");

      throw error;
    }
  }

  /**
   * Simulates a small amount of background processing.
   *
   * This represents where real order-processing logic could
   * eventually execute.
   */
  private async simulateProcessing(): Promise<void> {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1000);
    });
  }
}
