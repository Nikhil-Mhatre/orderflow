// frontend/src/components/checkout/checkout-form.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Frontend validation schema for checkout.
 *
 * This validates user input for a good UX.
 * The backend remains responsible for authoritative validation.
 */
const checkoutFormSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Customer name must contain at least 2 characters.")
    .max(100, "Customer name cannot exceed 100 characters."),

  quantity: z
    .number({
      error: "Quantity must be a number.",
    })
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1.")
    .max(10, "Quantity cannot exceed 10."),
});

/**
 * Data produced by the validated checkout form.
 */
export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

interface CheckoutFormProps {
  /**
   * Called after the form passes validation.
   *
   * The parent decides what happens next, such as calling
   * order-api and navigating to the order status page.
   */
  onSubmit: (data: CheckoutFormData) => void | Promise<void>;

  /**
   * Indicates that the order submission is currently in progress.
   */
  isSubmitting?: boolean;
}

/**
 * Customer checkout form.
 *
 * Responsibilities:
 * - Capture customer name.
 * - Capture quantity.
 * - Validate user input.
 * - Pass validated data to the parent.
 *
 * This component does not know about order-api.
 */
export function CheckoutForm({
  onSubmit,
  isSubmitting = false,
}: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
      quantity: 1,
    },
  });

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          {/* Customer name */}
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>

            <Input
              id="customerName"
              type="text"
              placeholder="Enter your name"
              autoComplete="name"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.customerName)}
              aria-describedby={
                errors.customerName ? "customerName-error" : undefined
              }
              {...register("customerName")}
            />

            {errors.customerName && (
              <p id="customerName-error" className="text-sm text-destructive">
                {errors.customerName.message}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>

            <Input
              id="quantity"
              type="number"
              min={1}
              max={10}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.quantity)}
              aria-describedby={errors.quantity ? "quantity-error" : undefined}
              {...register("quantity", {
                valueAsNumber: true,
              })}
            />

            {errors.quantity && (
              <p id="quantity-error" className="text-sm text-destructive">
                {errors.quantity.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
