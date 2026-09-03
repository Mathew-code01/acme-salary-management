// client/src/features/analytics/components/AnalyticsSummary.tsx
import type { ReactNode } from 'react';

import { CircleDollarSign, Coins, TrendingUp, Users, WalletCards } from 'lucide-react';

import type { AnalyticsOverview } from '../types/analytics';

import { formatCents, formatNumber, getSummaryCurrency } from '../utils/analytics-formatters';

interface AnalyticsSummaryProps {
  overview: AnalyticsOverview;
}

interface MetricCardProps {
  label: string;
  value: string;
  description: string;
  icon: ReactNode;
  accent?: 'primary' | 'success' | 'neutral';
}

function MetricCard({ label, value, description, icon, accent = 'primary' }: MetricCardProps) {
  const accentClass =
    accent === 'success'
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
      : accent === 'neutral'
        ? 'bg-slate-500/10 text-slate-600 dark:text-slate-300'
        : 'bg-primary/10 text-primary';

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md min-[480px]:p-5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {label}
          </p>

          <p className="mt-2 truncate text-2xl font-bold tracking-tight text-foreground min-[480px]:text-[28px]">
            {value}
          </p>

          <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{description}</p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentClass}`}
        >
          {icon}
        </div>
      </div>
    </article>
  );
}

export function AnalyticsSummary({ overview }: AnalyticsSummaryProps) {
  const { metrics, payrollByCurrency } = overview;

  const primaryCurrency = getSummaryCurrency(metrics.currencies, payrollByCurrency);

  const averageSalary = formatCents(metrics.averageSalaryCents, primaryCurrency);

  const medianSalary = formatCents(metrics.medianSalaryCents, primaryCurrency);

  const displayedPayroll = payrollByCurrency.slice(0, 6);
  const hasMorePayroll = payrollByCurrency.length > 6;

  return (
    <section aria-labelledby="analytics-summary-heading" className="space-y-4">
      <div className="flex flex-col gap-1 min-[480px]:flex-row min-[480px]:items-end min-[480px]:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />

            <h2 id="analytics-summary-heading" className="text-base font-bold text-foreground">
              Compensation overview
            </h2>
          </div>

          <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
            High-level compensation metrics for the selected scope.
          </p>
        </div>

        <span className="text-xs text-muted-foreground">
          {metrics.employeeCount.toLocaleString()} employees analyzed
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Employees"
          value={formatNumber(metrics.employeeCount)}
          description="Employees in selected scope"
          icon={<Users className="h-5 w-5" />}
          accent="primary"
        />

        <MetricCard
          label="Salary records"
          value={formatNumber(metrics.salaryRecordCount)}
          description="Compensation records available"
          icon={<WalletCards className="h-5 w-5" />}
          accent="neutral"
        />

        <MetricCard
          label="Average salary"
          value={averageSalary}
          description={primaryCurrency ? `Reported in ${primaryCurrency}` : 'Multiple currencies'}
          icon={<CircleDollarSign className="h-5 w-5" />}
          accent="success"
        />

        <MetricCard
          label="Median salary"
          value={medianSalary}
          description={primaryCurrency ? `Reported in ${primaryCurrency}` : 'Multiple currencies'}
          icon={<Coins className="h-5 w-5" />}
          accent="primary"
        />
      </div>

      {payrollByCurrency.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
          <div className="flex flex-col gap-2 border-b border-border/70 px-4 py-4 min-[480px]:px-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Payroll by currency</h3>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
                Totals remain separated by currency to avoid misleading cross-currency aggregation.
              </p>
            </div>

            {hasMorePayroll ? (
              <span className="w-fit rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                Showing top 6
              </span>
            ) : null}
          </div>

          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-sm">
              <caption className="sr-only">Payroll summary by currency</caption>

              <thead>
                <tr className="border-b border-border/70 bg-muted/30 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">
                    Currency
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">
                    Employees
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">
                    Total payroll
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">Average</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">Range</th>
                </tr>
              </thead>

              <tbody>
                {displayedPayroll.map((row) => (
                  <tr
                    key={row.currency}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/20"
                  >
                    <td className="px-5 py-3.5">
                      <span className="inline-flex rounded-lg bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                        {row.currency.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-muted-foreground">
                      {formatNumber(row.employeeCount)}
                    </td>

                    <td className="px-5 py-3.5 font-semibold text-foreground">
                      {formatCents(row.totalPayrollCents, row.currency)}
                    </td>

                    <td className="px-5 py-3.5 text-muted-foreground">
                      {formatCents(row.averageSalaryCents, row.currency)}
                    </td>

                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      {formatCents(row.minimumSalaryCents, row.currency)} –{' '}
                      {formatCents(row.maximumSalaryCents, row.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-border/60 sm:hidden">
            {displayedPayroll.map((row) => (
              <div key={row.currency} className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-lg bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                    {row.currency.toUpperCase()}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {formatNumber(row.employeeCount)} employees
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Payroll
                    </p>
                    <p className="mt-1 text-sm font-bold text-foreground">
                      {formatCents(row.totalPayrollCents, row.currency)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Average
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatCents(row.averageSalaryCents, row.currency)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}