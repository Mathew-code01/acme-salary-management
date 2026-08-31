import { ArrowUpRight, CalendarDays, CircleDollarSign } from 'lucide-react';

import type { Salary } from '../types/salary';

interface SalarySummaryProps {
  salary: Salary | null;
}

function formatCurrency(amountCents: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amountCents / 100);
  } catch {
    return `${currency} ${(amountCents / 100).toFixed(2)}`;
  }
}

export function SalarySummary({ salary }: SalarySummaryProps) {
  if (!salary) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-muted p-2">
            <CircleDollarSign aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Compensation</p>

            <p className="text-sm text-muted-foreground">No salary recorded</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <CircleDollarSign aria-hidden="true" className="h-5 w-5 text-primary" />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Annual compensation</p>

            <p className="mt-1 text-xl font-semibold text-foreground">
              {formatCurrency(salary.amountCents, salary.currency)}
            </p>
          </div>
        </div>

        <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
        Effective{' '}
        {new Intl.DateTimeFormat(undefined, {
          dateStyle: 'medium',
        }).format(new Date(salary.effectiveFrom))}
      </div>
    </div>
  );
}
