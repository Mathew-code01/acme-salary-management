// client/src/features/analytics/components/DepartmentAnalysis.tsx
import { Building2, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { useState } from 'react';

import type { DepartmentAnalytics } from '../types/analytics';

import { formatCents, formatNumber } from '../utils/analytics-formatters';

interface DepartmentAnalysisProps {
  data: DepartmentAnalytics;
}

const DISPLAY_LIMIT = 5;

export function DepartmentAnalysis({ data }: DepartmentAnalysisProps) {
  const [showAll, setShowAll] = useState(false);

  const rows = [...data.rows].sort((a, b) => b.employeeCount - a.employeeCount);

  const visibleRows = showAll ? rows : rows.slice(0, DISPLAY_LIMIT);

  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border/70 px-4 py-4 min-[480px]:px-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-foreground">Department analysis</h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Employee and payroll distribution across departments.
            </p>
          </div>
        </div>

        {rows.length > DISPLAY_LIMIT ? (
          <button
            type="button"
            onClick={() => setShowAll((value) => !value)}
            className="inline-flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            {showAll ? 'Show less' : `View all ${rows.length}`}
            {showAll ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <div className="flex min-h-56 items-center justify-center px-5">
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>

            <p className="mt-3 text-sm font-semibold text-foreground">No department data</p>

            <p className="mt-1 text-xs text-muted-foreground">
              No departments match the selected filters.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-sm">
              <caption className="sr-only">Salary analysis by department</caption>

              <thead>
                <tr className="border-b border-border/70 bg-muted/30 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">
                    Department
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">
                    Employees
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">
                    Currency
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">Payroll</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">Average</th>
                </tr>
              </thead>

              <tbody>
                {visibleRows.map((row) => {
                  const payroll = row.totalPayrollByCurrency;

                  return (
                    <tr
                      key={row.department}
                      className="border-b border-border/60 last:border-0 hover:bg-muted/20"
                    >
                      <td className="px-5 py-3.5 font-semibold text-foreground">
                        {row.department}
                      </td>

                      <td className="px-5 py-3.5 text-muted-foreground">
                        {formatNumber(row.employeeCount)}
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {payroll.map((item) => (
                            <span
                              key={item.currency}
                              className="rounded-md bg-muted px-2 py-1 text-[10px] font-bold text-muted-foreground"
                            >
                              {item.currency.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="space-y-1">
                          {payroll.map((item) => (
                            <div key={item.currency} className="font-semibold text-foreground">
                              {formatCents(item.totalPayrollCents, item.currency)}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="space-y-1">
                          {payroll.map((item) => (
                            <div key={item.currency} className="text-muted-foreground">
                              {formatCents(item.averageSalaryCents, item.currency)}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-border/60 sm:hidden">
            {visibleRows.map((row) => {
              const payroll = row.totalPayrollByCurrency;

              return (
                <article key={row.department} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold leading-5 text-foreground">
                      {row.department}
                    </h3>

                    <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-[10px] font-bold text-muted-foreground">
                      {formatNumber(row.employeeCount)}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {payroll.map((item) => (
                      <div
                        key={item.currency}
                        className="rounded-xl border border-border/60 bg-muted/20 p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                            {item.currency.toUpperCase()}
                          </span>

                          <span className="text-xs text-muted-foreground">
                            Avg {formatCents(item.averageSalaryCents, item.currency)}
                          </span>
                        </div>

                        <p className="mt-2 text-sm font-bold text-foreground">
                          {formatCents(item.totalPayrollCents, item.currency)}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}