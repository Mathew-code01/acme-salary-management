// client/src/features/salary/validation/salary-validation.ts

import { SALARY_CURRENCIES, type SalaryFormValues } from '../types/salary';

export interface SalaryValidationErrors {
  amount?: string;
  currency?: string;
  effectiveFrom?: string;
}

const MAX_AMOUNT_CENTS = 9_999_999_999_99;

function parseAmountToCents(value: string): number | null {
  const normalized = value.trim().replace(/,/g, '');

  if (!normalized) {
    return null;
  }

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return null;
  }

  const [whole, decimal = ''] = normalized.split('.');

  const cents = Number(`${whole}${decimal.padEnd(2, '0')}`);

  if (!Number.isSafeInteger(cents)) {
    return null;
  }

  return cents;
}

export function validateSalaryForm(values: SalaryFormValues): SalaryValidationErrors {
  const errors: SalaryValidationErrors = {};

  const amount = values.amount.trim();

  if (!amount) {
    errors.amount = 'Salary amount is required.';
  } else {
    const amountCents = parseAmountToCents(amount);

    if (amountCents === null) {
      errors.amount = 'Enter a valid amount with up to two decimal places.';
    } else if (amountCents <= 0) {
      errors.amount = 'Salary amount must be greater than zero.';
    } else if (amountCents > MAX_AMOUNT_CENTS) {
      errors.amount = 'Salary amount is too large.';
    }
  }

  const currency = values.currency.trim().toUpperCase();

  if (!currency) {
    errors.currency = 'Currency is required.';
  } else if (!/^[A-Z]{3}$/.test(currency)) {
    errors.currency = 'Currency must be a valid 3-letter code.';
  }

  const effectiveFrom = values.effectiveFrom.trim();

  if (!effectiveFrom) {
    errors.effectiveFrom = 'Effective date is required.';
  } else {
    const date = new Date(`${effectiveFrom}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      errors.effectiveFrom = 'Enter a valid effective date.';
    } else if (date.getTime() > Date.now()) {
      errors.effectiveFrom = 'Effective date cannot be in the future.';
    }
  }

  return errors;
}

export function amountToCents(value: string): number {
  const normalized = value.trim().replace(/,/g, '');

  const [whole, decimal = ''] = normalized.split('.');

  return Number(`${whole}${decimal.padEnd(2, '0')}`);
}

export function centsToAmount(amountCents: number): string {
  return (amountCents / 100).toFixed(2);
}

export function isSupportedCurrency(currency: string): boolean {
  return SALARY_CURRENCIES.includes(currency.toUpperCase() as (typeof SALARY_CURRENCIES)[number]);
}

export function getTodayDateInputValue(): string {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, '0');

  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}