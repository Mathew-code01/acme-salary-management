import { useEffect, useMemo, useState, type FormEvent } from 'react';

import { AlertCircle, Loader2, Save, X } from 'lucide-react';

import type { Salary, SalaryFormValues } from '../types/salary';

import {
  amountToCents,
  centsToAmount,
  getTodayDateInputValue,
  validateSalaryForm,
  type SalaryValidationErrors,
} from '../validation/salary-validation';

interface SalaryFormProps {
  salary: Salary | null;

  onSubmit: (values: {
    amountCents: number;
    currency: string;
    effectiveFrom: Date;
  }) => Promise<void>;

  onCancel: () => void;

  isSubmitting?: boolean;

  serverError?: string | null;
}

function toDateInputValue(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return getTodayDateInputValue();
  }

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function SalaryForm({
  salary,
  onSubmit,
  onCancel,
  isSubmitting = false,
  serverError = null,
}: SalaryFormProps) {
  const initialValues = useMemo<SalaryFormValues>(
    () => ({
      amount: salary ? centsToAmount(salary.amountCents) : '',
      currency: salary?.currency ?? 'USD',
      effectiveFrom: salary ? toDateInputValue(salary.effectiveFrom) : getTodayDateInputValue(),
    }),
    [salary],
  );

  const [values, setValues] = useState<SalaryFormValues>(initialValues);

  const [errors, setErrors] = useState<SalaryValidationErrors>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  function updateField(field: keyof SalaryFormValues, value: string) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateSalaryForm(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await onSubmit({
      amountCents: amountToCents(values.amount),
      currency: values.currency.trim().toUpperCase(),
      effectiveFrom: new Date(`${values.effectiveFrom}T00:00:00`),
    });
  }

  return (
    <section
      aria-labelledby="salary-form-heading"
      className="rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="salary-form-heading" className="text-base font-semibold text-foreground">
            {salary ? 'Edit compensation' : 'Add compensation'}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {salary
              ? 'Update the employee’s current salary information.'
              : 'Add the employee’s current salary information.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          aria-label="Cancel salary editing"
          className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      {serverError && (
        <div
          role="alert"
          className="mt-5 flex gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />

          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        <div>
          <label htmlFor="salary-amount" className="mb-2 block text-sm font-medium text-foreground">
            Annual salary
          </label>

          <div className="relative">
            <input
              id="salary-amount"
              name="amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={values.amount}
              onChange={(event) => updateField('amount', event.target.value)}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={errors.amount ? 'salary-amount-error' : undefined}
              placeholder="75000.00"
              className="min-h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {errors.amount && (
            <p id="salary-amount-error" className="mt-1.5 text-xs text-destructive">
              {errors.amount}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="salary-currency"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Currency
          </label>

          <input
            id="salary-currency"
            name="currency"
            type="text"
            inputMode="text"
            autoComplete="off"
            maxLength={3}
            value={values.currency}
            onChange={(event) =>
              updateField('currency', event.target.value.toUpperCase().replace(/[^A-Z]/g, ''))
            }
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.currency)}
            aria-describedby={errors.currency ? 'salary-currency-error' : undefined}
            placeholder="USD"
            className="min-h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm uppercase text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {errors.currency && (
            <p id="salary-currency-error" className="mt-1.5 text-xs text-destructive">
              {errors.currency}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="salary-effective-from"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Effective from
          </label>

          <input
            id="salary-effective-from"
            name="effectiveFrom"
            type="date"
            max={getTodayDateInputValue()}
            value={values.effectiveFrom}
            onChange={(event) => updateField('effectiveFrom', event.target.value)}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.effectiveFrom)}
            aria-describedby={errors.effectiveFrom ? 'salary-effective-from-error' : undefined}
            className="min-h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {errors.effectiveFrom && (
            <p id="salary-effective-from-error" className="mt-1.5 text-xs text-destructive">
              {errors.effectiveFrom}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="min-h-10 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save aria-hidden="true" className="h-4 w-4" />

                {salary ? 'Save changes' : 'Add salary'}
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
