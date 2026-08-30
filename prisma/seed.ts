// prisma/seed.ts

import 'dotenv/config';

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../server/src/generated/prisma/client';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

const EMPLOYEE_COUNT = 10_000;

const SEED = 0x5eed2026;

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'KE', name: 'Kenya' },
  { code: 'AU', name: 'Australia' },
  { code: 'SG', name: 'Singapore' },
] as const;

const departments = [
  'Engineering',
  'Finance',
  'Human Resources',
  'Marketing',
  'Sales',
  'Operations',
  'Legal',
  'Product',
  'Customer Success',
  'Information Technology',
] as const;

const salaryBaseByRole: Record<string, number> = {
  'Software Engineer': 42_000,
  'Senior Software Engineer': 65_000,
  'Staff Engineer': 95_000,
  'Engineering Manager': 105_000,
  'Product Manager': 70_000,
  'Financial Analyst': 58_000,
  'HR Specialist': 48_000,
  'Marketing Manager': 68_000,
  'Sales Representative': 45_000,
  'Operations Manager': 62_000,
  'Legal Counsel': 82_000,
  'Data Analyst': 60_000,
};


const roles = [
  'Software Engineer',
  'Senior Software Engineer',
  'Staff Engineer',
  'Engineering Manager',
  'Product Manager',
  'Financial Analyst',
  'HR Specialist',
  'Marketing Manager',
  'Sales Representative',
  'Operations Manager',
  'Legal Counsel',
  'Data Analyst',
] as const;

const firstNames = [
  'Avery',
  'Jordan',
  'Taylor',
  'Morgan',
  'Riley',
  'Casey',
  'Cameron',
  'Drew',
  'Alex',
  'Jamie',
  'Quinn',
  'Parker',
  'Reese',
  'Rowan',
  'Blake',
  'Elliot',
  'Logan',
  'Emerson',
  'Hayden',
  'Finley',
] as const;

const lastNames = [
  'Adams',
  'Bennett',
  'Brooks',
  'Carter',
  'Collins',
  'Cooper',
  'Davis',
  'Edwards',
  'Foster',
  'Garcia',
  'Green',
  'Harris',
  'Johnson',
  'King',
  'Lewis',
  'Martin',
  'Miller',
  'Mitchell',
  'Morgan',
  'Parker',
  'Roberts',
  'Scott',
  'Smith',
  'Taylor',
  'Thomas',
  'Turner',
  'Walker',
  'White',
  'Williams',
  'Wilson',
] as const;

const currenciesByCountry: Record<string, string> = {
  US: 'USD',
  GB: 'GBP',
  CA: 'CAD',
  DE: 'EUR',
  FR: 'EUR',
  NG: 'NGN',
  ZA: 'ZAR',
  KE: 'KES',
  AU: 'AUD',
  SG: 'SGD',
};

function createRng(seed: number) {
  let state = seed >>> 0;

  return function random(): number {
    state += 0x6d2b79f5;

    let value = state;

    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)]!;
}

function randomInt(random: () => number, minimum: number, maximum: number): number {
  return Math.floor(random() * (maximum - minimum + 1)) + minimum;
}

function createSalaryCents(random: () => number, roleName: string): number {
  const baseSalary = salaryBaseByRole[roleName] ?? 55_000;

  const variation = randomInt(random, -8_000, 18_000);

  const annualSalary = Math.max(30_000, baseSalary + variation);

  return annualSalary * 100;
}

function createEffectiveDate(random: () => number, employeeIndex: number): Date {
  const start = new Date('2022-01-01T00:00:00.000Z');
  const end = new Date('2026-01-01T00:00:00.000Z');

  const range = end.getTime() - start.getTime();

  const offset = Math.floor(random() * range);

  const date = new Date(start.getTime() + offset);

  date.setUTCHours(0, 0, 0, 0);

  // Keep the parameter meaningful and deterministic.
  if (employeeIndex % 5 === 0) {
    date.setUTCDate(1);
  }

  return date;
}

async function seedReferenceData() {
  for (const country of countries) {
    await prisma.country.upsert({
      where: {
        code: country.code,
      },
      update: {
        name: country.name,
      },
      create: {
        code: country.code,
        name: country.name,
      },
    });
  }

  for (const name of departments) {
    await prisma.department.upsert({
      where: {
        name,
      },
      update: {},
      create: {
        name,
      },
    });
  }

  for (const name of roles) {
    await prisma.role.upsert({
      where: {
        name,
      },
      update: {},
      create: {
        name,
      },
    });
  }
}

async function seedEmployees() {
  const random = createRng(SEED);

  const countryRecords = await prisma.country.findMany({
    select: {
      id: true,
      code: true,
    },
    orderBy: {
      id: 'asc',
    },
  });

  const departmentRecords = await prisma.department.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      id: 'asc',
    },
  });

  const roleRecords = await prisma.role.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      id: 'asc',
    },
  });

  if (
    countryRecords.length !== countries.length ||
    departmentRecords.length !== departments.length ||
    roleRecords.length !== roles.length
  ) {
    throw new Error('Reference data is incomplete. Seed cannot continue.');
  }

  const employeeRows: Array<{
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    countryId: number;
    departmentId: number;
    roleId: number;
  }> = [];

  for (let index = 1; index <= EMPLOYEE_COUNT; index += 1) {
    const firstName = pick(firstNames, random);
    const lastName = pick(lastNames, random);

    const country = pick(countryRecords, random);
    const department = pick(departmentRecords, random);
    const role = pick(roleRecords, random);

    const employeeCode = `EMP-${String(index).padStart(6, '0')}`;

    const normalizedFirstName = firstName.toLowerCase();
    const normalizedLastName = lastName.toLowerCase();

    const email = `${normalizedFirstName}.${normalizedLastName}.${String(index).padStart(5, '0')}@acme.example`;

    employeeRows.push({
      employeeCode,
      firstName,
      lastName,
      email,
      countryId: country.id,
      departmentId: department.id,
      roleId: role.id,
    });
  }

  await prisma.employee.createMany({
    data: employeeRows,
  });
}

async function seedSalaries() {
  const random = createRng(SEED ^ 0xabcdef);

  const employees = await prisma.employee.findMany({
    select: {
      id: true,
      employeeCode: true,
      role: {
        select: {
          name: true,
        },
      },
      country: {
        select: {
          code: true,
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  });

  if (employees.length !== EMPLOYEE_COUNT) {
    throw new Error(`Expected ${EMPLOYEE_COUNT} employees but found ${employees.length}.`);
  }

  const existingSalaryCount = await prisma.salary.count();

  if (existingSalaryCount > 0) {
    await prisma.salary.deleteMany();
  }

  const salaryRows = employees.map((employee, index) => {
    const amountCents = createSalaryCents(random, employee.role.name);

    const currency = currenciesByCountry[employee.country.code] ?? 'USD';

    return {
      employeeId: employee.id,
      amountCents,
      currency,
      effectiveFrom: createEffectiveDate(random, index + 1),
    };
  });

  await prisma.salary.createMany({
    data: salaryRows,
  });
}

async function verifySeed() {
  const [countryCount, departmentCount, roleCount, employeeCount, salaryCount] = await Promise.all([
    prisma.country.count(),
    prisma.department.count(),
    prisma.role.count(),
    prisma.employee.count(),
    prisma.salary.count(),
  ]);

  const result = {
    countries: countryCount,
    departments: departmentCount,
    roles: roleCount,
    employees: employeeCount,
    salaries: salaryCount,
  };

  console.log('Seed verification:');
  console.table(result);

  if (countryCount !== countries.length) {
    throw new Error('Country seed verification failed.');
  }

  if (departmentCount !== departments.length) {
    throw new Error('Department seed verification failed.');
  }

  if (roleCount !== roles.length) {
    throw new Error('Role seed verification failed.');
  }

  if (employeeCount !== EMPLOYEE_COUNT) {
    throw new Error(
      `Employee verification failed. Expected ${EMPLOYEE_COUNT}, got ${employeeCount}.`,
    );
  }

  if (salaryCount !== EMPLOYEE_COUNT) {
    throw new Error(`Salary verification failed. Expected ${EMPLOYEE_COUNT}, got ${salaryCount}.`);
  }
}

async function resetSeedData() {
  console.log('Clearing existing seed data...');

  await prisma.salary.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.role.deleteMany();
  await prisma.department.deleteMany();
  await prisma.country.deleteMany();
}

async function main() {
  console.log('Starting deterministic database seed...');
  console.log(`Seed: ${SEED}`);
  console.log(`Employees: ${EMPLOYEE_COUNT}`);

  await resetSeedData();

  await seedReferenceData();

  await seedEmployees();

  await seedSalaries();

  await verifySeed();

  console.log('Database seed completed successfully.');
}

main()
  .catch((error: unknown) => {
    console.error('Database seed failed.');

    console.error(error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
