// client/src/features/dashboard/components/CountrySalaryChart.tsx
import { Globe2, Users } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../../components/ui/card';

import type { CountryAnalytics } from '../types/dashboard';

import {
  formatCountLabel,
  formatCurrency,
  formatPercentage,
  formatSalary,
} from '../utils/dashboard-formatters';

interface CountrySalaryChartProps {
  countries: CountryAnalytics;
}

export function CountrySalaryChart({ countries }: CountrySalaryChartProps) {
  const rows = countries.rows.slice(0, 8);

  const maxEmployees = Math.max(...rows.map((row) => row.employeeCount), 1);

  const totalEmployees = Math.max(
    countries.rows.reduce((total, item) => total + item.employeeCount, 0),
    1,
  );

  return (
    <Card className="h-full overflow-hidden rounded-2xl border-border shadow-sm">
      <CardHeader className="border-b border-border/70 pb-5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Globe2 className="h-4 w-4" />
          </span>

          <div className="min-w-0">
            <CardTitle className="text-base sm:text-lg">Compensation by country</CardTitle>

            <CardDescription className="mt-1.5">
              Workforce distribution and salary metrics by country.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {rows.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
            <div>
              <Globe2 className="mx-auto h-8 w-8 text-muted-foreground/50" />

              <p className="mt-3 text-sm font-semibold">No country data</p>

              <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                Country analytics will appear when salary records are available.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {rows.map((row) => {
              const width = Math.max((row.employeeCount / maxEmployees) * 100, 3);

              const primaryCurrency = row.currencies.length === 1 ? row.currencies[0] : undefined;

              const share = (row.employeeCount / totalEmployees) * 100;

              return (
                <div key={row.countryCode} className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-foreground">
                        {row.countryCode}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {row.countryName}
                        </p>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />

                          {formatCountLabel(row.employeeCount, 'employee')}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        Average
                      </p>

                      <p className="mt-1 text-sm font-bold text-foreground">
                        {primaryCurrency
                          ? formatSalary(row.averageSalaryCents, primaryCurrency)
                          : 'Multiple currencies'}
                      </p>
                    </div>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-600 to-indigo-500 transition-all duration-700"
                      style={{
                        width: `${width}%`,
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs min-[480px]:grid-cols-3">
                    <div className="rounded-lg bg-muted/30 p-2.5">
                      <p className="text-muted-foreground">Median</p>

                      <p className="mt-1 truncate font-semibold text-foreground">
                        {primaryCurrency
                          ? formatSalary(row.medianSalaryCents, primaryCurrency)
                          : '—'}
                      </p>
                    </div>

                    <div className="rounded-lg bg-muted/30 p-2.5">
                      <p className="text-muted-foreground">Currencies</p>

                      <p className="mt-1 truncate font-semibold text-foreground">
                        {row.currencies.join(', ')}
                      </p>
                    </div>

                    <div className="col-span-2 rounded-lg bg-muted/30 p-2.5 min-[480px]:col-span-1">
                      <p className="text-muted-foreground">Workforce share</p>

                      <p className="mt-1 font-semibold text-foreground">
                        {formatPercentage(share)}
                      </p>
                    </div>
                  </div>

                  {primaryCurrency && row.totalPayrollCents > 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Payroll:{' '}
                      <span className="font-semibold text-foreground">
                        {formatCurrency(row.totalPayrollCents, primaryCurrency)}
                      </span>
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}