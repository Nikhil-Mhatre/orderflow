import { logger } from "../infrastructure/logger.js";
import { OrderRepository } from "../database/order.repository.js";

export class OrderProcessorService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async process(orderId: string): Promise<void> {
    const orderLogger = logger.child({
      orderId,
    });

    orderLogger.info("Order processing started");

    try {
      const order = await this.orderRepository.findById(orderId);

      if (!order) {
        orderLogger.warn("Order not found");

        throw new Error(`Order not found: ${orderId}`);
      }

      // Existing order processing logic goes here.

      orderLogger.info("Order processing completed");
    } catch (error) {
      orderLogger.error(
        {
          err: error,
        },
        "Order processing failed",
      );

      throw error;
    }
  }
}
