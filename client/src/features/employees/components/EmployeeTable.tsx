// client/src/features/employees/components/EmployeeTable.tsx
import {
  AlertCircle,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Building2,
  Eye,
  Globe2,
  Mail,
  Users,
} from 'lucide-react';

import { Link } from 'react-router-dom';

import { Card } from '../../../components/ui/card';

import type { Employee, EmployeePagination } from '../types/employee';

import { formatEmployeeStatus } from '../utils/employee-formatters';

import EmployeeRow from './EmployeeRow';

interface EmployeeTableProps {
  employees: Employee[];
  pagination: EmployeePagination | null;

  isLoading: boolean;
  error: string | null;

  onPageChange: (page: number) => void;
  onRetry: () => Promise<void>;
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <tr key={index} className="border-b border-border/70 last:border-0">
          {Array.from({ length: 7 }).map((_, cellIndex) => (
            <td key={cellIndex} className="px-5 py-4">
              <div
                className={`h-4 animate-pulse rounded-md bg-muted ${
                  cellIndex === 0 ? 'max-w-[220px]' : 'max-w-[160px]'
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function MobileSkeleton() {
  return (
    <div className="space-y-3 p-3 sm:hidden">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-36 rounded bg-muted" />
              <div className="h-3 w-24 rounded bg-muted" />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-3/4 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={7} className="px-6 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"
            aria-hidden="true"
          >
            <Users className="h-6 w-6" />
          </div>

          <h3 className="text-sm font-semibold text-foreground">No employees found</h3>

          <p className="mt-1 max-w-sm text-sm leading-5 text-muted-foreground">
            Try adjusting your search or filters to find the employee you are looking for.
          </p>
        </div>
      </td>
    </tr>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => Promise<void> }) {
  return (
    <tr>
      <td colSpan={7} className="px-6 py-16">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center text-center">
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive"
            aria-hidden="true"
          >
            <AlertCircle className="h-6 w-6" />
          </div>

          <h3 className="text-sm font-semibold text-foreground">Unable to load employees</h3>

          <p className="mt-1 text-sm leading-5 text-muted-foreground">{message}</p>

          <button
            type="button"
            onClick={() => {
              void onRetry();
            }}
            className="mt-5 inline-flex min-h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            Try again
          </button>
        </div>
      </td>
    </tr>
  );
}

function MobileEmptyState() {
  return (
    <div className="px-4 py-12 text-center sm:hidden">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Users className="h-5 w-5" aria-hidden="true" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-foreground">No employees found</h3>

      <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
        Try changing your search or filters.
      </p>
    </div>
  );
}

function MobileErrorState({ message, onRetry }: { message: string; onRetry: () => Promise<void> }) {
  return (
    <div className="px-4 py-12 text-center sm:hidden">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertCircle className="h-5 w-5" aria-hidden="true" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-foreground">Unable to load employees</h3>

      <p className="mx-auto mt-1 max-w-xs text-sm leading-5 text-muted-foreground">{message}</p>

      <button
        type="button"
        onClick={() => {
          void onRetry();
        }}
        className="mt-4 inline-flex min-h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
      >
        Try again
      </button>
    </div>
  );
}

function MobileEmployeeCard({ employee }: { employee: Employee }) {
  const isActive = employee.status === 'ACTIVE';

  const initials = `${employee.firstName?.[0] ?? ''}${employee.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <article className="rounded-xl border border-border bg-background p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
          {initials || '—'}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-foreground">
                {employee.fullName}
              </h3>

              <p className="mt-0.5 text-xs text-muted-foreground">{employee.employeeCode}</p>
            </div>

            <span
              className={
                isActive
                  ? 'inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400'
                  : 'inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px] font-semibold text-muted-foreground'
              }
            >
              <span
                className={
                  isActive
                    ? 'h-1.5 w-1.5 rounded-full bg-emerald-500'
                    : 'h-1.5 w-1.5 rounded-full bg-muted-foreground'
                }
                aria-hidden="true"
              />

              {formatEmployeeStatus(employee.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2.5">
        <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{employee.email}</span>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="flex min-w-0 items-center gap-2 rounded-lg bg-muted/30 px-2.5 py-2 text-xs">
            <Globe2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />

            <span className="truncate text-foreground">{employee.countryName ?? '—'}</span>
          </div>

          <div className="flex min-w-0 items-center gap-2 rounded-lg bg-muted/30 px-2.5 py-2 text-xs">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />

            <span className="truncate text-foreground">{employee.departmentName ?? '—'}</span>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-2 rounded-lg bg-muted/30 px-2.5 py-2 text-xs">
          <BriefcaseBusiness
            className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />

          <span className="truncate text-foreground">{employee.roleName ?? '—'}</span>
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-3">
        <Link
          to={`/employees/${employee.id}`}
          className="inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/30"
        >
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          View employee
        </Link>
      </div>
    </article>
  );
}

function Pagination({
  pagination,
  onPageChange,
}: {
  pagination: EmployeePagination;
  onPageChange: (page: number) => void;
}) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  const currentPage = pagination.page;
  const totalPages = pagination.totalPages;

  return (
    <div className="border-t border-border bg-muted/[0.18] px-3 py-3 sm:px-5 sm:py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Page <span className="font-semibold text-foreground">{currentPage}</span> of{' '}
          <span className="font-semibold text-foreground">{totalPages}</span>
        </p>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <button
            type="button"
            disabled={!pagination.hasPreviousPage}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
            className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span>Previous</span>
          </button>

          <div className="hidden h-9 items-center rounded-lg border border-border bg-background px-3 text-xs font-medium text-muted-foreground sm:flex">
            {currentPage} / {totalPages}
          </div>

          <button
            type="button"
            disabled={!pagination.hasNextPage}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
            className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

function EmployeeTable({
  employees,
  pagination,
  isLoading,
  error,
  onPageChange,
  onRetry,
}: EmployeeTableProps) {
  const hasEmployees = employees.length > 0;

  return (
    <Card className="overflow-hidden border-border/80 shadow-sm" aria-label="Employee directory">
      {/* Desktop */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[1120px] border-collapse text-left">
          <caption className="sr-only">Employee directory</caption>

          <thead>
            <tr className="border-b border-border bg-muted/25">
              <th
                scope="col"
                className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground sm:px-5"
              >
                Employee
              </th>

              <th
                scope="col"
                className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground sm:px-5"
              >
                Email
              </th>

              <th
                scope="col"
                className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground sm:px-5"
              >
                Country
              </th>

              <th
                scope="col"
                className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground sm:px-5"
              >
                Department
              </th>

              <th
                scope="col"
                className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground sm:px-5"
              >
                Role
              </th>

              <th
                scope="col"
                className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground sm:px-5"
              >
                Status
              </th>

              <th
                scope="col"
                className="px-4 py-3.5 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground sm:px-5"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {error ? (
              <ErrorState message={error} onRetry={onRetry} />
            ) : isLoading && !hasEmployees ? (
              <TableSkeleton />
            ) : !hasEmployees ? (
              <EmptyState />
            ) : (
              employees.map((employee) => <EmployeeRow key={employee.id} employee={employee} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="sm:hidden">
        {error ? (
          <MobileErrorState message={error} onRetry={onRetry} />
        ) : isLoading && !hasEmployees ? (
          <MobileSkeleton />
        ) : !hasEmployees ? (
          <MobileEmptyState />
        ) : (
          <div className="space-y-3 p-3">
            {employees.map((employee) => (
              <MobileEmployeeCard key={employee.id} employee={employee} />
            ))}
          </div>
        )}
      </div>

      {pagination ? <Pagination pagination={pagination} onPageChange={onPageChange} /> : null}
    </Card>
  );
}

export default EmployeeTable;