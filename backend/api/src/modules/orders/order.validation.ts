import { z } from "zod";

/**
 * Validation schema for POST /orders.
 *
 * This schema validates and normalizes data entering the order module
 * before it reaches the application/service layer.
 *
 * The schema intentionally contains only API input concerns. Business
 * rules that require application state or database access belong in the
 * service layer.
 */
export const createOrderSchema = z.object({
  /**
   * Customer name associated with the order.
   *
   * Leading and trailing whitespace is removed before the value reaches
   * the service layer.
   */
  customerName: z.string().trim().min(1, "Customer name is required"),

  /**
   * Product identifier or product description supplied by the client.
   *
   * The current API contract only requires a non-empty string.
   */
  product: z.string().trim().min(1, "Product is required"),

  /**
   * Number of units being ordered.
   *
   * Orders must contain at least one unit and quantities must be whole
   * numbers.
   */
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than zero"),
});

/**
 * TypeScript representation of a validated create-order request.
 *
 * This type is inferred from the runtime schema so the validation rules
 * and TypeScript type remain synchronized.
 */
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

/**
 * Validation schema for GET /orders/:id.
 *
 * Route parameters arrive as strings, so the order ID remains a string
 * at the HTTP boundary.
 */
export const orderIdParamsSchema = z.object({
  id: z.string().trim().min(1, "Order ID is required"),
});

/**
 * TypeScript representation of validated order route parameters.
 */
export type OrderIdParams = z.infer<typeof orderIdParamsSchema>;
