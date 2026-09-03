import { ChevronDown, ChevronUp, Globe2, Users } from 'lucide-react';
import { useState } from 'react';

import type { CountryAnalytics } from '../types/analytics';

import { formatCents, formatNumber, formatPercentage } from '../utils/analytics-formatters';

interface CountryAnalysisProps {
  data: CountryAnalytics;
}

const DISPLAY_LIMIT = 5;

export function CountryAnalysis({ data }: CountryAnalysisProps) {
  const [showAll, setShowAll] = useState(false);

  const rows = [...data.rows].sort((a, b) => b.employeeCount - a.employeeCount);

  const visibleRows = showAll ? rows : rows.slice(0, DISPLAY_LIMIT);

  const totalEmployees = rows.reduce((total, row) => total + row.employeeCount, 0);

  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border/70 px-4 py-4 min-[480px]:px-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Globe2 className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-bold text-foreground">Country analysis</h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Workforce and compensation distribution by location.
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
          <div className="max-w-xs text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>

            <p className="mt-3 text-sm font-semibold text-foreground">No country data</p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              No countries match the selected filters.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-sm">
              <caption className="sr-only">Salary analysis by country</caption>

              <thead>
                <tr className="border-b border-border/70 bg-muted/30 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">Country</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">
                    Employees
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">Share</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">Average</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">
                    Currency
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleRows.map((row) => {
                  const share = totalEmployees > 0 ? (row.employeeCount / totalEmployees) * 100 : 0;

                  const singleCurrency = row.currencies.length === 1 ? row.currencies[0] : null;

                  return (
                    <tr
                      key={row.countryCode}
                      className="border-b border-border/60 last:border-0 hover:bg-muted/20"
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-foreground">{row.countryName}</div>
                        <div className="mt-0.5 text-[11px] font-medium text-muted-foreground">
                          {row.countryCode}
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-muted-foreground">
                        {formatNumber(row.employeeCount)}
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${Math.min(share, 100)}%`,
                              }}
                            />
                          </div>

                          <span className="text-xs text-muted-foreground">
                            {formatPercentage(share)}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 font-semibold text-foreground">
                        {singleCurrency
                          ? formatCents(row.averageSalaryCents, singleCurrency)
                          : 'Multiple'}
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {row.currencies.map((currency) => (
                            <span
                              key={currency}
                              className="rounded-md bg-muted px-2 py-1 text-[10px] font-bold text-muted-foreground"
                            >
                              {currency.toUpperCase()}
                            </span>
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
              const share = totalEmployees > 0 ? (row.employeeCount / totalEmployees) * 100 : 0;

              const singleCurrency = row.currencies.length === 1 ? row.currencies[0] : null;

              return (
                <article key={row.countryCode} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{row.countryName}</h3>

                      <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
                        {row.countryCode}
                      </p>
                    </div>

                    <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                      {formatPercentage(share)}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Employees
                      </p>
                      <p className="mt-1 text-sm font-bold text-foreground">
                        {formatNumber(row.employeeCount)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Average salary
                      </p>
                      <p className="mt-1 text-sm font-bold text-foreground">
                        {singleCurrency
                          ? formatCents(row.averageSalaryCents, singleCurrency)
                          : 'Multiple'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {row.currencies.map((currency) => (
                      <span
                        key={currency}
                        className="rounded-md bg-muted px-2 py-1 text-[10px] font-bold text-muted-foreground"
                      >
                        {currency.toUpperCase()}
                      </span>
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
