// client/src/features/analytics/components/DepartmentAnalysis.tsx
import {
  Building2,
  Users,
} from 'lucide-react';

import type {
  DepartmentAnalytics,
} from '../types/analytics';

import {
  formatCents,
  formatNumber,
} from '../utils/analytics-formatters';

interface DepartmentAnalysisProps {
  data: DepartmentAnalytics;
}

export function DepartmentAnalysis({
  data,
}: DepartmentAnalysisProps) {
  const rows = [...data.rows].sort(
    (a, b) =>
      b.employeeCount - a.employeeCount,
  );

  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2
              className="h-4 w-4"
              aria-hidden="true"
            />
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground">
              Department analysis
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Employee and payroll distribution
              across departments.
            </p>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="flex min-h-40 items-center justify-center px-5">
          <div className="text-center">
            <Users
              className="mx-auto h-7 w-7 text-muted-foreground"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm font-medium text-foreground">
              No department data
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              No departments match the selected
              filters.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <caption className="sr-only">
              Salary analysis by department
            </caption>

            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="px-5 py-3 font-medium text-muted-foreground">
                  Department
                </th>

                <th className="px-5 py-3 font-medium text-muted-foreground">
                  Employees
                </th>

                <th className="px-5 py-3 font-medium text-muted-foreground">
                  Currency
                </th>

                <th className="px-5 py-3 font-medium text-muted-foreground">
                  Payroll
                </th>

                <th className="px-5 py-3 font-medium text-muted-foreground">
                  Average
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => {
                const payroll =
                  row.totalPayrollByCurrency;

                return (
                  <tr
                    key={row.department}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-5 py-3 font-medium text-foreground">
                      {row.department}
                    </td>

                    <td className="px-5 py-3 text-muted-foreground">
                      {formatNumber(
                        row.employeeCount,
                      )}
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {payroll.map(
                          (item) => (
                            <span
                              key={item.currency}
                              className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                            >
                              {item.currency.toUpperCase()}
                            </span>
                          ),
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      <div className="space-y-1">
                        {payroll.map(
                          (item) => (
                            <div
                              key={item.currency}
                              className="font-medium text-foreground"
                            >
                              {formatCents(
                                item.totalPayrollCents,
                                item.currency,
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      <div className="space-y-1">
                        {payroll.map(
                          (item) => (
                            <div
                              key={item.currency}
                              className="text-muted-foreground"
                            >
                              {formatCents(
                                item.averageSalaryCents,
                                item.currency,
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
