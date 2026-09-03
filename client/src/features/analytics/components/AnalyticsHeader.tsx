import { BarChart3, RefreshCw, Sparkles } from 'lucide-react';

interface AnalyticsHeaderProps {
  refreshing: boolean;
  onRefresh: () => void;
}

export function AnalyticsHeader({ refreshing, onRefresh }: AnalyticsHeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent" />

      <div className="relative flex flex-col gap-5 p-5 min-[480px]:p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm sm:h-12 sm:w-12">
            <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />

            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-card bg-card">
              <Sparkles className="h-2.5 w-2.5 text-primary" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                Intelligence
              </span>

              <span className="hidden text-xs text-muted-foreground min-[480px]:inline">
                Compensation management
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-foreground min-[480px]:text-2xl sm:text-3xl">
              Compensation Analytics
            </h1>

            <p className="mt-1.5 max-w-2xl text-xs leading-5 text-muted-foreground min-[480px]:text-sm sm:leading-6">
              Understand how ACME compensates its workforce across countries, departments, roles,
              and currencies.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60 min-[480px]:w-auto"
          aria-label="Refresh analytics"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />

          {refreshing ? 'Refreshing…' : 'Refresh data'}
        </button>
      </div>
    </header>
  );
}
