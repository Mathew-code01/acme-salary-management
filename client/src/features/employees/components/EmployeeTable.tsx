// client/src/features/employees/components/EmployeeTable.tsx

import { AlertCircle, ChevronLeft, ChevronRight, Users } from 'lucide-react';

import { Card } from '../../../components/ui/card';

import type { Employee, EmployeePagination } from '../types/employee';

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
        <tr key={index} className="border-b border-border last:border-0">
          {Array.from({ length: 7 }).map((_, cellIndex) => (
            <td key={cellIndex} className="px-4 py-4">
              <div className="h-4 w-full max-w-[160px] animate-pulse rounded bg-muted" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={7} className="px-6 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted"
            aria-hidden="true"
          >
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>

          <h3 className="text-sm font-semibold text-foreground">No employees found</h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
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
        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10"
            aria-hidden="true"
          >
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>

          <h3 className="text-sm font-semibold text-foreground">Unable to load employees</h3>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">{message}</p>

          <button
            type="button"
            onClick={() => {
              void onRetry();
            }}
            className="mt-5 inline-flex h-9 items-center rounded-md border border-border px-3 text-sm font-medium text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            Try again
          </button>
        </div>
      </td>
    </tr>
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
    <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground">
        Page <span className="font-medium text-foreground">{currentPage}</span> of{' '}
        <span className="font-medium text-foreground">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!pagination.hasPreviousPage}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
          className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm font-medium text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />

          <span className="hidden sm:inline">Previous</span>
        </button>

        <button
          type="button"
          disabled={!pagination.hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
          className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm font-medium text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="hidden sm:inline">Next</span>

          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
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
  return (
    <Card className="overflow-hidden" aria-label="Employee directory">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] border-collapse text-left">
          <caption className="sr-only">Employee directory</caption>

          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Employee
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Email
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Country
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Department
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Role
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Status
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {error ? (
              <ErrorState message={error} onRetry={onRetry} />
            ) : isLoading && employees.length === 0 ? (
              <TableSkeleton />
            ) : employees.length === 0 ? (
              <EmptyState />
            ) : (
              employees.map((employee) => <EmployeeRow key={employee.id} employee={employee} />)
            )}
          </tbody>
        </table>
      </div>

      {pagination ? <Pagination pagination={pagination} onPageChange={onPageChange} /> : null}
    </Card>
  );
}

export default EmployeeTable;