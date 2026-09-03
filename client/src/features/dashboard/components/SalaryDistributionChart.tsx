// client/src/features/dashboard/components/SalaryDistributionChart.tsx

import { BarChart3, Users } from 'lucide-react';

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
    <Card className="h-full overflow-hidden rounded-2xl border-border shadow-sm">
      <CardHeader className="border-b border-border/70 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <BarChart3 className="h-4 w-4" />
              </span>

              <div className="min-w-0">
                <CardTitle className="truncate text-base sm:text-lg">Salary distribution</CardTitle>
              </div>
            </div>

            <CardDescription className="mt-3">
              Employees grouped by annual salary range.
            </CardDescription>
          </div>

          <div className="hidden shrink-0 rounded-lg bg-muted px-2.5 py-1.5 text-xs font-medium text-muted-foreground sm:block">
            {formatCountLabel(distribution.totalEmployees, 'employee')}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {distribution.totalEmployees === 0 ? (
          <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
            <div>
              <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground/50" />

              <p className="mt-3 text-sm font-semibold">No salary distribution data</p>

              <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                Salary records will appear here once compensation data is available.
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
                <div key={bucket.key} className="group space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-primary/70" />

                      <span className="truncate text-sm font-medium text-foreground">
                        {bucket.label}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 text-xs">
                      <span className="hidden text-muted-foreground sm:inline">
                        {formatCountLabel(bucket.employeeCount, 'employee')}
                      </span>

                      <span className="rounded-md bg-muted px-2 py-1 font-semibold text-foreground">
                        {formatPercentage(bucket.percentage)}
                      </span>
                    </div>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-700 ease-out dark:from-indigo-500 dark:to-indigo-400"
                      style={{
                        width: `${width}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground sm:hidden">
                    <Users className="h-3 w-3" />

                    {formatCountLabel(bucket.employeeCount, 'employee')}
                  </div>
                </div>
              );
            })}

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs text-muted-foreground">Total analyzed</span>

              <span className="text-sm font-semibold text-foreground">
                {formatCountLabel(distribution.totalEmployees, 'employee')}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}