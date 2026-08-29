// client/src/pages/EmployeesPage.tsx

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";
import EmployeeTable from "../features/employees/components/EmployeeTable";

function EmployeesPage() {
  const pageActions = useMemo(
    () => (
      <Link
        to="/employees/new"
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Plus
          className="h-4 w-4"
          aria-hidden="true"
        />

        <span>Add employee</span>
      </Link>
    ),
    [],
  );

  return (
    <PageContainer>
      <PageHeader
        title="Employees"
        description="Manage employee information, compensation, and organizational details."
        actions={pageActions}
      />

      <section
        aria-labelledby="employees-heading"
        className="mt-6"
      >
        <h2
          id="employees-heading"
          className="sr-only"
        >
          Employee directory
        </h2>

        <EmployeeTable />
      </section>
    </PageContainer>
  );
}

export default EmployeesPage;