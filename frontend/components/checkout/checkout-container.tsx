// frontend/src/components/checkout/checkout-container.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import type { CheckoutFormData } from "@/components/checkout/checkout-form";
import { createOrder } from "@/lib/api/orders";
import type { Product } from "@/data/products";

interface CheckoutContainerProps {
  product: Product;
}

/**
 * Client-side checkout container.
 *
 * Responsibilities:
 * - Receive the selected product.
 * - Handle checkout form submission.
 * - Call order-api.
 * - Handle submission errors.
 * - Navigate to the created order.
 *
 * It intentionally does not contain the actual form fields.
 * Those remain inside CheckoutForm.
 */
export function CheckoutContainer({ product }: CheckoutContainerProps) {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(data: CheckoutFormData) {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await createOrder({
        customerName: data.customerName,
        product: product.name,
        quantity: data.quantity,
      });

      router.push(`/orders/${response.orderId}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to create order.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <CheckoutForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
        >
          {error}
        </div>
      )}
    </div>
  );
}
