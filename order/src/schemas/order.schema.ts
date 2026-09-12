import { z } from "zod";

export const createOrderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(1, "Customer name is required")
    .max(255, "Customer name must not exceed 255 characters"),

  product: z
    .string()
    .trim()
    .min(1, "Product is required")
    .max(255, "Product must not exceed 255 characters"),

  quantity: z
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than zero"),
});

export type CreateOrderRequest = z.infer<typeof createOrderSchema>;
