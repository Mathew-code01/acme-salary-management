
// client/src/features/employees/components/EmployeeRow.tsx
import { BriefcaseBusiness, Building2, Globe2, Mail } from 'lucide-react';

import type { Employee } from '../types/employee';

import { formatEmployeeStatus } from '../utils/employee-formatters';

import { EmployeeActions } from './EmployeeActions';

interface EmployeeRowProps {
  employee: Employee;
}

function EmployeeRow({ employee }: EmployeeRowProps) {
  const isActive = employee.status === 'ACTIVE';

  const initials = `${employee.firstName?.[0] ?? ''}${employee.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <tr className="group border-b border-border/70 transition-colors last:border-0 hover:bg-primary/[0.025]">
      {/* Employee */}
      <td className="px-4 py-4 sm:px-5">
        <div className="flex min-w-[220px] items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            {initials || '—'}
          </div>

          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-foreground">
              {employee.fullName}
            </div>

            <div className="mt-0.5 truncate text-xs text-muted-foreground">
              {employee.employeeCode}
            </div>
          </div>
        </div>
      </td>

      {/* Email */}
      <td className="px-4 py-4 sm:px-5">
        <div className="flex min-w-[220px] items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />

          <span className="truncate">{employee.email}</span>
        </div>
      </td>

      {/* Country */}
      <td className="px-4 py-4 sm:px-5">
        <div className="flex min-w-[130px] items-center gap-2 text-sm text-foreground">
          <Globe2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />

          <span className="truncate">{employee.countryName ?? '—'}</span>
        </div>
      </td>

      {/* Department */}
      <td className="px-4 py-4 sm:px-5">
        <div className="flex min-w-[150px] items-center gap-2 text-sm text-foreground">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />

          <span className="truncate">{employee.departmentName ?? '—'}</span>
        </div>
      </td>

      {/* Role */}
      <td className="px-4 py-4 sm:px-5">
        <div className="flex min-w-[170px] items-center gap-2 text-sm text-foreground">
          <BriefcaseBusiness
            className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />

          <span className="truncate">{employee.roleName ?? '—'}</span>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-4 sm:px-5">
        <span
          className={
            isActive
              ? 'inline-flex items-center gap-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400'
              : 'inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-semibold text-muted-foreground'
          }
        >
          <span
            className={
              isActive
                ? 'h-1.5 w-1.5 rounded-full bg-emerald-500'
                : 'h-1.5 w-1.5 rounded-full bg-muted-foreground'
            }
            aria-hidden="true"
          />

          {formatEmployeeStatus(employee.status)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-4 sm:px-5">
        <EmployeeActions employeeId={employee.id} />
      </td>
    </tr>
  );
}

export default EmployeeRow;