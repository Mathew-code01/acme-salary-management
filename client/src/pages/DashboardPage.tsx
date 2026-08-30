// client/src/pages/DashboardPage.tsx

import { AlertCircle, RefreshCw } from 'lucide-react';

import { PageContainer } from '../components/layout/PageContainer';

import { useDocumentTitle } from '../hooks/use-document-title';

import { DashboardHeader } from '../features/dashboard/components/DashboardHeader';

import { OverviewStats } from '../features/dashboard/components/OverviewStats';

import { PayrollSummary } from '../features/dashboard/components/PayrollSummary';

import { SalaryDistributionChart } from '../features/dashboard/components/SalaryDistributionChart';

import { CountrySalaryChart } from '../features/dashboard/components/CountrySalaryChart';

import { DepartmentSalaryChart } from '../features/dashboard/components/DepartmentSalaryChart';

import { useDashboard } from '../features/dashboard/hooks/use-dashboard';

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-xl border border-border bg-muted/40"
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="h-[420px] animate-pulse rounded-xl border border-border bg-muted/40" />

        <div className="h-[420px] animate-pulse rounded-xl border border-border bg-muted/40" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-[520px] animate-pulse rounded-xl border border-border bg-muted/40" />

        <div className="h-[520px] animate-pulse rounded-xl border border-border bg-muted/40" />
      </div>
    </div>
  );
}

function DashboardError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="mt-0.5 rounded-lg bg-destructive/10 p-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-foreground">Unable to load dashboard</h2>

            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{message}</p>

            <p className="mt-2 text-xs text-muted-foreground">
              Check that the API server is running and that the analytics endpoints are available.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  useDocumentTitle('Dashboard');

  const { data, isLoading, isRefreshing, error, generatedAt, refresh } = useDashboard();

  return (
    <PageContainer>
      <DashboardHeader generatedAt={generatedAt} isRefreshing={isRefreshing} onRefresh={refresh} />

      {isLoading && !data ? <DashboardSkeleton /> : null}

      {error && !data ? <DashboardError message={error} onRetry={refresh} /> : null}

      {data ? (
        <div className="space-y-6">
          {error ? (
            <div
              role="status"
              className="flex items-center justify-between gap-4 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertCircle className="h-4 w-4 shrink-0" />

                <span>The dashboard is showing the last successfully loaded data.</span>
              </div>

              <button
                type="button"
                onClick={refresh}
                disabled={isRefreshing}
                className="shrink-0 font-medium text-foreground underline-offset-4 hover:underline disabled:opacity-50"
              >
                Retry
              </button>
            </div>
          ) : null}

          <OverviewStats overview={data.overview} />

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <SalaryDistributionChart distribution={data.distribution} />

            <PayrollSummary payroll={data.overview.payrollByCurrency} />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <CountrySalaryChart countries={data.countries} />

            <DepartmentSalaryChart departments={data.departments} />
          </div>

          <div className="pb-4 text-center text-xs text-muted-foreground">
            Analytics generated from the current compensation dataset.
          </div>
        </div>
      ) : null}
    </PageContainer>
  );
}