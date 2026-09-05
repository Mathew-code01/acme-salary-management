// client/src/features/dashboard/components/DashboardHeader.tsx
import { CalendarClock, RefreshCw, ShieldCheck } from 'lucide-react';

import { PageHeader } from '../../../components/layout/PageHeader';

import type { DashboardFilters } from '../types/dashboard';

import { formatDateTime } from '../utils/dashboard-formatters';

interface DashboardHeaderProps {
  filters?: DashboardFilters;
  generatedAt?: string | null;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

export function DashboardHeader({
  filters,
  generatedAt,
  isRefreshing = false,
  onRefresh,
}: DashboardHeaderProps) {
  const hasFilters =
    Boolean(filters?.countryCode) ||
    Boolean(filters?.department) ||
    Boolean(filters?.role) ||
    Boolean(filters?.currency);

  return (
    <PageHeader
      title="Compensation Dashboard"
      description="A real-time view of workforce compensation, payroll distribution, and salary intelligence."
      actions={
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </span>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">
                {hasFilters ? 'Filtered view' : 'Organization-wide'}
              </p>

              <p className="truncate text-[11px] text-muted-foreground">Compensation analytics</p>
            </div>
          </div>

          {generatedAt ? (
            <div className="hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm lg:flex">
              <CalendarClock className="h-4 w-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Last updated
                </p>

                <p className="text-xs font-medium text-foreground">{formatDateTime(generatedAt)}</p>
              </div>
            </div>
          ) : null}

          {onRefresh ? (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Refresh dashboard analytics"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />

              <span>{isRefreshing ? 'Refreshing…' : 'Refresh data'}</span>
            </button>
          ) : null}
        </div>
      }
    />
  );
}