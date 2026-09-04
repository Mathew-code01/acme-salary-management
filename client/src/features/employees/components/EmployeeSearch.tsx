// client/src/features/employees/components/EmployeeSearch.tsx

import { Search, X } from 'lucide-react';

interface EmployeeSearchProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function EmployeeSearch({ value, onChange, disabled = false }: EmployeeSearchProps) {
  return (
    <div className="relative w-full">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:h-[18px] sm:w-[18px]"
      />

      <label htmlFor="employee-search" className="sr-only">
        Search employees
      </label>

      <input
        id="employee-search"
        type="search"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by name, email or employee ID..."
        autoComplete="off"
        spellCheck={false}
        className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-10 text-sm text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground hover:border-foreground/20 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12"
      />

      {value ? (
        <button
          type="button"
          aria-label="Clear employee search"
          onClick={() => onChange('')}
          disabled={disabled}
          className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-50"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}