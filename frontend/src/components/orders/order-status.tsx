import type { OrderStatus as OrderStatusType } from "@/types/orders";

interface OrderStatusProps {
  status: OrderStatusType;
}

const statusConfig: Record<
  OrderStatusType,
  {
    label: string;
    className: string;
  }
> = {
  PENDING: {
    label: "Pending",
    className: "border-yellow-200 bg-yellow-50 text-yellow-800",
  },
  PROCESSING: {
    label: "Processing",
    className: "border-blue-200 bg-blue-50 text-blue-800",
  },
  COMPLETED: {
    label: "Completed",
    className: "border-green-200 bg-green-50 text-green-800",
  },
  FAILED: {
    label: "Failed",
    className: "border-red-200 bg-red-50 text-red-800",
  },
};

export function OrderStatus({ status }: OrderStatusProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
