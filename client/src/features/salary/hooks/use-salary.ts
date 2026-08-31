import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { salaryApi } from '../api/salary-api';

import type { CreateSalaryInput, UpdateSalaryInput } from '../types/salary';

export const salaryQueryKeys = {
  all: ['salary'] as const,

  detail: (salaryId: number) => ['salary', 'detail', salaryId] as const,
};

export function useSalary(salaryId: number | null | undefined) {
  return useQuery({
    queryKey:
      salaryId !== null && salaryId !== undefined
        ? salaryQueryKeys.detail(salaryId)
        : ['salary', 'detail', 'disabled'],

    queryFn: () => {
      if (salaryId === null || salaryId === undefined) {
        throw new Error('Salary ID is required.');
      }

      return salaryApi.getById(salaryId);
    },

    enabled: salaryId !== null && salaryId !== undefined,

    staleTime: 30_000,

    retry: 2,
  });
}

export function useCreateSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSalaryInput) => salaryApi.create(input),

    onSuccess: async (salary) => {
      queryClient.setQueryData(salaryQueryKeys.detail(salary.id), salary);

      await queryClient.invalidateQueries({
        queryKey: ['employee'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['employees'],
      });
    },
  });
}

export function useUpdateSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ salaryId, input }: { salaryId: number; input: UpdateSalaryInput }) =>
      salaryApi.update(salaryId, input),

    onSuccess: async (salary) => {
      queryClient.setQueryData(salaryQueryKeys.detail(salary.id), salary);

      await queryClient.invalidateQueries({
        queryKey: ['employee'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['employees'],
      });
    },
  });
}

export function useDeleteSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (salaryId: number) => salaryApi.delete(salaryId),

    onSuccess: async (_, salaryId) => {
      queryClient.removeQueries({
        queryKey: salaryQueryKeys.detail(salaryId),
      });

      await queryClient.invalidateQueries({
        queryKey: ['employee'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['employees'],
      });
    },
  });
}
