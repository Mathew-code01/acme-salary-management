// server/tests/fixtures/salary.fixture.ts

export const salaryFixture = {
  id: 1,

  employeeId: 1,

  amountCents: 120_000_00,

  currency: 'USD',

  effectiveFrom: new Date('2026-01-01T00:00:00.000Z'),

  createdAt: new Date('2026-01-01T00:00:00.000Z'),

  updatedAt: new Date('2026-01-01T00:00:00.000Z'),

  employee: {
    id: 1,

    employeeCode: 'EMP-0001',

    firstName: 'John',

    lastName: 'Doe',

    email: 'john.doe@example.com',

    country: {
      id: 1,
      code: 'US',
      name: 'United States',
    },

    department: {
      id: 1,
      name: 'Engineering',
    },

    role: {
      id: 1,
      name: 'Software Engineer',
    },
  },
};

export const secondSalaryFixture = {
  id: 2,

  employeeId: 2,

  amountCents: 95_000_00,

  currency: 'USD',

  effectiveFrom: new Date('2026-01-01T00:00:00.000Z'),

  createdAt: new Date('2026-01-01T00:00:00.000Z'),

  updatedAt: new Date('2026-01-01T00:00:00.000Z'),

  employee: {
    id: 2,

    employeeCode: 'EMP-0002',

    firstName: 'Jane',

    lastName: 'Smith',

    email: 'jane.smith@example.com',

    country: {
      id: 1,
      code: 'US',
      name: 'United States',
    },

    department: {
      id: 1,
      name: 'Engineering',
    },

    role: {
      id: 1,
      name: 'Senior Software Engineer',
    },
  },
};
