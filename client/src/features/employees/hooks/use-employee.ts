
// client/src/features/employees/hooks/use-employee.ts

import { useQuery } from '@tanstack/react-query';

import { employeeApi } from '../api/employee-api';

export const employeeQueryKeys = {
  all: ['employees'] as const,

  detail: (employeeId: number) =>
    [...employeeQueryKeys.all, 'detail', employeeId] as const,
};

export function useEmployee(employeeId: number | null) {
  return useQuery({
    queryKey:
      employeeId === null
        ? [...employeeQueryKeys.all, 'detail', 'disabled']
        : employeeQueryKeys.detail(employeeId),

    queryFn: () => {
      if (employeeId === null) {
        throw new Error('Employee ID is required.');
      }

      return employeeApi.getById(employeeId);
    },

    enabled: employeeId !== null,

    staleTime: 30_000,

    retry: 2,
  });
}
