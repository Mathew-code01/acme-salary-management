// client/src/features/analytics/components/AnalyticsSummary.tsx
import type { ReactNode } from 'react';

import {
  CircleDollarSign,
  Coins,
  Users,
  WalletCards,
} from 'lucide-react';

import type {
  AnalyticsOverview,
} from '../types/analytics';

import {
  formatCents,
  formatNumber,
  getSummaryCurrency,
} from '../utils/analytics-formatters';

interface AnalyticsSummaryProps {
  overview: AnalyticsOverview;
}

interface MetricCardProps {
  label: string;

  value: string;

  description: string;

  icon: ReactNode;
}

function MetricCard({
  label,
  value,
  description,
  icon,
}: MetricCardProps) {
  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </article>
  );
}

export function AnalyticsSummary({
  overview,
}: AnalyticsSummaryProps) {
  const {
    metrics,
    payrollByCurrency,
  } = overview;

  const primaryCurrency =
    getSummaryCurrency(
      metrics.currencies,
      payrollByCurrency,
    );

  const averageSalary =
    formatCents(
      metrics.averageSalaryCents,
      primaryCurrency,
    );

  const medianSalary =
    formatCents(
      metrics.medianSalaryCents,
      primaryCurrency,
    );

  return (
    <section
      aria-labelledby="analytics-summary-heading"
      className="space-y-4"
    >
      <div>
        <h2
          id="analytics-summary-heading"
          className="text-base font-semibold text-foreground"
        >
          Compensation overview
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          High-level compensation metrics for
          the selected scope.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Employees"
          value={formatNumber(
            metrics.employeeCount,
          )}
          description="Employees in the selected scope"
          icon={
            <Users
              className="h-5 w-5"
              aria-hidden="true"
            />
          }
        />

        <MetricCard
          label="Salary records"
          value={formatNumber(
            metrics.salaryRecordCount,
          )}
          description="Compensation records available"
          icon={
            <WalletCards
              className="h-5 w-5"
              aria-hidden="true"
            />
          }
        />

        <MetricCard
          label="Average salary"
          value={averageSalary}
          description={
            primaryCurrency
              ? `Reported in ${primaryCurrency}`
              : 'Multiple currencies'
          }
          icon={
            <CircleDollarSign
              className="h-5 w-5"
              aria-hidden="true"
            />
          }
        />

        <MetricCard
          label="Median salary"
          value={medianSalary}
          description={
            primaryCurrency
              ? `Reported in ${primaryCurrency}`
              : 'Multiple currencies'
          }
          icon={
            <Coins
              className="h-5 w-5"
              aria-hidden="true"
            />
          }
        />
      </div>

      {payrollByCurrency.length > 0 && (
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">
              Payroll by currency
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Payroll totals remain separated by
              currency to avoid misleading
              cross-currency aggregation.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <caption className="sr-only">
                Payroll summary by currency
              </caption>

              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <th className="px-5 py-3 font-medium text-muted-foreground">
                    Currency
                  </th>

                  <th className="px-5 py-3 font-medium text-muted-foreground">
                    Employees
                  </th>

                  <th className="px-5 py-3 font-medium text-muted-foreground">
                    Total payroll
                  </th>

                  <th className="px-5 py-3 font-medium text-muted-foreground">
                    Average
                  </th>

                  <th className="px-5 py-3 font-medium text-muted-foreground">
                    Minimum
                  </th>

                  <th className="px-5 py-3 font-medium text-muted-foreground">
                    Maximum
                  </th>
                </tr>
              </thead>

              <tbody>
                {payrollByCurrency.map(
                  (row) => (
                    <tr
                      key={row.currency}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-5 py-3 font-semibold text-foreground">
                        {row.currency.toUpperCase()}
                      </td>

                      <td className="px-5 py-3 text-muted-foreground">
                        {formatNumber(
                          row.employeeCount,
                        )}
                      </td>

                      <td className="px-5 py-3 font-medium text-foreground">
                        {formatCents(
                          row.totalPayrollCents,
                          row.currency,
                        )}
                      </td>

                      <td className="px-5 py-3 text-muted-foreground">
                        {formatCents(
                          row.averageSalaryCents,
                          row.currency,
                        )}
                      </td>

                      <td className="px-5 py-3 text-muted-foreground">
                        {formatCents(
                          row.minimumSalaryCents,
                          row.currency,
                        )}
                      </td>

                      <td className="px-5 py-3 text-muted-foreground">
                        {formatCents(
                          row.maximumSalaryCents,
                          row.currency,
                        )}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}