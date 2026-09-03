import { Filter, RotateCcw, Search, X } from 'lucide-react';

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
  'h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60';

interface FilterInputProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  disabled: boolean;
  maxLength?: number;
}

function FilterInput({
  id,
  label,
  value,
  placeholder,
  onChange,
  disabled,
  maxLength,
}: FilterInputProps) {
  const hasValue = value.trim().length > 0;

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-foreground">
        {label}
      </label>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />

        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          autoComplete="off"
          className={`${inputClassName} pl-9 ${hasValue ? 'pr-9' : ''}`}
        />

        {hasValue ? (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            aria-label={`Clear ${label}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

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
      className="rounded-2xl border border-border/70 bg-card shadow-sm"
    >
      <div className="flex flex-col gap-3 border-b border-border/70 px-4 py-4 min-[480px]:px-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Filter className="h-4 w-4" />
          </div>

          <div>
            <h2 id="analytics-filter-heading" className="text-sm font-semibold text-foreground">
              Filter analytics
            </h2>

            <p className="mt-0.5 text-xs text-muted-foreground">Narrow the reporting scope</p>
          </div>
        </div>

        {active ? (
          <button
            type="button"
            onClick={onReset}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 self-start rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50 sm:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset filters
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 min-[480px]:p-5 sm:grid-cols-2 xl:grid-cols-4">
        <FilterInput
          id="analytics-country"
          label="Country"
          value={filters.countryCode}
          onChange={(value) => onChange('countryCode', value.toUpperCase())}
          placeholder="e.g. NG"
          maxLength={3}
          disabled={disabled}
        />

        <FilterInput
          id="analytics-department"
          label="Department"
          value={filters.department}
          onChange={(value) => onChange('department', value)}
          placeholder="e.g. Engineering"
          disabled={disabled}
        />

        <FilterInput
          id="analytics-role"
          label="Role"
          value={filters.role}
          onChange={(value) => onChange('role', value)}
          placeholder="e.g. Software Engineer"
          disabled={disabled}
        />

        <FilterInput
          id="analytics-currency"
          label="Currency"
          value={filters.currency}
          onChange={(value) => onChange('currency', value.toUpperCase())}
          placeholder="e.g. USD"
          maxLength={3}
          disabled={disabled}
        />
      </div>
    </section>
  );
}
