// client/src/components/data-display/TrendIndicator.tsx

import {
  ArrowDown,
  ArrowUp,
  Minus,
} from "lucide-react";

import { cn } from "../../lib/utils";

interface TrendIndicatorProps {
  value: number;
  label?: string;
  inverse?: boolean;
}

export function TrendIndicator({
  value,
  label,
  inverse = false,
}: TrendIndicatorProps) {
  const direction =
    value > 0
      ? "up"
      : value < 0
        ? "down"
        : "neutral";

  const positive =
    direction === "up"
      ? !inverse
      : direction === "down"
        ? inverse
        : null;

  const Icon =
    direction === "up"
      ? ArrowUp
      : direction === "down"
        ? ArrowDown
        : Minus;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        positive === true && "text-success",
        positive === false && "text-destructive",
        positive === null && "text-muted-foreground",
      )}
    >
      <Icon
        aria-hidden="true"
        className="h-3.5 w-3.5"
      />

      <span>
        {Math.abs(value).toFixed(1)}%
      </span>

      {label ? (
        <span className="font-normal text-muted-foreground">
          {label}
        </span>
      ) : null}
    </span>
  );
}