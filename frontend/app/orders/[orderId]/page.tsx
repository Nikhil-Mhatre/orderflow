import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderDetailsPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

/**
 * Displays the status page for a submitted order.
 *
 * The actual order-status API integration will be added once
 * the GET /orders/:orderId response contract is defined.
 */
export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { orderId } = await params;

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Page heading */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            OrderFlow
          </p>

          <h1 className="text-3xl font-bold tracking-tight">Order Placed</h1>

          <p className="mt-2 text-muted-foreground">
            Your order has been submitted successfully.
          </p>
        </div>

        {/* Order information */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>

              <p className="mt-1 font-mono text-sm font-medium break-all">
                {orderId}
              </p>
            </div>

            {/* Initial status */}
            <div>
              <p className="text-sm text-muted-foreground">Status</p>

              <div className="mt-2 flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-yellow-500" />

                <span className="font-medium">Processing</span>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                Your order is being processed. This page will be connected to
                the order status API next.
              </p>
            </div>

            <Button className="w-full">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
