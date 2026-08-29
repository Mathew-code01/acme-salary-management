// client/src/components/data-display/StatCard.tsx

import type { ReactNode } from "react";

import { Card } from "../ui/card";
import { TrendIndicator } from "./TrendIndicator";

interface StatCardProps {
  title: string;
  value: ReactNode;
  description?: string;
  trend?: number;
  trendLabel?: string;
  icon?: ReactNode;
}

export function StatCard({ title, value, description, trend, trendLabel, icon }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
        </div>

        {icon ? <div className="rounded-lg bg-primary/10 p-2.5 text-primary">{icon}</div> : null}
      </div>

      {description || trend !== undefined ? (
        <div className="mt-4 flex items-center gap-3">
          {trend !== undefined ? <TrendIndicator value={trend} label={trendLabel} /> : null}

          {description ? (
            <span className="text-xs text-muted-foreground">{description}</span>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
