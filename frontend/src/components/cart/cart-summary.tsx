"use client";

import Link from "next/link";

import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CartSummary() {
  const { itemCount, totalAmount } = useCart();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Items</span>
          <span>{itemCount}</span>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <span className="font-medium">Total</span>
          <span className="text-lg font-semibold">
            {formatCurrency(totalAmount)}
          </span>
        </div>

        <Link href="/checkout" className={cn(buttonVariants(), "w-full")}>
          Proceed to checkout
        </Link>
      </CardContent>
    </Card>
  );
}
