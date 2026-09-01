// client/src/features/analytics/components/SalaryDistribution.tsx
import {
  BarChart3,
  Users,
} from 'lucide-react';

import type {
  SalaryDistribution as SalaryDistributionData,
} from '../types/analytics';

import {
  formatNumber,
  formatPercentage,
  getDistributionMax,
} from '../utils/analytics-formatters';

interface SalaryDistributionProps {
  distribution: SalaryDistributionData;
}

export function SalaryDistribution({
  distribution,
}: SalaryDistributionProps) {
  const {
    buckets,
    totalEmployees,
  } = distribution;

  const maxEmployees =
    getDistributionMax(buckets);

  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BarChart3
              className="h-4 w-4"
              aria-hidden="true"
            />
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground">
              Salary distribution
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Employee distribution across salary
              bands.
            </p>
          </div>
        </div>
      </div>

      {buckets.length === 0 ? (
        <div className="flex min-h-48 items-center justify-center px-5">
          <div className="text-center">
            <Users
              className="mx-auto h-8 w-8 text-muted-foreground"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm font-medium text-foreground">
              No salary distribution data
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting the selected filters.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-5 p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {formatNumber(totalEmployees)}{' '}
              employees
            </span>

            <span>
              {buckets.length} salary bands
            </span>
          </div>

          <div
            className="space-y-4"
            role="list"
            aria-label="Salary distribution"
          >
            {buckets.map((bucket) => {
              const width =
                maxEmployees > 0
                  ? (bucket.employeeCount /
                      maxEmployees) *
                    100
                  : 0;

              return (
                <div
                  key={bucket.key}
                  role="listitem"
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="min-w-0 truncate text-sm font-medium text-foreground">
                      {bucket.label}
                    </span>

                    <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        {formatNumber(
                          bucket.employeeCount,
                        )}
                      </span>

                      <span>
                        {formatPercentage(
                          bucket.percentage,
                        )}
                      </span>
                    </div>
                  </div>

                  <div
                    className="h-2 overflow-hidden rounded-full bg-muted"
                    aria-hidden="true"
                  >
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            width,
                            bucket.employeeCount >
                              0
                              ? 1
                              : 0,
                          ),
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}