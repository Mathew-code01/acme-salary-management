// client/src/features/dashboard/components/PayrollSummary.tsx

import { ArrowUpRight, CircleDollarSign, Minus } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../../components/ui/card';

import type { CurrencyPayrollSummary } from '../types/dashboard';

import { formatCountLabel, formatCurrency, formatSalary } from '../utils/dashboard-formatters';

interface PayrollSummaryProps {
  payroll: CurrencyPayrollSummary[];
}

function SalaryMetric({
  label,
  value,
  currency,
}: {
  label: string;
  value: number | null;
  currency: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-foreground">
        {formatSalary(value, currency)}
      </p>
    </div>
  );
}

export function PayrollSummary({ payroll }: PayrollSummaryProps) {
  return (
    <Card className="h-full overflow-hidden rounded-2xl border-border shadow-sm">
      <CardHeader className="border-b border-border/70 pb-5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CircleDollarSign className="h-4 w-4" />
          </span>

          <div className="min-w-0">
            <CardTitle className="text-base sm:text-lg">Payroll by currency</CardTitle>

            <CardDescription className="mt-1.5 leading-5">
              Payroll totals remain separated by currency to prevent invalid cross-currency
              calculations.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {payroll.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
            <div>
              <CircleDollarSign className="mx-auto h-8 w-8 text-muted-foreground/50" />

              <p className="mt-3 text-sm font-semibold">No payroll data</p>

              <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                No salary records match the current dashboard filters.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {payroll.map((item) => (
              <article
                key={item.currency}
                className="rounded-xl border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/40"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md border border-border bg-card px-2.5 py-1 text-xs font-bold tracking-wide text-foreground">
                          {item.currency}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {formatCountLabel(item.employeeCount, 'employee')}
                        </span>
                      </div>

                      <p className="mt-3 break-words text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                        {formatCurrency(item.totalPayrollCents, item.currency)}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">Total payroll</p>
                    </div>

                    <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 sm:flex dark:text-emerald-400">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                    <SalaryMetric
                      label="Average"
                      value={item.averageSalaryCents}
                      currency={item.currency}
                    />

                    <SalaryMetric
                      label="Median"
                      value={item.medianSalaryCents}
                      currency={item.currency}
                    />

                    <SalaryMetric
                      label="Minimum"
                      value={item.minimumSalaryCents}
                      currency={item.currency}
                    />

                    <SalaryMetric
                      label="Maximum"
                      value={item.maximumSalaryCents}
                      currency={item.currency}
                    />
                  </div>

                  <div className="flex items-start gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                    {item.maximumSalaryCents !== null &&
                    item.minimumSalaryCents !== null &&
                    item.maximumSalaryCents > item.minimumSalaryCents ? (
                      <>
                        <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0" />

                        <span className="leading-5">
                          Compensation range:{' '}
                          <span className="font-medium text-foreground">
                            {formatCurrency(item.minimumSalaryCents, item.currency)}
                          </span>{' '}
                          to{' '}
                          <span className="font-medium text-foreground">
                            {formatCurrency(item.maximumSalaryCents, item.currency)}
                          </span>
                        </span>
                      </>
                    ) : (
                      <>
                        <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0" />

                        <span>Compensation range is not available.</span>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}