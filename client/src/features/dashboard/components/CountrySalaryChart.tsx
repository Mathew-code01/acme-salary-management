// client/src/features/dashboard/components/CountrySalaryChart.tsx

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

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Compensation by country</CardTitle>

        <CardDescription>Workforce distribution and salary metrics by country.</CardDescription>
      </CardHeader>

      <CardContent>
        {rows.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
            <div>
              <p className="text-sm font-medium">No country data</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Country analytics will appear here when salary records are available.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {rows.map((row) => {
              const width = Math.max((row.employeeCount / maxEmployees) * 100, 3);

              const primaryCurrency = row.currencies.length === 1 ? row.currencies[0] : undefined;

              return (
                <div key={row.countryCode} className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{row.countryName}</p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {row.countryCode}
                        {' · '}
                        {formatCountLabel(row.employeeCount, 'employee')}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Average</p>

                      <p className="text-sm font-semibold">
                        {primaryCurrency
                          ? formatSalary(row.averageSalaryCents, primaryCurrency)
                          : 'Multiple currencies'}
                      </p>
                    </div>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary/80 transition-all duration-500"
                      style={{
                        width: `${width}%`,
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                    <div>
                      <p className="text-muted-foreground">Median</p>

                      <p className="mt-1 font-medium">
                        {primaryCurrency
                          ? formatSalary(row.medianSalaryCents, primaryCurrency)
                          : '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Currencies</p>

                      <p className="mt-1 font-medium">{row.currencies.join(', ')}</p>
                    </div>

                    <div className="hidden sm:block">
                      <p className="text-muted-foreground">Share</p>

                      <p className="mt-1 font-medium">
                        {formatPercentage(
                          (row.employeeCount /
                            Math.max(
                              countries.rows.reduce((total, item) => total + item.employeeCount, 0),
                              1,
                            )) *
                            100,
                        )}
                      </p>
                    </div>
                  </div>

                  {primaryCurrency && row.totalPayrollCents > 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Payroll:{' '}
                      <span className="font-medium text-foreground">
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