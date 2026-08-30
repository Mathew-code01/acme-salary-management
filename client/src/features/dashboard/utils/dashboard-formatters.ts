// client/src/features/dashboard/utils/dashboard-formatters.ts

const DEFAULT_LOCALE = 'en-US';

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE, options).format(value);
}

export function formatInteger(value: number): string {
  return formatNumber(value, {
    maximumFractionDigits: 0,
  });
}

export function formatPercentage(value: number): string {
  return `${formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })}%`;
}

export function formatCurrency(amountCents: number | null | undefined, currency: string): string {
  if (amountCents === null || amountCents === undefined) {
    return '—';
  }

  const amount = amountCents / 100;

  try {
    return new Intl.NumberFormat(DEFAULT_LOCALE, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${formatNumber(amount, {
      maximumFractionDigits: 0,
    })}`;
  }
}

export function formatSalary(amountCents: number | null | undefined, currency?: string): string {
  if (amountCents === null || amountCents === undefined) {
    return '—';
  }

  if (!currency) {
    return formatNumber(amountCents / 100, {
      maximumFractionDigits: 0,
    });
  }

  return formatCurrency(amountCents, currency);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) {
    return '—';
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatCountLabel(value: number, singular: string, plural = `${singular}s`): string {
  return `${formatInteger(value)} ${value === 1 ? singular : plural}`;
}

export function formatCurrencyList(currencies: string[]): string {
  if (currencies.length === 0) {
    return 'No currency data';
  }

  return currencies.join(', ');
}

export function getInitials(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}