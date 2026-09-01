import { act, renderHook, waitFor } from '@testing-library/react';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { analyticsApi } from '@/features/analytics/api/analytics-api';

import { useAnalytics } from '@/features/analytics/hooks/use-analytics';

vi.mock('@/features/analytics/api/analytics-api', () => ({
  analyticsApi: {
    getAll: vi.fn(),
  },
}));

const mockedAnalyticsApi = vi.mocked(analyticsApi);

const analyticsFixture = {
  overview: {
    totalEmployees: 10000,
    totalPayroll: 125000000,
    averageSalary: 12500,
    medianSalary: 11200,
  },

  distribution: [],

  countries: [],

  departments: [],

  roles: [],
};

describe('useAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedAnalyticsApi.getAll.mockResolvedValue(analyticsFixture);
  });

  it('loads analytics on mount', async () => {
    const { result } = renderHook(() => useAnalytics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(analyticsFixture);

    expect(mockedAnalyticsApi.getAll).toHaveBeenCalledTimes(1);
  });

  it('updates analytics when a filter changes', async () => {
    const { result } = renderHook(() => useAnalytics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.updateFilter('department', 'Engineering');
    });

    await waitFor(() => {
      expect(result.current.refreshing).toBe(false);
    });

    expect(result.current.filters.department).toBe('Engineering');

    expect(mockedAnalyticsApi.getAll).toHaveBeenLastCalledWith(
      {
        countryCode: '',
        department: 'Engineering',
        role: '',
        currency: '',
      },
      expect.any(AbortSignal),
    );
  });

  it('resets analytics filters', async () => {
    const { result } = renderHook(() => useAnalytics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.updateFilter('role', 'Software Engineer');
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters).toEqual({
      countryCode: '',
      department: '',
      role: '',
      currency: '',
    });
  });

  it('exposes API errors', async () => {
    mockedAnalyticsApi.getAll.mockRejectedValueOnce(new Error('Analytics service unavailable'));

    const { result } = renderHook(() => useAnalytics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Analytics service unavailable');
  });

  it('ignores aborted requests', async () => {
    const abortError = new DOMException('Request aborted', 'AbortError');

    mockedAnalyticsApi.getAll.mockRejectedValueOnce(abortError);

    const { result } = renderHook(() => useAnalytics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
  });
});
