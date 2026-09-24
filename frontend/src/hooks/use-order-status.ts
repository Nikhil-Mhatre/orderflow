import { useQuery } from "@tanstack/react-query";

import { getOrder } from "@/lib/api/orders";
import { OrderStatus } from "@/types/orders";

const TERMINAL_STATUSES: OrderStatus[] = ["COMPLETED", "FAILED"];

export function useOrderStatus(orderId: string) {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => getOrder(orderId),
    enabled: Boolean(orderId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;

      if (status && TERMINAL_STATUSES.includes(status)) {
        return false;
      }
      // polls every 10 seconds until COMPLETED or FAILED
      return 10_000;
    },
  });
}
