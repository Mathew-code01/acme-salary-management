// client/src/pages/EmployeesPage.tsx
import {
  CheckCircle2,
  Filter,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from 'lucide-react';

import { Link } from 'react-router-dom';

import { PageContainer } from '../components/layout/PageContainer';
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
  const employeeCount = data?.pagination?.total ?? 0;

  return (
    <PageContainer>
      <div className="min-w-0 space-y-5 sm:space-y-6">
        {/* Page header */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="absolute right-0 top-0 hidden h-40 w-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl sm:block" />

          <div className="relative p-4 sm:p-6 lg:p-7">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-12 sm:w-12">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                      Employees
                    </h1>

                    {!isLoading && data?.pagination ? (
                      <span className="inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-2 py-0.5 text-[11px] font-semibold text-primary sm:text-xs">
                        {employeeCount.toLocaleString()} records
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 max-w-2xl text-sm leading-5 text-muted-foreground sm:mt-1.5 sm:text-[15px]">
                    Manage employee records, organizational information, and compensation data from
                    one centralized directory.
                  </p>
                </div>
              </div>

              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    void refresh();
                  }}
                  disabled={isRefreshing}
                  className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                >
                  <RefreshCw
                    className={isRefreshing ? 'h-4 w-4 animate-spin' : 'h-4 w-4'}
                    aria-hidden="true"
                  />

                  <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>

                <Link
                  to="/employees/new"
                  className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/30 sm:flex-none"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>Add employee</span>
                </Link>
              </div>
            </div>

            {/* Quick status strip */}
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
              <div className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                <span>Employee directory</span>
              </div>

              <span className="hidden text-border sm:inline">•</span>

              <div className="inline-flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Search and filters</span>
              </div>

              <span className="hidden text-border sm:inline">•</span>

              <div className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Paginated results</span>
              </div>
            </div>
          </div>
        </section>

        {/* Search and filters */}
        <Card className="overflow-hidden border-border/80 shadow-sm">
          <div className="border-b border-border bg-muted/20 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Filter className="h-4 w-4" aria-hidden="true" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-foreground">Find employees</h2>

                <p className="hidden text-xs text-muted-foreground sm:block">
                  Search the directory or narrow results using organizational filters.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="employee-search"
                  className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Search directory
                </label>

                <EmployeeSearch
                  value={filters.search}
                  onChange={setSearch}
                  disabled={isLoading && !data}
                />

                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground sm:text-xs">
                  <Search className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Search updates automatically as you type.</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="mb-3 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden="true" />

                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Organization filters
                  </span>
                </div>

                <EmployeeFilters
                  filters={filters}
                  options={options}
                  isLoading={isLoadingOptions}
                  onCountryChange={setCountryId}
                  onDepartmentChange={setDepartmentId}
                  onRoleChange={setRoleId}
                />
              </div>

              {optionsError ? (
                <div className="flex flex-col gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-destructive">
                      Filter options could not be loaded.
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      You can retry without losing your current search.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      void retryOptions();
                    }}
                    className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/30"
                  >
                    Retry filters
                  </button>
                </div>
              ) : null}

              {hasFilters ? (
                <div className="border-t border-border pt-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">Active:</span>

                      {filters.search ? (
                        <span className="inline-flex max-w-full items-center rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary">
                          <span className="truncate">Search: {filters.search}</span>
                        </span>
                      ) : null}

                      {filters.countryId !== null ? (
                        <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground">
                          Country
                        </span>
                      ) : null}

                      {filters.departmentId !== null ? (
                        <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground">
                          Department
                        </span>
                      ) : null}

                      {filters.roleId !== null ? (
                        <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground">
                          Role
                        </span>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex min-h-8 shrink-0 items-center justify-center gap-1.5 self-start rounded-lg px-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                      Clear all
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </Card>

        {/* Results header */}
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-foreground sm:text-lg">
                Employee directory
              </h2>

              {hasFilters ? (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary sm:text-xs">
                  Filtered
                </span>
              ) : null}
            </div>

            <div className="mt-1">
              <EmployeeSummary pagination={data?.pagination ?? null} />
            </div>
          </div>

          {isRefreshing ? (
            <div
              role="status"
              aria-live="polite"
              className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground"
            >
              <RefreshCw className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              Updating results...
            </div>
          ) : null}
        </div>

        {/* Results */}
        <EmployeeTable
          employees={data?.items ?? []}
          pagination={data?.pagination ?? null}
          isLoading={isLoading}
          error={error}
          onPageChange={setPage}
          onRetry={refresh}
        />

        {/* Small-screen information */}
        <div className="rounded-xl border border-border bg-muted/20 px-4 py-3 text-xs leading-5 text-muted-foreground sm:hidden">
          <span className="font-medium text-foreground">Mobile view:</span> employee records are
          displayed as compact cards so the directory remains readable without horizontal scrolling.
        </div>
      </div>
    </PageContainer>
  );
}

export default EmployeesPage;