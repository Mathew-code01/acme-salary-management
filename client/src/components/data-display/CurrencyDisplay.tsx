// client/src/components/data-display/CurrencyDisplay.tsx

interface CurrencyDisplayProps {
  amount: number;
  currency?: string;
  compact?: boolean;
}

export function CurrencyDisplay({
  amount,
  currency = "USD",
  compact = false,
}: CurrencyDisplayProps) {
  return (
    <span className="tabular-nums">
      {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        notation: compact ? "compact" : "standard",
        maximumFractionDigits: compact ? 1 : 2,
      }).format(amount)}
    </span>
  );
}
