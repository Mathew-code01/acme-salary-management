// client/src/pages/DashboardPage.tsx

import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

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
      {/* Executive metrics */}
      <section className="space-y-5">
        <div className="space-y-2">
          <div className="h-3 w-28 animate-pulse rounded bg-muted" />
          <div className="h-7 w-56 animate-pulse rounded bg-muted" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
        </div>

        <div className="grid gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-2xl border border-border bg-card"
            />
          ))}
        </div>
      </section>

      {/* Main analytics */}
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="h-[480px] animate-pulse rounded-2xl border border-border bg-card" />

        <div className="h-[480px] animate-pulse rounded-2xl border border-border bg-card" />
      </div>

      {/* Secondary analytics */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-[560px] animate-pulse rounded-2xl border border-border bg-card" />

        <div className="h-[560px] animate-pulse rounded-2xl border border-border bg-card" />
      </div>
    </div>
  );
}

function DashboardError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="overflow-hidden rounded-2xl border border-rose-500/20 bg-card shadow-sm"
    >
      <div className="border-l-4 border-rose-500 p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold text-foreground">Unable to load dashboard</h2>

              <p className="mt-1.5 break-words text-sm leading-6 text-muted-foreground">
                {message}
              </p>

              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Check that the API server is running and that the analytics endpoints are available.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  useDocumentTitle('Dashboard');

  const { data, isLoading, isRefreshing, error, generatedAt, refresh } = useDashboard();

  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-[1600px] space-y-6 pb-6">
        <DashboardHeader
          generatedAt={generatedAt}
          isRefreshing={isRefreshing}
          onRefresh={refresh}
        />

        {isLoading && !data ? <DashboardSkeleton /> : null}

        {error && !data ? <DashboardError message={error} onRetry={refresh} /> : null}

        {data ? (
          <>
            {error ? (
              <div
                role="status"
                className="flex flex-col gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-2.5">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />

                  <span className="text-xs leading-5 text-muted-foreground sm:text-sm">
                    The dashboard is showing the last successfully loaded data.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={refresh}
                  disabled={isRefreshing}
                  className="self-start text-xs font-semibold text-foreground underline-offset-4 hover:underline disabled:opacity-50 sm:self-auto"
                >
                  Retry
                </button>
              </div>
            ) : null}

            {/* =====================================================
                SECTION 1 — Executive overview
                ===================================================== */}

            <OverviewStats overview={data.overview} />

            {/* =====================================================
                SECTION 2 — Compensation intelligence
                ===================================================== */}

            <section aria-labelledby="compensation-intelligence-heading" className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />

                <h2
                  id="compensation-intelligence-heading"
                  className="text-sm font-semibold text-foreground"
                >
                  Compensation intelligence
                </h2>

                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <SalaryDistributionChart distribution={data.distribution} />

                <PayrollSummary payroll={data.overview.payrollByCurrency} />
              </div>
            </section>

            {/* =====================================================
                SECTION 3 — Workforce analysis
                ===================================================== */}

            <section aria-labelledby="workforce-analysis-heading" className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />

                <h2
                  id="workforce-analysis-heading"
                  className="text-sm font-semibold text-foreground"
                >
                  Workforce analysis
                </h2>

                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <CountrySalaryChart countries={data.countries} />

                <DepartmentSalaryChart departments={data.departments} />
              </div>
            </section>

            {/* =====================================================
                Footer
                ===================================================== */}

            <footer className="flex flex-col gap-2 border-t border-border pt-5 text-center text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <span>Analytics generated from the current compensation dataset.</span>

              <span>ACME Salary Management</span>
            </footer>
          </>
        ) : null}
      </div>
    </PageContainer>
  );
}