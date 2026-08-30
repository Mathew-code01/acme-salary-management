// client/src/features/dashboard/components/OverviewStats.tsx

import { CircleDollarSign, Users, WalletCards, Layers3 } from 'lucide-react';

import { StatCard } from '../../../components/data-display/StatCard';

import type { AnalyticsOverview } from '../types/dashboard';

import { formatInteger, formatSalary } from '../utils/dashboard-formatters';

interface OverviewStatsProps {
  overview: AnalyticsOverview;
}

function getPrimaryCurrency(overview: AnalyticsOverview): string | undefined {
  if (overview.payrollByCurrency.length !== 1) {
    return undefined;
  }

  return overview.payrollByCurrency[0]?.currency;
}

export function OverviewStats({ overview }: OverviewStatsProps) {
  const { employeeCount, salaryRecordCount, currencies, averageSalaryCents, medianSalaryCents } =
    overview.metrics;

  const primaryCurrency = getPrimaryCurrency(overview);

  return (
    <section aria-labelledby="dashboard-overview-heading" className="space-y-4">
      <div>
        <h2
          id="dashboard-overview-heading"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Workforce overview
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Key compensation metrics for the selected workforce.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Employees"
          value={formatInteger(employeeCount)}
          description={`${formatInteger(salaryRecordCount)} salary records`}
          icon={<Users className="h-5 w-5" />}
        />

        <StatCard
          title="Average salary"
          value={
            primaryCurrency ? formatSalary(averageSalaryCents, primaryCurrency) : 'Mixed currencies'
          }
          description={
            primaryCurrency ? 'Across available salary records' : 'See payroll summary by currency'
          }
          icon={<CircleDollarSign className="h-5 w-5" />}
        />

        <StatCard
          title="Median salary"
          value={
            primaryCurrency ? formatSalary(medianSalaryCents, primaryCurrency) : 'Mixed currencies'
          }
          description={primaryCurrency ? 'Middle salary value' : 'Cannot safely combine currencies'}
          icon={<WalletCards className="h-5 w-5" />}
        />

        <StatCard
          title="Currencies"
          value={formatInteger(currencies)}
          description="Currencies represented in payroll"
          icon={<Layers3 className="h-5 w-5" />}
        />
      </div>
    </section>
  );
}