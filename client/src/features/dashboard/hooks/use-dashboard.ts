// client/src/features/dashboard/hooks/use-dashboard.ts

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { dashboardApi } from '../api/dashboard-api';

import type { DashboardData, DashboardFilters } from '../types/dashboard';

interface UseDashboardResult {
  data: DashboardData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  generatedAt: string | null;
  refresh: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to load dashboard analytics.';
}

export function useDashboard(filters: DashboardFilters = {}): UseDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  /**
   * Tracks the latest dashboard request.
   *
   * This prevents an older request from overwriting
   * newer dashboard data when filters change quickly
   * or when the user manually refreshes.
   */
  const requestIdRef = useRef(0);

  /**
   * Keep the serialized filter representation stable.
   *
   * This is important because callers may provide a new
   * object reference on every render even when the actual
   * filter values have not changed.
   */
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  /**
   * Reconstruct the exact filter object used for the
   * current callback execution.
   *
   * Using filtersKey as the dependency prevents the
   * callback from changing simply because the parent
   * created a new filters object.
   */
  const loadDashboard = useCallback(
    async (refresh = false): Promise<void> => {
      const requestId = ++requestIdRef.current;

      const controller = new AbortController();

      const currentFilters = JSON.parse(filtersKey) as DashboardFilters;

      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const [overview, distribution, countries, departments] = await Promise.all([
          dashboardApi.getOverview(currentFilters, controller.signal),

          dashboardApi.getDistribution(currentFilters, controller.signal),

          dashboardApi.getCountries(currentFilters, controller.signal),

          dashboardApi.getDepartments(currentFilters, controller.signal),
        ]);

        /**
         * Ignore stale responses.
         *
         * If another request has already started, this
         * response must not replace the newer dashboard data.
         */
        if (requestId === requestIdRef.current) {
          setData({
            overview,
            distribution,
            countries,
            departments,
          });

          setGeneratedAt(new Date().toISOString());
        }
      } catch (requestError: unknown) {
        /**
         * Abort errors are expected during cleanup or
         * when a newer request supersedes the current one.
         */
        if (requestError instanceof DOMException && requestError.name === 'AbortError') {
          return;
        }

        /**
         * Ignore errors belonging to stale requests.
         */
        if (requestId !== requestIdRef.current) {
          return;
        }

        setError(getErrorMessage(requestError));
      } finally {
        /**
         * IMPORTANT:
         *
         * Do NOT return from finally.
         *
         * ESLint's no-unsafe-finally rule correctly
         * prevents control-flow statements such as
         * return inside finally because they can override
         * return/throw behavior from try/catch.
         *
         * We simply conditionally update state instead.
         */
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [filtersKey],
  );

  /**
   * Load dashboard whenever the effective filters change.
   */
  useEffect(() => {
    void loadDashboard(false);

    return () => {
      /**
       * Invalidate the current request.
       *
       * Any response from the previous request will now
       * be treated as stale and ignored.
       */
      requestIdRef.current += 1;
    };
  }, [loadDashboard]);

  /**
   * Manual dashboard refresh.
   */
  const refresh = useCallback(async (): Promise<void> => {
    await loadDashboard(true);
  }, [loadDashboard]);

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    generatedAt,
    refresh,
  };
}
