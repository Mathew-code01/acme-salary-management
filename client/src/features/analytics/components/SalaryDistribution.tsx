// client/src/features/analytics/components/SalaryDistribution.tsx
import { BarChart3, Users } from 'lucide-react';

import type { SalaryDistribution } from '../types/analytics';

import { formatNumber, formatPercentage } from '../utils/analytics-formatters';

interface SalaryDistributionProps {
  distribution: SalaryDistribution;
}

export function SalaryDistribution({ distribution }: SalaryDistributionProps) {
  const buckets = distribution.buckets ?? [];

  const maxEmployees = Math.max(...buckets.map((bucket) => bucket.employeeCount), 1);

  const totalEmployees =
    distribution.totalEmployees ??
    buckets.reduce((total, bucket) => total + bucket.employeeCount, 0);

  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="border-b border-border/70 px-4 py-4 min-[480px]:px-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BarChart3 className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-bold text-foreground">Salary distribution</h2>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Employee concentration across salary bands.
              </p>
            </div>
          </div>

          <div className="hidden shrink-0 text-right min-[480px]:block">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Employees
            </p>

            <p className="mt-0.5 text-sm font-bold text-foreground">
              {formatNumber(totalEmployees)}
            </p>
          </div>
        </div>
      </div>

      {buckets.length === 0 ? (
        <div className="flex min-h-64 items-center justify-center px-5">
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>

            <p className="mt-3 text-sm font-semibold text-foreground">No salary distribution</p>

            <p className="mt-1 text-xs text-muted-foreground">
              No salary records match the selected filters.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 min-[480px]:p-5">
          <div className="space-y-5">
            {buckets.map((bucket) => {
              const width = (bucket.employeeCount / maxEmployees) * 100;

              return (
                <div key={bucket.label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-xs font-semibold text-foreground">
                      {bucket.label}
                    </span>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        {formatNumber(bucket.employeeCount)}
                      </span>

                      <span className="hidden text-[11px] text-muted-foreground min-[480px]:inline">
                        {formatPercentage(bucket.percentage)}
                      </span>
                    </div>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full min-w-[2px] rounded-full bg-primary transition-all duration-500"
                      style={{
                        width: `${Math.max(width, bucket.employeeCount > 0 ? 2 : 0)}%`,
                      }}
                    />
                  </div>

                  <div className="mt-1.5 flex justify-end min-[480px]:hidden">
                    <span className="text-[10px] text-muted-foreground">
                      {formatPercentage(bucket.percentage)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl border border-border/60 bg-muted/20 p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-muted-foreground">Total employees</span>

              <span className="text-sm font-bold text-foreground">
                {formatNumber(totalEmployees)}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}