// client/src/components/data-display/PercentageDisplay.tsx

interface PercentageDisplayProps {
  value: number;
  fraction?: boolean;
}

export function PercentageDisplay({ value, fraction = false }: PercentageDisplayProps) {
  const percentage = fraction ? value * 100 : value;

  return (
    <span className="tabular-nums">
      {new Intl.NumberFormat("en-US", {
        style: "percent",
        maximumFractionDigits: 1,
      }).format(percentage / 100)}
    </span>
  );
}
