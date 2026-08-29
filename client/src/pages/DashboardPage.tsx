// client/src/pages/DashboardPage.tsx

import { DollarSign, Users, Wallet } from "lucide-react";

import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";
import { StatCard } from "../components/data-display/StatCard";
import { Card } from "../components/ui/card";
import { useDocumentTitle } from "../hooks/use-document-title";

export default function DashboardPage() {
  useDocumentTitle("Dashboard");

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Overview of employee compensation and organizational salary data."
      />

      <section
        aria-label="Compensation overview"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          title="Total Employees"
          value="—"
          description="Awaiting API connection"
          icon={<Users className="h-5 w-5" />}
        />

        <StatCard
          title="Total Payroll"
          value="—"
          description="Awaiting API connection"
          icon={<Wallet className="h-5 w-5" />}
        />

        <StatCard
          title="Average Salary"
          value="—"
          description="Awaiting API connection"
          icon={<DollarSign className="h-5 w-5" />}
        />

        <StatCard
          title="Median Salary"
          value="—"
          description="Awaiting API connection"
          icon={<DollarSign className="h-5 w-5" />}
        />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="min-h-80 p-6">
          <h2 className="text-base font-semibold">Salary Distribution</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Compensation distribution will appear here once the analytics API is connected.
          </p>
        </Card>

        <Card className="min-h-80 p-6">
          <h2 className="text-base font-semibold">Department Compensation</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Department-level salary analysis will appear here.
          </p>
        </Card>
      </section>
    </PageContainer>
  );
}
