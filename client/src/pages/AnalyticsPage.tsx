// client/src/pages/AnalyticsPage.tsx


import {
  AlertCircle,
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map(
          (item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl border border-border bg-muted/50"
            />
          ),
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="h-96 animate-pulse rounded-xl border border-border bg-muted/50" />

        <div className="h-96 animate-pulse rounded-xl border border-border bg-muted/50" />
      </div>

      <div className="h-96 animate-pulse rounded-xl border border-border bg-muted/50" />
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
      className="rounded-xl border border-destructive/20 bg-destructive/5 p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <AlertCircle
            className="mt-0.5 h-5 w-5 shrink-0 text-destructive"
            aria-hidden="true"
          />

          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Unable to load analytics
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {message}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
    <main className="mx-auto w-full max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
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
          {error && (
            <div
              role="status"
              className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-700 dark:text-amber-400"
            >
              {error}
            </div>
          )}

          <AnalyticsSummary
            overview={data.overview}
          />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <SalaryDistribution
              distribution={data.distribution}
            />

            <CountryAnalysis
              data={data.countries}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <DepartmentAnalysis
              data={data.departments}
            />

            <RoleAnalysis
              data={data.roles}
            />
          </div>

          <footer className="flex flex-col gap-1 border-t border-border pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              Analytics generated:{' '}
              {formatDateTime(
                data.generatedAt,
              )}
            </span>

            {refreshing && (
              <span className="inline-flex items-center gap-1.5">
                <RefreshCw
                  className="h-3.5 w-3.5 animate-spin"
                  aria-hidden="true"
                />

                Updating analytics…
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
    </main>
  );
}
