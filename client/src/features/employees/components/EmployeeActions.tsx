// client/src/features/employees/components/EmployeeActions.tsx
import { ArrowUpRight, Eye } from 'lucide-react';

import { Link } from 'react-router-dom';

interface EmployeeActionsProps {
  employeeId: number;
}

export function EmployeeActions({ employeeId }: EmployeeActionsProps) {
  return (
    <div className="flex justify-end">
      <Link
        to={`/employees/${employeeId}`}
        aria-label="View employee details"
        className="group inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
      >
        <Eye className="h-3.5 w-3.5" aria-hidden="true" />

        <span>View</span>

        <ArrowUpRight
          className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}