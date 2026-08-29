// client/src/features/employees/components/EmployeeTable.tsx

import { Users } from "lucide-react";

import { Card } from "../../../components/ui/card";

function EmployeeTable() {
  return (
    <Card
      className="overflow-hidden"
      aria-label="Employee directory"
    >
      <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted"
          aria-hidden="true"
        >
          <Users className="h-6 w-6 text-muted-foreground" />
        </div>

        <h3 className="text-base font-semibold text-foreground">
          Employee directory
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Employee records will appear here once the employee
          management feature is connected to the API.
        </p>

        <div className="mt-6 rounded-md border border-border bg-muted/40 px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">
            Employee data integration is coming in the employee
            management feature batch.
          </p>
        </div>
      </div>
    </Card>
  );
}

export default EmployeeTable;