import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '@/lib/api-client';

import { salaryApi } from '@/features/salary/api/salary-api';

vi.mock('@/lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedApiClient =
  vi.mocked(apiClient);

describe(
  'salaryApi',
  () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it(
      'gets salary by id',
      async () => {
        const salary = {
          id: 1,
          employeeId: 10,
          amount: 75000,
          currency: 'USD',
        };

        mockedApiClient.get.mockResolvedValueOnce({
          data: {
            success: true,
            data: salary,
          },
        });

        const result =
          await salaryApi.getById(1);

        expect(
          mockedApiClient.get,
        ).toHaveBeenCalledWith(
          '/salaries/1',
        );

        expect(result).toEqual(
          salary,
        );
      },
    );

    it(
      'creates salary',
      async () => {
        const input = {
          employeeId: 10,
          amount: 75000,
          currency: 'USD',
        };

        const salary = {
          id: 1,
          ...input,
        };

        mockedApiClient.post.mockResolvedValueOnce({
          data: {
            success: true,
            data: salary,
          },
        });

        const result =
          await salaryApi.create(input);

        expect(
          mockedApiClient.post,
        ).toHaveBeenCalledWith(
          '/salaries',
          input,
        );

        expect(result).toEqual(
          salary,
        );
      },
    );

    it(
      'updates salary',
      async () => {
        const input = {
          amount: 85000,
          currency: 'USD',
        };

        const salary = {
          id: 1,
          employeeId: 10,
          ...input,
        };

        mockedApiClient.patch.mockResolvedValueOnce({
          data: {
            success: true,
            data: salary,
          },
        });

        const result =
          await salaryApi.update(
            1,
            input,
          );

        expect(
          mockedApiClient.patch,
        ).toHaveBeenCalledWith(
          '/salaries/1',
          input,
        );

        expect(result).toEqual(
          salary,
        );
      },
    );

    it(
      'deletes salary',
      async () => {
        mockedApiClient.delete.mockResolvedValueOnce({
          data: {
            success: true,
            data: {
              id: 1,
            },
          },
        });

        const result =
          await salaryApi.delete(1);

        expect(
          mockedApiClient.delete,
        ).toHaveBeenCalledWith(
          '/salaries/1',
        );

        expect(result).toEqual({
          id: 1,
        });
      },
    );
  },
);