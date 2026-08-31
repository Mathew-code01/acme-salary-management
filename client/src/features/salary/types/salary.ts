export const SALARY_CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'NGN',
  'ZAR',
  'KES',
  'GHS',
  'UGX',
  'CAD',
  'AUD',
  'CHF',
  'JPY',
  'CNY',
  'INR',
] as const;

export type SalaryCurrency = (typeof SALARY_CURRENCIES)[number];

export interface Salary {
  id: number;
  employeeId: number;
  amountCents: number;
  currency: string;
  effectiveFrom: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryEmployee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;

  country: {
    id: number;
    code: string;
    name: string;
  };

  department: {
    id: number;
    name: string;
  };

  role: {
    id: number;
    name: string;
  };
}

export interface SalaryResponse extends Salary {
  employee: SalaryEmployee;
}

export interface CreateSalaryInput {
  employeeId: number;
  amountCents: number;
  currency: string;
  effectiveFrom: string;
}

export interface UpdateSalaryInput {
  amountCents?: number;
  currency?: string;
  effectiveFrom?: string;
}

export interface SalaryFormValues {
  amount: string;
  currency: string;
  effectiveFrom: string;
}

export interface SalarySummary {
  amountCents: number;
  currency: string;
  effectiveFrom: string;
  annualAmountCents: number;
}

export interface SalaryMutationResult {
  id: number;
  employeeId: number;
  amountCents: number;
  currency: string;
  effectiveFrom: string;
  createdAt: string;
  updatedAt: string;
}
