// client/src/features/dashboard/components/DashboardHeader.tsx

import { RefreshCw, Activity } from 'lucide-react';

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
      description="Monitor workforce compensation, payroll distribution, and salary trends across your organization."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground md:flex">
            <Activity className="h-3.5 w-3.5" />

            <span>{hasFilters ? 'Filtered analytics' : 'Organization-wide analytics'}</span>
          </div>

          {generatedAt ? (
            <span className="hidden text-xs text-muted-foreground lg:inline">
              Updated {formatDateTime(generatedAt)}
            </span>
          ) : null}

          {onRefresh ? (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Refresh dashboard"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />

              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          ) : null}
        </div>
      }
    />
  );
}