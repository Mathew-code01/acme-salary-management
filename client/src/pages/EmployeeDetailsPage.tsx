// client/src/pages/EmployeeDetailsPage.tsx
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Globe2,
  Mail,
  Pencil,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

import { useState } from 'react';

import { Link, useParams } from 'react-router-dom';

import { CompensationContext } from '../features/salary/components/CompensationContext';
import { SalaryCard } from '../features/salary/components/SalaryCard';
import { SalaryForm } from '../features/salary/components/SalaryForm';
import { SalarySummary } from '../features/salary/components/SalarySummary';

import { useCreateSalary, useUpdateSalary } from '../features/salary/hooks/use-salary';

import { useEmployee } from '../features/employees/hooks/use-employee';

interface DetailItemProps {
  label: string;
  value: string;
  icon: typeof UserRound;
}

function DetailItem({ label, value, icon: Icon }: DetailItemProps) {
  return (
    <div className="group min-w-0 rounded-xl border border-border bg-muted/[0.18] p-3.5 transition-colors hover:bg-muted/30 sm:p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground shadow-sm">
          <Icon aria-hidden="true" className="h-3.5 w-3.5" />
        </div>

        <span className="truncate text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground sm:text-[11px]">
          {label}
        </span>
      </div>

      <p className="mt-3 break-words text-sm font-semibold leading-5 text-foreground">
        {value || 'Not available'}
      </p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <main className="mx-auto w-full max-w-[1500px] px-3 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div role="status" aria-live="polite" className="space-y-5 sm:space-y-6">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />

        <div className="rounded-2xl border border-border p-5 sm:p-6">
          <div className="flex gap-4">
            <div className="h-14 w-14 animate-pulse rounded-xl bg-muted" />

            <div className="flex-1 space-y-3">
              <div className="h-5 w-48 animate-pulse rounded bg-muted" />
              <div className="h-4 w-64 max-w-full animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="h-72 animate-pulse rounded-2xl bg-muted lg:col-span-2" />
          <div className="h-72 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </main>
  );
}

function ErrorPage({ onRetry }: { onRetry?: () => void }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 sm:p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </div>

        <h1 className="mt-4 text-lg font-semibold text-foreground">Unable to load employee</h1>

        <p className="mt-1 max-w-lg text-sm leading-5 text-muted-foreground">
          We couldn't retrieve this employee's information. Please try again or return to the
          employee directory.
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex min-h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Try again
            </button>
          ) : null}

          <Link
            to="/employees"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to employees
          </Link>
        </div>
      </div>
    </main>
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
      candidate.response?.data?.message ?? candidate.message ?? 'Unable to save salary changes.'
    );
  }

  return 'Unable to save salary changes.';
}

export default function EmployeeDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const employeeId = Number(id);

  const validEmployeeId = Number.isSafeInteger(employeeId) && employeeId > 0;

  const [isEditingSalary, setIsEditingSalary] = useState(false);

  const [salaryError, setSalaryError] = useState<string | null>(null);

  const employeeQuery = useEmployee(validEmployeeId ? employeeId : null);

  const createSalary = useCreateSalary();
  const updateSalary = useUpdateSalary();

  if (!validEmployeeId) {
    return (
      <main className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 sm:p-6">
          <h1 className="text-lg font-semibold text-foreground">Invalid employee</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            The employee identifier provided in the URL is not valid.
          </p>

          <Link
            to="/employees"
            className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to employees
          </Link>
        </div>
      </main>
    );
  }

  if (employeeQuery.isPending) {
    return <ProfileSkeleton />;
  }

  if (employeeQuery.isError || !employeeQuery.data) {
    return (
      <ErrorPage
        onRetry={() => {
          void employeeQuery.refetch();
        }}
      />
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

    const effectiveFrom = values.effectiveFrom.toISOString();

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

  const isSaving = createSalary.isPending || updateSalary.isPending;

  const initials = `${employee.firstName?.[0] ?? ''}${employee.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <main className="mx-auto w-full max-w-[1500px] px-3 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      {/* Back navigation */}
      <div className="mb-4 sm:mb-5">
        <Link
          to="/employees"
          className="group inline-flex min-h-9 items-center gap-2 rounded-lg px-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 sm:text-sm"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back to employees
        </Link>
      </div>

      {/* Profile header */}
      <header className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="absolute right-0 top-0 h-48 w-48 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative p-4 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary sm:h-14 sm:w-14 sm:text-base">
                {initials || '—'}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="break-words text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {employee.firstName} {employee.lastName}
                  </h1>

                  <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[10px] font-bold text-muted-foreground sm:text-xs">
                    {employee.employeeCode}
                  </span>
                </div>

                <div className="mt-2 flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />

                  <span className="truncate">{employee.email}</span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 sm:text-xs">
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    {employee.status}
                  </span>

                  {employee.department?.name ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground sm:text-xs">
                      <Building2 className="h-3 w-3" aria-hidden="true" />
                      {employee.department.name}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <Link
              to={`/employees/${employee.id}/edit`}
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/30 sm:w-auto"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Edit employee
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="mt-5 grid min-w-0 gap-5 sm:mt-6 lg:grid-cols-3 lg:gap-6">
        {/* Employee information */}
        <section
          aria-labelledby="employee-information-heading"
          className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:col-span-2"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserRound className="h-4 w-4" aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h2
                id="employee-information-heading"
                className="text-base font-semibold text-foreground"
              >
                Employee information
              </h2>

              <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
                Personal and organizational information associated with this employee.
              </p>
            </div>
          </div>

          <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2">
            <DetailItem
              label="Full name"
              value={`${employee.firstName} ${employee.lastName}`}
              icon={UserRound}
            />

            <DetailItem label="Email" value={employee.email} icon={Mail} />

            <DetailItem
              label="Country"
              value={employee.country?.name ?? 'Not available'}
              icon={Globe2}
            />

            <DetailItem
              label="Department"
              value={employee.department?.name ?? 'Not available'}
              icon={Building2}
            />

            <DetailItem
              label="Role"
              value={employee.role?.name ?? 'Not available'}
              icon={BriefcaseBusiness}
            />

            <DetailItem label="Employee code" value={employee.employeeCode} icon={UserRound} />
          </div>
        </section>

        {/* Salary summary */}
        <div className="min-w-0">
          <SalarySummary salary={salary} />
        </div>
      </div>

      {/* Salary */}
      <section className="mt-5 sm:mt-6">
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
      </section>

      {/* Compensation context */}
      <section className="mt-5 sm:mt-6">
        <CompensationContext
          countryName={employee.country?.name}
          departmentName={employee.department?.name}
          roleName={employee.role?.name}
        />
      </section>
    </main>
  );
}