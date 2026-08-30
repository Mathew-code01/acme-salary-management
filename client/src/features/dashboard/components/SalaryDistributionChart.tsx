// client/src/features/dashboard/components/SalaryDistributionChart.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../../components/ui/card';

import type { SalaryDistribution } from '../types/dashboard';

import { formatCountLabel, formatPercentage } from '../utils/dashboard-formatters';

interface SalaryDistributionChartProps {
  distribution: SalaryDistribution;
}

export function SalaryDistributionChart({ distribution }: SalaryDistributionChartProps) {
  const maxCount = Math.max(...distribution.buckets.map((bucket) => bucket.employeeCount), 1);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Salary distribution</CardTitle>

        <CardDescription>Employees grouped into annual salary ranges.</CardDescription>
      </CardHeader>

      <CardContent>
        {distribution.totalEmployees === 0 ? (
          <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
            <div>
              <p className="text-sm font-medium">No salary distribution data</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Salary records will appear here once they are available.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5" role="img" aria-label="Salary distribution chart">
            {distribution.buckets.map((bucket) => {
              const width =
                bucket.employeeCount === 0
                  ? 0
                  : Math.max((bucket.employeeCount / maxCount) * 100, 3);

              return (
                <div key={bucket.key} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="truncate text-sm font-medium">{bucket.label}</span>

                    <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatCountLabel(bucket.employeeCount, 'employee')}</span>

                      <span className="min-w-12 text-right font-medium text-foreground">
                        {formatPercentage(bucket.percentage)}
                      </span>
                    </div>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{
                        width: `${width}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="border-t border-border pt-4 text-xs text-muted-foreground">
              Total analyzed:{' '}
              <span className="font-medium text-foreground">
                {formatCountLabel(distribution.totalEmployees, 'employee')}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}