// client/src/pages/EmployeesPage.tsx
import { Plus, RefreshCw, SlidersHorizontal, X } from 'lucide-react';

import { Link } from 'react-router-dom';

import { PageContainer } from '../components/layout/PageContainer';

import { PageHeader } from '../components/layout/PageHeader';

import { Card } from '../components/ui/card';

import { EmployeeFilters } from '../features/employees/components/EmployeeFilters';
import { EmployeeSearch } from '../features/employees/components/EmployeeSearch';
import { EmployeeSummary } from '../features/employees/components/EmployeeSummary';

import EmployeeTable from '../features/employees/components/EmployeeTable';

import { useEmployees } from '../features/employees/hooks/use-employees';

import { hasActiveEmployeeFilters } from '../features/employees/utils/employee-filters';

function EmployeesPage() {
  const {
    data,
    filters,
    options,

    isLoading,
    isRefreshing,
    isLoadingOptions,

    error,
    optionsError,

    setSearch,
    setCountryId,
    setDepartmentId,
    setRoleId,

    setPage,
    resetFilters,

    refresh,
    retryOptions,
  } = useEmployees();

  const hasFilters = hasActiveEmployeeFilters(filters);

  return (
    <PageContainer>
      <PageHeader
        title="Employees"
        description="Manage employee records, organizational information, and compensation data."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                void refresh();
              }}
              disabled={isRefreshing}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={isRefreshing ? 'h-4 w-4 animate-spin' : 'h-4 w-4'}
                aria-hidden="true"
              />

              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              to="/employees/new"
              className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />

              <span>Add employee</span>
            </Link>
          </div>
        }
      />

      <Card className="mb-6">
        <div className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <div className="min-w-0 flex-1">
                <EmployeeSearch
                  value={filters.search}
                  onChange={setSearch}
                  disabled={isLoading && !data}
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />

                <span>Search updates automatically</span>
              </div>
            </div>

            <EmployeeFilters
              filters={filters}
              options={options}
              isLoading={isLoadingOptions}
              onCountryChange={setCountryId}
              onDepartmentChange={setDepartmentId}
              onRoleChange={setRoleId}
            />

            {optionsError ? (
              <div className="flex flex-col gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between">
                <p className="text-destructive">{optionsError}</p>

                <button
                  type="button"
                  onClick={() => {
                    void retryOptions();
                  }}
                  className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/30"
                >
                  Retry filters
                </button>
              </div>
            ) : null}

            {hasFilters ? (
              <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
                <span className="text-xs font-medium text-muted-foreground">Active filters:</span>

                {filters.search ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                    Search: {filters.search}
                  </span>
                ) : null}

                {filters.countryId !== null ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                    Country
                  </span>
                ) : null}

                {filters.departmentId !== null ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                    Department
                  </span>
                ) : null}

                {filters.roleId !== null ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                    Role
                  </span>
                ) : null}

                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  Clear all
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </Card>

      <div className="mb-4 flex items-center justify-between">
        <EmployeeSummary pagination={data?.pagination ?? null} />

        {isRefreshing ? (
          <span className="text-xs text-muted-foreground">Updating results...</span>
        ) : null}
      </div>

      <EmployeeTable
        employees={data?.items ?? []}
        pagination={data?.pagination ?? null}
        isLoading={isLoading}
        error={error}
        onPageChange={setPage}
        onRetry={refresh}
      />
    </PageContainer>
  );
}

export default EmployeesPage;