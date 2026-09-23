// frontend/src/hooks/use-order-status.ts

"use client";

import { useQuery } from "@tanstack/react-query";

import { getOrder } from "@/lib/api/orders";

/**
 * Polling interval while an order is still being processed.
 */
const ORDER_STATUS_POLL_INTERVAL = 2000;

/**
 * Fetches and monitors the status of an order.
 *
 * Polling stops automatically once the order reaches a terminal state.
 */
export function useOrderStatus(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],

    queryFn: () => getOrder(orderId),

    enabled: Boolean(orderId),

    refetchInterval: (query) => {
      const status = query.state.data?.status;

      if (!status) {
        return ORDER_STATUS_POLL_INTERVAL;
      }

      const normalizedStatus = status.toUpperCase();

      /**
       * Stop polling once the order has reached a terminal state.
       *
       * These values should match the actual order-api/worker
       * status contract.
       */
      if (normalizedStatus === "COMPLETED" || normalizedStatus === "FAILED") {
        return false;
      }

      return ORDER_STATUS_POLL_INTERVAL;
    },

    retry: 3,
  });
}
