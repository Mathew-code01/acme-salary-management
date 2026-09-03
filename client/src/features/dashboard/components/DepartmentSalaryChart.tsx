// client/src/features/dashboard/components/DepartmentSalaryChart.tsx

import { BriefcaseBusiness, Users } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../../components/ui/card';

import type { DepartmentAnalytics } from '../types/dashboard';

import { formatCountLabel, formatCurrency, formatSalary } from '../utils/dashboard-formatters';

interface DepartmentSalaryChartProps {
  departments: DepartmentAnalytics;
}

export function DepartmentSalaryChart({ departments }: DepartmentSalaryChartProps) {
  const rows = departments.rows.slice(0, 8);

  const maxEmployees = Math.max(...rows.map((row) => row.employeeCount), 1);

  return (
    <Card className="h-full overflow-hidden rounded-2xl border-border shadow-sm">
      <CardHeader className="border-b border-border/70 pb-5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <BriefcaseBusiness className="h-4 w-4" />
          </span>

          <div className="min-w-0">
            <CardTitle className="text-base sm:text-lg">Compensation by department</CardTitle>

            <CardDescription className="mt-1.5">
              Workforce size and payroll metrics grouped by department.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {rows.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
            <div>
              <BriefcaseBusiness className="mx-auto h-8 w-8 text-muted-foreground/50" />

              <p className="mt-3 text-sm font-semibold">No department data</p>

              <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                Department analytics will appear when salary records are available.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {rows.map((row) => {
              const employeeWidth = Math.max((row.employeeCount / maxEmployees) * 100, 3);

              return (
                <div key={row.department} className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {row.department}
                      </p>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />

                        {formatCountLabel(row.employeeCount, 'employee')}
                      </div>
                    </div>

                    <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                      {row.totalPayrollByCurrency.length}{' '}
                      {row.totalPayrollByCurrency.length === 1 ? 'currency' : 'currencies'}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-700"
                      style={{
                        width: `${employeeWidth}%`,
                      }}
                    />
                  </div>

                  <div className="space-y-2.5">
                    {row.totalPayrollByCurrency.map((payroll) => (
                      <div
                        key={`${row.department}-${payroll.currency}`}
                        className="rounded-xl border border-border bg-muted/20 p-3.5 transition-colors hover:bg-muted/40"
                      >
                        <div className="flex flex-col gap-3 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span className="rounded-md border border-border bg-card px-2 py-1 text-[11px] font-bold tracking-wide">
                              {payroll.currency}
                            </span>

                            <span className="truncate text-xs text-muted-foreground">
                              {formatCountLabel(payroll.employeeCount, 'employee')}
                            </span>
                          </div>

                          <div className="min-w-0 min-[480px]:text-right">
                            <p className="truncate text-sm font-bold text-foreground">
                              {formatCurrency(payroll.totalPayrollCents, payroll.currency)}
                            </p>

                            <p className="text-[11px] text-muted-foreground">Total payroll</p>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3">
                          <div>
                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                              Average
                            </p>

                            <p className="mt-1 truncate text-xs font-semibold text-foreground">
                              {formatSalary(payroll.averageSalaryCents, payroll.currency)}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                              Median
                            </p>

                            <p className="mt-1 truncate text-xs font-semibold text-foreground">
                              {formatSalary(payroll.medianSalaryCents, payroll.currency)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}