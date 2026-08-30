// client/src/features/dashboard/components/PayrollSummary.tsx

import {  ArrowUp, Minus } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="text-sm font-medium text-foreground">{formatSalary(value, currency)}</p>
    </div>
  );
}

export function PayrollSummary({ payroll }: PayrollSummaryProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Payroll by currency</CardTitle>

        <CardDescription>
          Compensation totals are kept separate by currency to avoid invalid cross-currency
          calculations.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {payroll.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
            <div>
              <p className="text-sm font-medium">No payroll data</p>

              <p className="mt-1 text-xs text-muted-foreground">
                No salary records match the current dashboard filters.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {payroll.map((item) => (
              <div key={item.currency} className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold tracking-wide">
                        {item.currency}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {formatCountLabel(item.employeeCount, 'employee')}
                      </span>
                    </div>

                    <p className="mt-3 text-xl font-semibold tracking-tight">
                      {formatCurrency(item.totalPayrollCents, item.currency)}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">Total payroll</p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:text-right">
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
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                  {item.maximumSalaryCents !== null &&
                  item.minimumSalaryCents !== null &&
                  item.maximumSalaryCents > item.minimumSalaryCents ? (
                    <>
                      <ArrowUp className="h-3.5 w-3.5" />
                      <span>
                        Compensation range: {formatCurrency(item.minimumSalaryCents, item.currency)}{' '}
                        to {formatCurrency(item.maximumSalaryCents, item.currency)}
                      </span>
                    </>
                  ) : (
                    <>
                      <Minus className="h-3.5 w-3.5" />
                      <span>Compensation range is not available.</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}