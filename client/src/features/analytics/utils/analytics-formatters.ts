// client/src/features/analytics/utils/analytics-formatters.ts
import type {
  CurrencyPayrollSummary,
  SalaryDistributionBucket,
} from '../types/analytics';

/**
 * Format a numeric value using the user's locale.
 */
export function formatNumber(
  value: number,
  maximumFractionDigits = 0,
): string {
  if (!Number.isFinite(value)) {
    return '—';
  }

  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits,
  }).format(value);
}

/**
 * Format a percentage value.
 */
export function formatPercentage(
  value: number,
  maximumFractionDigits = 1,
): string {
  if (!Number.isFinite(value)) {
    return '—';
  }

  return `${new Intl.NumberFormat(undefined, {
    minimumFractionDigits:
      maximumFractionDigits,

    maximumFractionDigits,
  }).format(value)}%`;
}

/**
 * Format an amount represented in cents.
 */
export function formatCents(
  cents: number | null | undefined,
  currency: string | null | undefined,
): string {
  if (
    cents === null ||
    cents === undefined ||
    !Number.isFinite(cents)
  ) {
    return '—';
  }

  if (!currency) {
    return formatNumber(
      cents / 100,
      2,
    );
  }

  const normalizedCurrency =
    currency.trim().toUpperCase();

  if (!normalizedCurrency) {
    return formatNumber(
      cents / 100,
      2,
    );
  }

  try {
    return new Intl.NumberFormat(
      undefined,
      {
        style: 'currency',

        currency: normalizedCurrency,

        minimumFractionDigits: 0,

        maximumFractionDigits: 2,
      },
    ).format(cents / 100);
  } catch {
    return `${normalizedCurrency} ${formatNumber(
      cents / 100,
      2,
    )}`;
  }
}

/**
 * Format a number using compact notation.
 */
export function formatCompactNumber(
  value: number,
): string {
  if (!Number.isFinite(value)) {
    return '—';
  }

  return new Intl.NumberFormat(undefined, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Format an ISO date/time string.
 */
export function formatDateTime(
  value: string | null | undefined,
): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  ).format(date);
}

/**
 * Normalize a currency label.
 */
export function getCurrencyLabel(
  currency: string | undefined,
): string {
  return (
    currency?.trim().toUpperCase() ||
    'N/A'
  );
}

/**
 * Determine the currency to use for the overview
 * average/median salary display.
 *
 * A summary currency is only selected when the
 * entire overview represents exactly one currency.
 */
export function getSummaryCurrency(
  currencies: number,
  payroll: CurrencyPayrollSummary[],
): string | null {
  if (
    currencies !== 1 ||
    payroll.length !== 1
  ) {
    return null;
  }

  return payroll[0]?.currency ?? null;
}

/**
 * Get the largest employee count in the salary
 * distribution.
 */
export function getDistributionMax(
  buckets: SalaryDistributionBucket[],
): number {
  if (buckets.length === 0) {
    return 1;
  }

  return Math.max(
    1,
    ...buckets.map(
      (bucket) => bucket.employeeCount,
    ),
  );
}

/**
 * Sort analytics rows by employee count,
 * descending.
 */
export function sortByEmployeeCount<
  T extends { employeeCount: number },
>(
  rows: T[],
): T[] {
  return [...rows].sort(
    (a, b) =>
      b.employeeCount - a.employeeCount,
  );
}
