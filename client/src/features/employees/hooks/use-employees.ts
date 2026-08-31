
// client/src/features/employees/hooks/use-employees.ts

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { employeesApi } from "../api/employees-api";

import type {
  EmployeeFilterOptions,
  EmployeeListFilters,
  EmployeeListResponse,
} from "../types/employee";

import {
  createDefaultEmployeeFilters,
  createEmployeeQuery,
} from "../utils/employee-filters";

const DEFAULT_PAGE_SIZE = 25;
const SEARCH_DEBOUNCE_MS = 350;

interface UseEmployeesResult {
  data: EmployeeListResponse | null;
  filters: EmployeeListFilters;
  options: EmployeeFilterOptions;

  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingOptions: boolean;

  error: string | null;
  optionsError: string | null;

  setSearch: (search: string) => void;
  setCountryId: (countryId: number | null) => void;
  setDepartmentId: (departmentId: number | null) => void;
  setRoleId: (roleId: number | null) => void;

  setPage: (page: number) => void;
  resetFilters: () => void;

  refresh: () => Promise<void>;
  retryOptions: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Unable to load employees. Please try again.";
}

function isAbortError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    error.name === "AbortError"
  );
}

export function useEmployees(): UseEmployeesResult {
  const [filters, setFilters] = useState<EmployeeListFilters>(
    createDefaultEmployeeFilters,
  );

  const [page, setPage] = useState(1);

  const [data, setData] = useState<EmployeeListResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [options, setOptions] =
    useState<EmployeeFilterOptions>({
      countries: [],
      departments: [],
      roles: [],
    });

  const [isLoadingOptions, setIsLoadingOptions] =
    useState(true);

  const [optionsError, setOptionsError] =
    useState<string | null>(null);

  const requestIdRef = useRef(0);
  const optionsRequestIdRef = useRef(0);

  const abortControllerRef =
    useRef<AbortController | null>(null);

  const debouncedSearch = useDebouncedValue(
    filters.search,
    SEARCH_DEBOUNCE_MS,
  );

  const effectiveFilters = useMemo<EmployeeListFilters>(
    () => ({
      ...filters,
      search: debouncedSearch,
    }),
    [filters, debouncedSearch],
  );

  const loadEmployees = useCallback(
    async (refresh = false): Promise<void> => {
      const requestId = ++requestIdRef.current;

      abortControllerRef.current?.abort();

      const controller = new AbortController();

      abortControllerRef.current = controller;

      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const query = createEmployeeQuery(
          effectiveFilters,
          page,
          DEFAULT_PAGE_SIZE,
        );

        const result = await employeesApi.getEmployees(
          query,
          controller.signal,
        );

        const requestIsCurrent =
          !controller.signal.aborted &&
          requestId === requestIdRef.current;

        if (requestIsCurrent) {
          setData(result);
        }
      } catch (requestError: unknown) {
        const requestIsCurrent =
          !controller.signal.aborted &&
          requestId === requestIdRef.current;

        if (requestIsCurrent && !isAbortError(requestError)) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        const requestIsCurrent =
          requestId === requestIdRef.current;

        if (requestIsCurrent) {
          setIsLoading(false);
          setIsRefreshing(false);

          if (abortControllerRef.current === controller) {
            abortControllerRef.current = null;
          }
        }
      }
    },
    [effectiveFilters, page],
  );

  const loadOptions = useCallback(
    async (): Promise<void> => {
      const requestId = ++optionsRequestIdRef.current;

      const controller = new AbortController();

      setIsLoadingOptions(true);
      setOptionsError(null);

      try {
        const [countries, departments, roles] =
          await Promise.all([
            employeesApi.getCountries(controller.signal),
            employeesApi.getDepartments(controller.signal),
            employeesApi.getRoles(controller.signal),
          ]);

        const requestIsCurrent =
          !controller.signal.aborted &&
          requestId === optionsRequestIdRef.current;

        if (requestIsCurrent) {
          setOptions({
            countries,
            departments,
            roles,
          });
        }
      } catch (requestError: unknown) {
        const requestIsCurrent =
          !controller.signal.aborted &&
          requestId === optionsRequestIdRef.current;

        if (
          requestIsCurrent &&
          !isAbortError(requestError)
        ) {
          setOptionsError(
            getErrorMessage(requestError) ||
              "Unable to load employee filters.",
          );
        }
      } finally {
        const requestIsCurrent =
          requestId === optionsRequestIdRef.current;

        if (requestIsCurrent) {
          setIsLoadingOptions(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    void loadOptions();
  }, [loadOptions]);

  useEffect(() => {
    void loadEmployees(false);

    return () => {
      abortControllerRef.current?.abort();
      requestIdRef.current += 1;
    };
  }, [loadEmployees]);

  const setSearch = useCallback(
    (search: string): void => {
      setPage(1);

      setFilters((current) => ({
        ...current,
        search,
      }));
    },
    [],
  );

  const setCountryId = useCallback(
    (countryId: number | null): void => {
      setPage(1);

      setFilters((current) => ({
        ...current,
        countryId,
      }));
    },
    [],
  );

  const setDepartmentId = useCallback(
    (departmentId: number | null): void => {
      setPage(1);

      setFilters((current) => ({
        ...current,
        departmentId,
      }));
    },
    [],
  );

  const setRoleId = useCallback(
    (roleId: number | null): void => {
      setPage(1);

      setFilters((current) => ({
        ...current,
        roleId,
      }));
    },
    [],
  );

  const resetFilters = useCallback((): void => {
    setFilters(createDefaultEmployeeFilters());
    setPage(1);
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    await loadEmployees(true);
  }, [loadEmployees]);

  const retryOptions = useCallback(
    async (): Promise<void> => {
      await loadOptions();
    },
    [loadOptions],
  );

  return {
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
  };
}

function useDebouncedValue<T>(
  value: T,
  delay: number,
): T {
  const [debouncedValue, setDebouncedValue] =
    useState<T>(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
}
