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
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" aria-hidden="true" />
        <span>Loading employee records...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Users className="h-4 w-4" aria-hidden="true" />

      <span>
        <span className="font-medium text-foreground">{formatEmployeeCount(pagination.total)}</span>{' '}
        {pagination.total === 1 ? 'employee' : 'employees'}
      </span>
    </div>
  );
}