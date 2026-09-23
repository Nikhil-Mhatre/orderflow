"use client";

import Link from "next/link";

import { useOrderStatus } from "@/hooks/use-order-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderStatusProps {
  orderId: string;
}

export function OrderStatus({ orderId }: OrderStatusProps) {
  const { data: order, isLoading, isError, error } = useOrderStatus(orderId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 animate-pulse rounded-full bg-yellow-500" />

            <span className="font-medium">Loading order status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to Load Order</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-destructive">
            {error instanceof Error
              ? error.message
              : "Unable to retrieve the order."}
          </p>

          <Button className="mt-6">
            <Link href="/products">Back to Products</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!order) {
    return null;
  }

  const status = order.status.toUpperCase();

  const isCompleted = status === "COMPLETED";
  const isFailed = status === "FAILED";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Order ID */}
        <div>
          <p className="text-sm text-muted-foreground">Order ID</p>

          <p className="mt-1 break-all font-mono text-sm font-medium">
            {order.orderId}
          </p>
        </div>

        {/* Product */}
        <div>
          <p className="text-sm text-muted-foreground">Product</p>

          <p className="mt-1 font-medium">{order.product}</p>
        </div>

        {/* Quantity */}
        <div>
          <p className="text-sm text-muted-foreground">Quantity</p>

          <p className="mt-1 font-medium">{order.quantity}</p>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-muted-foreground">Status</p>

          <div className="mt-2 flex items-center gap-3">
            <span
              className={[
                "h-3 w-3 rounded-full",
                isCompleted && "bg-green-500",
                isFailed && "bg-red-500",
                !isCompleted && !isFailed && "animate-pulse bg-yellow-500",
              ]
                .filter(Boolean)
                .join(" ")}
            />

            <span className="font-medium">{order.status}</span>
          </div>

          {!isCompleted && !isFailed && (
            <p className="mt-2 text-sm text-muted-foreground">
              Your order is being processed. The status will update
              automatically.
            </p>
          )}
        </div>

        {/* Customer */}
        <div>
          <p className="text-sm text-muted-foreground">Customer</p>

          <p className="mt-1 font-medium">{order.customerName}</p>
        </div>

        {/* Completed / failed actions */}
        {(isCompleted || isFailed) && (
          <Button className="w-full">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
