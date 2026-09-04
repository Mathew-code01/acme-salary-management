// client/src/features/employees/components/EmployeeSummary.tsx
import { Users } from 'lucide-react';

import type { EmployeePagination } from '../types/employee';

import { formatEmployeeCount } from '../utils/employee-formatters';

interface EmployeeSummaryProps {
  pagination: EmployeePagination | null;
}

export function EmployeeSummary({ pagination }: EmployeeSummaryProps) {
  if (!pagination) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground sm:text-sm"
      >
        <Users className="h-4 w-4" aria-hidden="true" />
        <span>Loading employee records...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground sm:text-sm">
      <span className="inline-flex items-center gap-1.5">
        <Users className="h-4 w-4" aria-hidden="true" />

        <span>
          <span className="font-semibold text-foreground">
            {formatEmployeeCount(pagination.total)}
          </span>{' '}
          {pagination.total === 1 ? 'employee' : 'employees'}
        </span>
      </span>

      {pagination.totalPages > 0 ? (
        <>
          <span className="text-border">•</span>

          <span>
            Page <span className="font-medium text-foreground">{pagination.page}</span> of{' '}
            <span className="font-medium text-foreground">{pagination.totalPages}</span>
          </span>
        </>
      ) : null}
    </div>
  );
}