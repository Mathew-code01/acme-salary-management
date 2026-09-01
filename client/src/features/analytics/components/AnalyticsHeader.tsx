import { BarChart3, RefreshCw } from 'lucide-react';

interface AnalyticsHeaderProps {
  refreshing: boolean;
  onRefresh: () => void;
}

export function AnalyticsHeader({ refreshing, onRefresh }: AnalyticsHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <BarChart3 className="h-5 w-5" aria-hidden="true" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Compensation Analytics
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Understand salary distribution and compensation patterns across your organization.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Refresh analytics"
      >
        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />

        {refreshing ? 'Refreshing…' : 'Refresh'}
      </button>
    </header>
  );
}
