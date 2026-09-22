import { createOrderCreatedEvent } from "./order.events.js";
import type { CreateOrderInput, OrderResponse } from "./order.types.js";
import { orderRepository, type Order } from "./order.repository.js";
import {
  eventBridgePublisher,
  type EventPublisher,
} from "../../messaging/index.js";

// -----------------------------------------------------------------------------
// Order service
// -----------------------------------------------------------------------------

/**
 * Application service responsible for order-related use cases.
 *
 * Responsibilities:
 * - Coordinate order creation.
 * - Retrieve orders.
 * - Coordinate event publication after an order is created.
 *
 * This service does not know about:
 * - Express.
 * - HTTP status codes.
 * - Drizzle queries.
 * - AWS SDK implementation details.
 */
export class OrderService {
  constructor(
    private readonly repository = orderRepository,
    private readonly eventPublisher: EventPublisher = eventBridgePublisher,
  ) {}

  // ---------------------------------------------------------------------------
  // Create order
  // ---------------------------------------------------------------------------

  /**
   * Creates an order and publishes the corresponding OrderCreated event.
   *
   * The order is persisted before the event is created because the generated
   * database ID is required by the event contract.
   */
  async createOrder(input: CreateOrderInput): Promise<OrderResponse> {
    const order = await this.repository.create(input);

    const event = createOrderCreatedEvent({
      orderId: order.id,
    });

    await this.eventPublisher.publishOrderCreated(event);

    return this.toOrderResponse(order);
  }

  // ---------------------------------------------------------------------------
  // Get order
  // ---------------------------------------------------------------------------

  /**
   * Retrieves an order by its unique identifier.
   *
   * Returns null when the order does not exist.
   */
  async getOrderById(id: string): Promise<OrderResponse | null> {
    const order = await this.repository.findById(id);

    if (!order) {
      return null;
    }

    return this.toOrderResponse(order);
  }

  // ---------------------------------------------------------------------------
  // List orders
  // ---------------------------------------------------------------------------

  /**
   * Retrieves all orders.
   *
   * The repository currently returns orders newest first.
   */
  async getOrders(): Promise<OrderResponse[]> {
    const orders = await this.repository.findMany();

    return orders.map((order) => this.toOrderResponse(order));
  }

  // ---------------------------------------------------------------------------
  // Response mapping
  // ---------------------------------------------------------------------------

  /**
   * Maps the persistence representation into the application/API
   * representation.
   *
   * Keeping this mapping here prevents database-specific representations from
   * leaking throughout the application layer.
   */
  private toOrderResponse(order: Order): OrderResponse {
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
}

// -----------------------------------------------------------------------------
// Shared service instance
// -----------------------------------------------------------------------------

/**
 * Shared OrderService instance used by the Order API.
 */
export const orderService = new OrderService();
