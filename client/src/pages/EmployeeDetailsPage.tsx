
// client/src/pages/EmployeeDetailsPage.tsx

import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  Globe2,
  Mail,
  Pencil,
  UserRound,
} from 'lucide-react';

import { useState } from 'react';

import { Link, useParams } from 'react-router-dom';

import { CompensationContext } from '../features/salary/components/CompensationContext';
import { SalaryCard } from '../features/salary/components/SalaryCard';
import { SalaryForm } from '../features/salary/components/SalaryForm';
import { SalarySummary } from '../features/salary/components/SalarySummary';
import {
  useCreateSalary,
  useUpdateSalary,
} from '../features/salary/hooks/use-salary';

import { useEmployee } from '../features/employees/hooks/use-employee';

interface DetailItemProps {
  label: string;
  value: string;
  icon: typeof UserRound;
}

function DetailItem({
  label,
  value,
  icon: Icon,
}: DetailItemProps) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4">
      <div className="flex items-center gap-2">
        <Icon
          aria-hidden="true"
          className="h-4 w-4 text-muted-foreground"
        />

        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-sm font-medium text-foreground">
        {value || 'Not available'}
      </p>
    </div>
  );
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const candidate = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
      message?: string;
    };

    return (
      candidate.response?.data?.message ??
      candidate.message ??
      'Unable to save salary changes.'
    );
  }

  return 'Unable to save salary changes.';
}

export default function EmployeeDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const employeeId = Number(id);

  const validEmployeeId =
    Number.isSafeInteger(employeeId) && employeeId > 0;

  const [isEditingSalary, setIsEditingSalary] =
    useState(false);

  const [salaryError, setSalaryError] =
    useState<string | null>(null);

  const employeeQuery = useEmployee(
    validEmployeeId ? employeeId : null,
  );

  const createSalary = useCreateSalary();
  const updateSalary = useUpdateSalary();

  if (!validEmployeeId) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6">
          <h1 className="text-lg font-semibold text-foreground">
            Invalid employee
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            The employee identifier provided in the URL is not valid.
          </p>

          <Link
            to="/employees"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <ArrowLeft
              aria-hidden="true"
              className="h-4 w-4"
            />
            Back to employees
          </Link>
        </div>
      </main>
    );
  }

  if (employeeQuery.isPending) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div
          role="status"
          aria-live="polite"
          className="space-y-6"
        >
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />

          <div className="h-32 animate-pulse rounded-xl bg-muted" />

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-56 animate-pulse rounded-xl bg-muted" />
            <div className="h-56 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </main>
    );
  }

  if (
    employeeQuery.isError ||
    !employeeQuery.data
  ) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6">
          <h1 className="text-lg font-semibold text-foreground">
            Unable to load employee
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            We couldn't retrieve this employee's information.
            Please try again.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => employeeQuery.refetch()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Try again
            </button>

            <Link
              to="/employees"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground"
            >
              <ArrowLeft
                aria-hidden="true"
                className="h-4 w-4"
              />
              Back to employees
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const employee = employeeQuery.data;

  const salary = employee.salary;

  async function handleSalarySubmit(values: {
    amountCents: number;
    currency: string;
    effectiveFrom: Date;
  }) {
    setSalaryError(null);

    const effectiveFrom =
      values.effectiveFrom.toISOString();

    try {
      if (salary) {
        await updateSalary.mutateAsync({
          salaryId: salary.id,

          input: {
            amountCents: values.amountCents,
            currency: values.currency,
            effectiveFrom,
          },
        });
      } else {
        await createSalary.mutateAsync({
          employeeId: employee.id,
          amountCents: values.amountCents,
          currency: values.currency,
          effectiveFrom,
        });
      }

      setIsEditingSalary(false);

      await employeeQuery.refetch();
    } catch (error) {
      setSalaryError(getErrorMessage(error));
    }
  }

  const isSaving =
    createSalary.isPending ||
    updateSalary.isPending;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <Link
          to="/employees"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <ArrowLeft
            aria-hidden="true"
            className="h-4 w-4"
          />
          Back to employees
        </Link>
      </div>

      <header className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div
              aria-hidden="true"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
            >
              <UserRound className="h-7 w-7" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {employee.firstName}{' '}
                  {employee.lastName}
                </h1>

                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {employee.employeeCode}
                </span>
              </div>

              <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Mail
                  aria-hidden="true"
                  className="h-4 w-4"
                />

                {employee.email}
              </p>
            </div>
          </div>

          <Link
            to={`/employees/${employee.id}/edit`}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <Pencil
              aria-hidden="true"
              className="h-4 w-4"
            />
            Edit employee
          </Link>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section
          aria-labelledby="employee-information-heading"
          className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2"
        >
          <div>
            <h2
              id="employee-information-heading"
              className="text-base font-semibold text-foreground"
            >
              Employee information
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Personal and organizational information.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <DetailItem
              label="Full name"
              value={`${employee.firstName} ${employee.lastName}`}
              icon={UserRound}
            />

            <DetailItem
              label="Email"
              value={employee.email}
              icon={Mail}
            />

            <DetailItem
              label="Country"
              value={employee.country?.name ?? 'Not available'}
              icon={Globe2}
            />

            <DetailItem
              label="Department"
              value={
                employee.department?.name ??
                'Not available'
              }
              icon={Building2}
            />

            <DetailItem
              label="Role"
              value={
                employee.role?.name ??
                'Not available'
              }
              icon={BriefcaseBusiness}
            />

            <DetailItem
              label="Employee code"
              value={employee.employeeCode}
              icon={UserRound}
            />
          </div>
        </section>

        <SalarySummary salary={salary} />
      </div>

      <div className="mt-6">
        {isEditingSalary ? (
          <SalaryForm
            salary={salary}
            onSubmit={handleSalarySubmit}
            onCancel={() => {
              setSalaryError(null);
              setIsEditingSalary(false);
            }}
            isSubmitting={isSaving}
            serverError={salaryError}
          />
        ) : (
          <SalaryCard
            salary={salary}
            onEdit={() => {
              setSalaryError(null);
              setIsEditingSalary(true);
            }}
          />
        )}
      </div>

      <div className="mt-6">
        <CompensationContext
          countryName={employee.country?.name}
          departmentName={employee.department?.name}
          roleName={employee.role?.name}
        />
      </div>
    </main>
  );
}
