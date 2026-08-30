// client/src/features/dashboard/components/DepartmentSalaryChart.tsx

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
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Compensation by department</CardTitle>

        <CardDescription>Workforce size and payroll metrics grouped by department.</CardDescription>
      </CardHeader>

      <CardContent>
        {rows.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
            <div>
              <p className="text-sm font-medium">No department data</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Department analytics will appear here when salary records are available.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {rows.map((row) => {
              const employeeWidth = Math.max((row.employeeCount / maxEmployees) * 100, 3);

              return (
                <div key={row.department} className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{row.department}</p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatCountLabel(row.employeeCount, 'employee')}
                      </p>
                    </div>

                    <div className="text-right text-xs text-muted-foreground">
                      {row.totalPayrollByCurrency.length}{' '}
                      {row.totalPayrollByCurrency.length === 1 ? 'currency' : 'currencies'}
                    </div>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{
                        width: `${employeeWidth}%`,
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    {row.totalPayrollByCurrency.map((payroll) => (
                      <div
                        key={`${row.department}-${payroll.currency}`}
                        className="rounded-lg border border-border bg-muted/20 p-3"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-2">
                            <span className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold">
                              {payroll.currency}
                            </span>

                            <span className="text-xs text-muted-foreground">
                              {formatCountLabel(payroll.employeeCount, 'employee')}
                            </span>
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="text-sm font-semibold">
                              {formatCurrency(payroll.totalPayrollCents, payroll.currency)}
                            </p>

                            <p className="text-xs text-muted-foreground">Total payroll</p>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-muted-foreground">Average</p>

                            <p className="mt-1 font-medium">
                              {formatSalary(payroll.averageSalaryCents, payroll.currency)}
                            </p>
                          </div>

                          <div>
                            <p className="text-muted-foreground">Median</p>

                            <p className="mt-1 font-medium">
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