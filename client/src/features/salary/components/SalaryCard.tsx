// client/src/features/salary/components/SalaryCard.tsx


import {
  CalendarDays,
  CircleDollarSign,
  Pencil,
} from 'lucide-react';

import type { Salary } from '../types/salary';

interface SalaryCardProps {
  salary: Salary | null;
  onEdit: () => void;
  isEditing?: boolean;
}

function formatCurrency(
  amountCents: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat(
      undefined,
      {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    ).format(amountCents / 100);
  } catch {
    return `${currency} ${(
      amountCents / 100
    ).toFixed(2)}`;
  }
}

function formatDate(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: 'medium',
    },
  ).format(date);
}

export function SalaryCard({
  salary,
  onEdit,
  isEditing = false,
}: SalaryCardProps) {
  if (!salary) {
    return (
      <section
        aria-labelledby="salary-heading"
        className="rounded-xl border border-dashed border-border bg-card p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="salary-heading"
              className="text-base font-semibold text-foreground"
            >
              Compensation
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              No salary record has been added
              for this employee yet.
            </p>
          </div>

          <CircleDollarSign
            aria-hidden="true"
            className="h-5 w-5 text-muted-foreground"
          />
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <Pencil
            aria-hidden="true"
            className="h-4 w-4"
          />

          Add salary
        </button>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="salary-heading"
      className="rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CircleDollarSign
              aria-hidden="true"
              className="h-5 w-5 text-primary"
            />

            <h2
              id="salary-heading"
              className="text-base font-semibold text-foreground"
            >
              Compensation
            </h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Current employee salary
          </p>
        </div>

        <button
          type="button"
          onClick={onEdit}
          disabled={isEditing}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <Pencil
            aria-hidden="true"
            className="h-4 w-4"
          />

          Edit salary
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Annual salary
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {formatCurrency(
              salary.amountCents,
              salary.currency,
            )}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2">
            <CalendarDays
              aria-hidden="true"
              className="h-4 w-4 text-muted-foreground"
            />

            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Effective from
            </p>
          </div>

          <p className="mt-2 text-base font-semibold text-foreground">
            {formatDate(
              salary.effectiveFrom,
            )}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Last updated{' '}
        {formatDate(salary.updatedAt)}
      </p>
    </section>
  );
}