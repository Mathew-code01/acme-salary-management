// server/tests/fixtures/employee.fixture.ts

// server/tests/fixtures/employee.fixture.ts

export const employeeFixture = {
  id: 1,

  employeeCode: 'EMP-0001',

  firstName: 'John',

  lastName: 'Doe',

  email: 'john.doe@example.com',

  countryId: 1,

  departmentId: 1,

  roleId: 1,

  createdAt: new Date('2026-01-01T00:00:00.000Z'),

  updatedAt: new Date('2026-01-01T00:00:00.000Z'),

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

  /**
   * Employee has a one-to-one salary relation.
   *
   * The repository includes this relation in its
   * returned Employee type, so the fixture must
   * explicitly provide it.
   *
   * `null` represents an employee without a salary.
   */
  salary: null,
};

export const secondEmployeeFixture = {
  ...employeeFixture,

  id: 2,

  employeeCode: 'EMP-0002',

  firstName: 'Jane',

  lastName: 'Smith',

  email: 'jane.smith@example.com',
};