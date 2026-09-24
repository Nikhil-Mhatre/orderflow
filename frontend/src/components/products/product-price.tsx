import { formatCurrency } from "@/lib/format";

interface ProductPriceProps {
  amount: number;
  className?: string;
}

export function ProductPrice({ amount, className }: ProductPriceProps) {
  return (
    <span className={className ?? "font-semibold"}>
      {formatCurrency(amount)}
    </span>
  );
}
