// client/src/pages/EmployeesPage.tsx

// client/src/pages/EmployeeDetailsPage.tsx

import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/card";
import { useDocumentTitle } from "../hooks/use-document-title";

export default function EmployeeDetailsPage() {
  const { employeeId } = useParams<{
    employeeId: string;
  }>();

  useDocumentTitle("Employee Details");

  return (
    <PageContainer>
      <div className="mb-5">
        <Link
          to="/employees"
          className="inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to employees
        </Link>
      </div>

      <PageHeader
        title="Employee Details"
        description={`Employee record: ${employeeId ?? "unknown"}`}
      />

      <Card className="p-6">
        <p className="text-sm text-muted-foreground">
          Employee details will be loaded from the API in
          the employee feature batch.
        </p>
      </Card>
    </PageContainer>
  );
}