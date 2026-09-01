// client/src/features/analytics/hooks/use-analytics.ts
import { useCallback, useEffect, useRef, useState } from 'react';

import { analyticsApi } from '../api/analytics-api';

import type { AnalyticsData, AnalyticsQueryFilters } from '../types/analytics';

const DEFAULT_FILTERS: AnalyticsQueryFilters = {
  countryCode: '',
  department: '',
  role: '',
  currency: '',
};

export interface UseAnalyticsResult {
  data: AnalyticsData | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  filters: AnalyticsQueryFilters;

  updateFilter: (key: keyof AnalyticsQueryFilters, value: string) => void;

  resetFilters: () => void;

  reload: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return 'Unable to load analytics data.';
}

function isAbortError(error: unknown): boolean {
  if (typeof DOMException !== 'undefined' && error instanceof DOMException) {
    return error.name === 'AbortError';
  }

  if (typeof error === 'object' && error !== null) {
    const possibleError = error as {
      code?: string;
      name?: string;
    };

    return possibleError.code === 'ERR_CANCELED' || possibleError.name === 'AbortError';
  }

  return false;
}

export function useAnalytics(): UseAnalyticsResult {
  const [data, setData] = useState<AnalyticsData | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<AnalyticsQueryFilters>(DEFAULT_FILTERS);

  const requestControllerRef = useRef<AbortController | null>(null);

  const mountedRef = useRef<boolean>(true);

  const requestIdRef = useRef<number>(0);

  const dataRef = useRef<AnalyticsData | null>(null);

  const filtersRef = useRef<AnalyticsQueryFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      requestControllerRef.current?.abort();
      requestControllerRef.current = null;
    };
  }, []);

  const loadAnalytics = useCallback(
    async (
      nextFilters: AnalyticsQueryFilters,
      options: {
        initial?: boolean;
      } = {},
    ): Promise<void> => {
      const isInitialLoad = options.initial === true || dataRef.current === null;

      requestControllerRef.current?.abort();

      const controller = new AbortController();

      requestControllerRef.current = controller;

      const requestId = ++requestIdRef.current;

      if (isInitialLoad) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError(null);

      try {
        const result = await analyticsApi.getAll(nextFilters, controller.signal);

        const isCurrentRequest = mountedRef.current && requestId === requestIdRef.current;

        if (!isCurrentRequest) {
          return;
        }

        dataRef.current = result;

        setData(result);
      } catch (requestError) {
        const isCurrentRequest = mountedRef.current && requestId === requestIdRef.current;

        if (!isCurrentRequest || isAbortError(requestError)) {
          return;
        }

        setError(getErrorMessage(requestError));
      } finally {
        const isCurrentRequest = mountedRef.current && requestId === requestIdRef.current;

        if (isCurrentRequest) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [],
  );

  const reload = useCallback(async (): Promise<void> => {
    await loadAnalytics(filtersRef.current, {
      initial: dataRef.current === null,
    });
  }, [loadAnalytics]);

  useEffect(() => {
    void loadAnalytics(DEFAULT_FILTERS, {
      initial: true,
    });

    // Analytics intentionally load once on mount.
    // Filter changes are handled explicitly by updateFilter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFilter = useCallback(
    (key: keyof AnalyticsQueryFilters, value: string): void => {
      const nextFilters: AnalyticsQueryFilters = {
        ...filtersRef.current,
        [key]: value,
      };

      filtersRef.current = nextFilters;

      setFilters(nextFilters);

      void loadAnalytics(nextFilters, {
        initial: false,
      });
    },
    [loadAnalytics],
  );

  const resetFilters = useCallback((): void => {
    filtersRef.current = DEFAULT_FILTERS;

    setFilters(DEFAULT_FILTERS);

    void loadAnalytics(DEFAULT_FILTERS, {
      initial: false,
    });
  }, [loadAnalytics]);

  return {
    data,
    loading,
    refreshing,
    error,
    filters,
    updateFilter,
    resetFilters,
    reload,
  };
}