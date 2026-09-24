const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatCurrency(amountInPaise: number): string {
  return currencyFormatter.format(amountInPaise / 100);
}

export function formatDateTime(date: string | Date): string {
  return dateTimeFormatter.format(new Date(date));
}

export function formatQuantity(quantity: number): string {
  return `${quantity} ${quantity === 1 ? "item" : "items"}`;
}
