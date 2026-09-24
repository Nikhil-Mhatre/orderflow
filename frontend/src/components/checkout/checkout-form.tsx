"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createOrder } from "@/lib/api/orders";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/schemas/checkout.schema";
import { useCart } from "@/hooks/use-cart";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CheckoutForm() {
  const router = useRouter();

  const { items, clearCart } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
    },
  });

  const onSubmit = async (values: CheckoutFormValues) => {
    const order = await createOrder({
      customerName: values.customerName,
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    });

    clearCart();

    router.push(`/orders/${order.id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Details</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer name</Label>

            <Input
              id="customerName"
              placeholder="Enter your name"
              {...register("customerName")}
              disabled={isSubmitting}
            />

            {errors.customerName && (
              <p className="text-sm text-destructive">
                {errors.customerName.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || items.length === 0}
          >
            {isSubmitting ? "Creating order..." : "Place order"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
