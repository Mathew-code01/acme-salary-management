// client/src/features/employees/components/EmployeeActions.tsx

import { Eye } from 'lucide-react';

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
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/30"
      >
        <Eye className="h-3.5 w-3.5" aria-hidden="true" />

        <span>View</span>
      </Link>
    </div>
  );
}