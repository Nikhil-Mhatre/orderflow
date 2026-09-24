"use client";

import { useQuery } from "@tanstack/react-query";

import { getOrders } from "@/lib/api/orders";
import { OrderStatus } from "@/types/orders";

const ACTIVE_STATUSES: OrderStatus[] = ["PENDING", "PROCESSING"];

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,

    refetchInterval: (query) => {
      const orders = query.state.data?.data ?? [];

      const hasActiveOrders = orders.some((order) =>
        ACTIVE_STATUSES.includes(order.status),
      );

      return hasActiveOrders ? 15_000 : false;
    },

    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
