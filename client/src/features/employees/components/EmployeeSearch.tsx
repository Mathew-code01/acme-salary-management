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
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
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
        className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-9 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
      />

      {value ? (
        <button
          type="button"
          aria-label="Clear employee search"
          onClick={() => onChange('')}
          disabled={disabled}
          className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}