-- prisma/migrations/0260829210000_init_salary_domain/migration.sql
-- CreateTable
CREATE TABLE "Country" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Department" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeCode" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "countryId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    CONSTRAINT "Employee_countryId_fkey"
        FOREIGN KEY ("countryId")
        REFERENCES "Country" ("id")
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT "Employee_departmentId_fkey"
        FOREIGN KEY ("departmentId")
        REFERENCES "Department" ("id")
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT "Employee_roleId_fkey"
        FOREIGN KEY ("roleId")
        REFERENCES "Role" ("id")
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Salary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "effectiveFrom" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    CONSTRAINT "Salary_employeeId_fkey"
        FOREIGN KEY ("employeeId")
        REFERENCES "Employee" ("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Unique indexes
CREATE UNIQUE INDEX "Country_code_key"
ON "Country"("code");

CREATE UNIQUE INDEX "Country_name_key"
ON "Country"("name");

CREATE UNIQUE INDEX "Department_name_key"
ON "Department"("name");

CREATE UNIQUE INDEX "Role_name_key"
ON "Role"("name");

CREATE UNIQUE INDEX "Employee_employeeCode_key"
ON "Employee"("employeeCode");

CREATE UNIQUE INDEX "Employee_email_key"
ON "Employee"("email");

CREATE UNIQUE INDEX "Salary_employeeId_key"
ON "Salary"("employeeId");

-- Country indexes
CREATE INDEX "Country_name_idx"
ON "Country"("name");

CREATE INDEX "Country_code_idx"
ON "Country"("code");

-- Department indexes
CREATE INDEX "Department_name_idx"
ON "Department"("name");

-- Role indexes
CREATE INDEX "Role_name_idx"
ON "Role"("name");

-- Employee indexes
CREATE INDEX "Employee_countryId_idx"
ON "Employee"("countryId");

CREATE INDEX "Employee_departmentId_idx"
ON "Employee"("departmentId");

CREATE INDEX "Employee_roleId_idx"
ON "Employee"("roleId");

CREATE INDEX "Employee_lastName_firstName_idx"
ON "Employee"("lastName", "firstName");

CREATE INDEX "Employee_departmentId_roleId_idx"
ON "Employee"("departmentId", "roleId");

CREATE INDEX "Employee_countryId_departmentId_idx"
ON "Employee"("countryId", "departmentId");

CREATE INDEX "Employee_createdAt_idx"
ON "Employee"("createdAt");

-- Salary indexes
CREATE INDEX "Salary_amountCents_idx"
ON "Salary"("amountCents");

CREATE INDEX "Salary_currency_idx"
ON "Salary"("currency");

CREATE INDEX "Salary_effectiveFrom_idx"
ON "Salary"("effectiveFrom");