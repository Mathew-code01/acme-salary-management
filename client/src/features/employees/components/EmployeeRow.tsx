
// client/src/features/employees/components/EmployeeRow.tsx

import type { Employee } from "../types/employee";

import {
  formatEmployeeStatus,
} from "../utils/employee-formatters";

import { EmployeeActions } from "./EmployeeActions";

interface EmployeeRowProps {
  employee: Employee;
}

function EmployeeRow({
  employee,
}: EmployeeRowProps) {
  const isActive = employee.status === "ACTIVE";

  return (
    <tr className="border-b border-border transition-colors last:border-0 hover:bg-muted/30">
      <td className="whitespace-nowrap px-4 py-4">
        <div className="font-medium text-foreground">
          {employee.fullName}
        </div>

        <div className="mt-0.5 text-xs text-muted-foreground">
          {employee.employeeCode}
        </div>
      </td>

      <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
        {employee.email}
      </td>

      <td className="whitespace-nowrap px-4 py-4 text-sm text-foreground">
        {employee.countryName ?? "—"}
      </td>

      <td className="whitespace-nowrap px-4 py-4 text-sm text-foreground">
        {employee.departmentName ?? "—"}
      </td>

      <td className="whitespace-nowrap px-4 py-4 text-sm text-foreground">
        {employee.roleName ?? "—"}
      </td>

      <td className="whitespace-nowrap px-4 py-4">
        <span
          className={
            isActive
              ? "inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
          }
        >
          <span
            className={
              isActive
                ? "mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500"
                : "mr-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground"
            }
            aria-hidden="true"
          />

          {formatEmployeeStatus(employee.status)}
        </span>
      </td>

      <td className="whitespace-nowrap px-4 py-4">
        <EmployeeActions employeeId={employee.id} />
      </td>
    </tr>
  );
}

export default EmployeeRow;