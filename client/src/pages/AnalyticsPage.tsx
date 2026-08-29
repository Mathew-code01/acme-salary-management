// client/src/pages/AnalyticsPage.tsx

import { BarChart3 } from "lucide-react";

import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/card";
import { useDocumentTitle } from "../hooks/use-document-title";

export default function AnalyticsPage() {
  useDocumentTitle("Analytics");

  return (
    <PageContainer>
      <PageHeader
        title="Analytics"
        description="Understand compensation patterns across employees, countries, departments, and roles."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {["Salary Distribution", "Country Analysis", "Department Analysis", "Role Analysis"].map(
          (title) => (
            <Card key={title} className="min-h-72 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <BarChart3 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-semibold">{title}</h2>

                  <p className="text-sm text-muted-foreground">
                    Analytics data will be connected in the analytics feature batch.
                  </p>
                </div>
              </div>
            </Card>
          ),
        )}
      </div>
    </PageContainer>
  );
}
