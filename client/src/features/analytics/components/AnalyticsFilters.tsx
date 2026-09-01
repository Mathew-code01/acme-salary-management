import { Filter, RotateCcw } from 'lucide-react';

import type { AnalyticsQueryFilters } from '../types/analytics';

interface AnalyticsFiltersProps {
  filters: AnalyticsQueryFilters;
  onChange: <K extends keyof AnalyticsQueryFilters>(
    key: K,
    value: AnalyticsQueryFilters[K],
  ) => void;
  onReset: () => void;
  disabled?: boolean;
}

function hasActiveFilters(filters: AnalyticsQueryFilters): boolean {
  return Object.values(filters).some((value) => value.trim().length > 0);
}

const inputClassName =
  'h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60';

export function AnalyticsFilters({
  filters,
  onChange,
  onReset,
  disabled = false,
}: AnalyticsFiltersProps) {
  const active = hasActiveFilters(filters);

  return (
    <section
      aria-labelledby="analytics-filter-heading"
      className="rounded-xl border border-border bg-card p-4 shadow-sm"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />

          <h2 id="analytics-filter-heading" className="text-sm font-semibold text-foreground">
            Analytics filters
          </h2>
        </div>

        {active && (
          <button
            type="button"
            onClick={onReset}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label
            htmlFor="analytics-country"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Country code
          </label>

          <input
            id="analytics-country"
            value={filters.countryCode}
            onChange={(event) => onChange('countryCode', event.target.value.toUpperCase())}
            placeholder="e.g. NG"
            maxLength={3}
            disabled={disabled}
            autoComplete="off"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="analytics-department"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Department
          </label>

          <input
            id="analytics-department"
            value={filters.department}
            onChange={(event) => onChange('department', event.target.value)}
            placeholder="e.g. Engineering"
            disabled={disabled}
            autoComplete="off"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="analytics-role"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Role
          </label>

          <input
            id="analytics-role"
            value={filters.role}
            onChange={(event) => onChange('role', event.target.value)}
            placeholder="e.g. Developer"
            disabled={disabled}
            autoComplete="off"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="analytics-currency"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Currency
          </label>

          <input
            id="analytics-currency"
            value={filters.currency}
            onChange={(event) => onChange('currency', event.target.value.toUpperCase())}
            placeholder="e.g. USD"
            maxLength={3}
            disabled={disabled}
            autoComplete="off"
            className={inputClassName}
          />
        </div>
      </div>
    </section>
  );
}
