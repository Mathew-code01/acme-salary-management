
import {
  Globe2,
  Users,
} from 'lucide-react';

import type {
  CountryAnalytics,
} from '../types/analytics';

import {
  formatCents,
  formatNumber,
  formatPercentage,
} from '../utils/analytics-formatters';

interface CountryAnalysisProps {
  data: CountryAnalytics;
}

export function CountryAnalysis({
  data,
}: CountryAnalysisProps) {
  const rows = [...data.rows].sort(
    (a, b) =>
      b.employeeCount - a.employeeCount,
  );

  const totalEmployees = rows.reduce(
    (total, row) =>
      total + row.employeeCount,
    0,
  );

  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Globe2
              className="h-4 w-4"
              aria-hidden="true"
            />
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground">
              Country analysis
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Compensation distribution by employee
              location.
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
              No country data
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              No countries match the selected
              filters.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <caption className="sr-only">
              Salary analysis by country
            </caption>

            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="px-5 py-3 font-medium text-muted-foreground">
                  Country
                </th>

                <th className="px-5 py-3 font-medium text-muted-foreground">
                  Employees
                </th>

                <th className="px-5 py-3 font-medium text-muted-foreground">
                  Share
                </th>

                <th className="px-5 py-3 font-medium text-muted-foreground">
                  Average
                </th>

                <th className="px-5 py-3 font-medium text-muted-foreground">
                  Median
                </th>

                <th className="px-5 py-3 font-medium text-muted-foreground">
                  Currencies
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => {
                const share =
                  totalEmployees > 0
                    ? (row.employeeCount /
                        totalEmployees) *
                      100
                    : 0;

                const singleCurrency =
                  row.currencies.length === 1
                    ? row.currencies[0]
                    : null;

                return (
                  <tr
                    key={row.countryCode}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium text-foreground">
                        {row.countryName}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {row.countryCode}
                      </div>
                    </td>

                    <td className="px-5 py-3 text-muted-foreground">
                      {formatNumber(
                        row.employeeCount,
                      )}
                    </td>

                    <td className="px-5 py-3 text-muted-foreground">
                      {formatPercentage(share)}
                    </td>

                    <td className="px-5 py-3 font-medium text-foreground">
                      {singleCurrency
                        ? formatCents(
                            row.averageSalaryCents,
                            singleCurrency,
                          )
                        : 'Multiple'}
                    </td>

                    <td className="px-5 py-3 text-muted-foreground">
                      {singleCurrency
                        ? formatCents(
                            row.medianSalaryCents,
                            singleCurrency,
                          )
                        : 'Multiple'}
                    </td>

                    <td className="px-5 py-3">
                      {row.currencies.length >
                      0 ? (
                        <div className="flex flex-wrap gap-1">
                          {row.currencies.map(
                            (currency) => (
                              <span
                                key={currency}
                                className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                              >
                                {currency.toUpperCase()}
                              </span>
                            ),
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          —
                        </span>
                      )}
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
