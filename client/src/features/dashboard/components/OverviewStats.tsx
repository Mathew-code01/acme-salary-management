// client/src/features/dashboard/components/OverviewStats.tsx

import { CircleDollarSign, Layers3, Users, WalletCards, ArrowUpRight } from 'lucide-react';

import type { ReactNode } from 'react';

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

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  accent: 'primary' | 'success' | 'info' | 'warning';
}

const accentStyles = {
  primary: {
    icon: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    glow: 'group-hover:bg-indigo-500/5',
  },
  success: {
    icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    glow: 'group-hover:bg-emerald-500/5',
  },
  info: {
    icon: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    glow: 'group-hover:bg-sky-500/5',
  },
  warning: {
    icon: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    glow: 'group-hover:bg-amber-500/5',
  },
};

function MetricCard({ title, value, description, icon, accent }: MetricCardProps) {
  const styles = accentStyles[accent];

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-slate-900/5 dark:hover:shadow-black/20 ${styles.glow}`}
    >
      <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:opacity-100" />

      <div className="relative flex items-start justify-between gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
        >
          {icon}
        </div>

        <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>

      <div className="relative mt-5 min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>

        <p className="mt-2 truncate text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {value}
        </p>

        <p className="mt-2 truncate text-xs text-muted-foreground">{description}</p>
      </div>
    </article>
  );
}

export function OverviewStats({ overview }: OverviewStatsProps) {
  const { employeeCount, salaryRecordCount, currencies, averageSalaryCents, medianSalaryCents } =
    overview.metrics;

  const primaryCurrency = getPrimaryCurrency(overview);

  return (
    <section aria-labelledby="dashboard-overview-heading" className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Executive overview
          </p>

          <h2
            id="dashboard-overview-heading"
            className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl"
          >
            Workforce at a glance
          </h2>

          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Key compensation metrics across the currently selected workforce.
          </p>
        </div>

        <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Live dataset
        </div>
      </div>

      <div className="grid gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Employees"
          value={formatInteger(employeeCount)}
          description={`${formatInteger(salaryRecordCount)} salary records`}
          icon={<Users className="h-5 w-5" />}
          accent="primary"
        />

        <MetricCard
          title="Average salary"
          value={
            primaryCurrency ? formatSalary(averageSalaryCents, primaryCurrency) : 'Mixed currencies'
          }
          description={
            primaryCurrency ? 'Across available salary records' : 'See payroll by currency'
          }
          icon={<CircleDollarSign className="h-5 w-5" />}
          accent="success"
        />

        <MetricCard
          title="Median salary"
          value={
            primaryCurrency ? formatSalary(medianSalaryCents, primaryCurrency) : 'Mixed currencies'
          }
          description={primaryCurrency ? 'Middle salary value' : 'Cannot safely combine currencies'}
          icon={<WalletCards className="h-5 w-5" />}
          accent="info"
        />

        <MetricCard
          title="Currencies"
          value={formatInteger(currencies)}
          description="Currencies represented in payroll"
          icon={<Layers3 className="h-5 w-5" />}
          accent="warning"
        />
      </div>
    </section>
  );
}