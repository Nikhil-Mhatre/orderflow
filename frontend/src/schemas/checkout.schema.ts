import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters")
    .max(100, "Customer name must be less than 100 characters"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
