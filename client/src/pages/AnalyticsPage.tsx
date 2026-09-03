// client/src/pages/AnalyticsPage.tsx

import {
  AlertCircle,
  BarChart3,
  RefreshCw,
} from 'lucide-react';

import { AnalyticsHeader } from '../features/analytics/components/AnalyticsHeader';
import { AnalyticsFilters } from '../features/analytics/components/AnalyticsFilters';
import { AnalyticsSummary } from '../features/analytics/components/AnalyticsSummary';
import { SalaryDistribution } from '../features/analytics/components/SalaryDistribution';
import { CountryAnalysis } from '../features/analytics/components/CountryAnalysis';
import { DepartmentAnalysis } from '../features/analytics/components/DepartmentAnalysis';
import { RoleAnalysis } from '../features/analytics/components/RoleAnalysis';

import { useAnalytics } from '../features/analytics/hooks/use-analytics';
import { formatDateTime } from '../features/analytics/utils/analytics-formatters';

function AnalyticsLoadingState() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="Loading analytics"
    >
      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[132px] animate-pulse rounded-2xl border border-border/70 bg-card"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="h-[420px] animate-pulse rounded-2xl border border-border/70 bg-card" />
        <div className="h-[420px] animate-pulse rounded-2xl border border-border/70 bg-card" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="h-[480px] animate-pulse rounded-2xl border border-border/70 bg-card" />
        <div className="h-[480px] animate-pulse rounded-2xl border border-border/70 bg-card" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="h-[480px] animate-pulse rounded-2xl border border-border/70 bg-card" />
        <div className="h-[480px] animate-pulse rounded-2xl border border-border/70 bg-card" />
      </div>
    </div>
  );
}

interface AnalyticsErrorStateProps {
  message: string;
  onRetry: () => void;
}

function AnalyticsErrorState({
  message,
  onRetry,
}: AnalyticsErrorStateProps) {
  return (
    <section
      role="alert"
      className="overflow-hidden rounded-2xl border border-destructive/20 bg-card shadow-sm"
    >
      <div className="flex flex-col gap-5 p-5 min-[480px]:p-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertCircle
              className="h-5 w-5"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground">
              Unable to load analytics
            </h2>

            <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">
              {message}
            </p>

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Please check the API connection and try again.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 min-[480px]:w-auto"
        >
          <RefreshCw
            className="h-4 w-4"
            aria-hidden="true"
          />
          Try again
        </button>
      </div>
    </section>
  );
}

export default function AnalyticsPage() {
  const {
    data,
    loading,
    refreshing,
    error,
    filters,
    updateFilter,
    resetFilters,
    reload,
  } = useAnalytics();

  return (
    <main className="min-h-full w-full">
      <div className="mx-auto w-full max-w-[1680px] px-3 py-4 min-[480px]:px-4 min-[480px]:py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="space-y-5 sm:space-y-6">
          <AnalyticsHeader
            refreshing={refreshing}
            onRefresh={() => {
              void reload();
            }}
          />

          <AnalyticsFilters
            filters={filters}
            onChange={updateFilter}
            onReset={resetFilters}
            disabled={refreshing}
          />

          {loading && !data ? (
            <AnalyticsLoadingState />
          ) : error && !data ? (
            <AnalyticsErrorState
              message={error}
              onRetry={() => {
                void reload();
              }}
            />
          ) : data ? (
            <>
              {error ? (
                <div
                  role="status"
                  className="flex flex-col gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="leading-5">
                      Showing the last successfully loaded analytics data.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => void reload()}
                    disabled={refreshing}
                    className="w-fit text-left text-sm font-semibold text-amber-900 underline-offset-4 hover:underline disabled:opacity-50 dark:text-amber-200"
                  >
                    Retry
                  </button>
                </div>
              ) : null}

              <AnalyticsSummary overview={data.overview} />

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                <SalaryDistribution
                  distribution={data.distribution}
                />

                <CountryAnalysis
                  data={data.countries}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <DepartmentAnalysis
                  data={data.departments}
                />

                <RoleAnalysis
                  data={data.roles}
                />
              </div>

              <footer className="flex flex-col gap-2 border-t border-border/70 pt-4 text-xs text-muted-foreground min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>
                    Analytics generated {formatDateTime(data.generatedAt)}
                  </span>
                </div>

                {refreshing ? (
                  <span className="inline-flex items-center gap-1.5">
                    <RefreshCw
                      className="h-3.5 w-3.5 animate-spin"
                      aria-hidden="true"
                    />
                    Updating analytics…
                  </span>
                ) : (
                  <span>
                    Data reflects the current compensation scope
                  </span>
                )}
              </footer>
            </>
          ) : (
            <AnalyticsErrorState
              message="No analytics data is currently available."
              onRetry={() => {
                void reload();
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}