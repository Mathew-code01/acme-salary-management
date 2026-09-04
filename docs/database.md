# ACME Salary Management — Database Design

## 1. Database Overview

The application uses Prisma ORM with SQLite for the assessment environment.

SQLite was selected because it provides:

* Minimal setup
* No external database dependency
* Easy local development
* Deterministic assessment environments
* Simple database inspection

The repository architecture keeps persistence behind repositories so that the database can be replaced later.

---

## 2. Core Entities

The database contains the following core entities:

```text
Country
   │
   └──── Employee
             │
             └──── Salary

Department
   │
   └──── Employee

Role
   │
   └──── Employee
```

---

## 3. Country

The `Country` entity represents the geographic location associated with an employee.

Typical fields include:

* ID
* Name
* Code

Country names/codes should be unique where appropriate.

---

## 4. Department

The `Department` entity represents an organizational department.

Typical fields include:

* ID
* Name

Department names should be unique.

---

## 5. Role

The `Role` entity represents an employee's organizational role.

Typical fields include:

* ID
* Name

Role names should be unique.

---

## 6. Employee

The employee entity is the central business entity.

Conceptually:

```text
Employee
├── id
├── employeeCode
├── firstName
├── lastName
├── email
├── countryId
├── departmentId
├── roleId
├── status
├── createdAt
└── updatedAt
```

The employee status is represented using an enum:

```text
ACTIVE
INACTIVE
```

---

## 7. Salary

Salary stores the employee compensation record.

Conceptually:

```text
Salary
├── id
├── employeeId
├── amount
├── currency
├── effectiveDate
├── createdAt
└── updatedAt
```

An employee may have an associated salary record.

---

## 8. Relationships

### Employee → Country

Many employees may belong to one country.

```text
Country 1 ──────── * Employee
```

### Employee → Department

Many employees may belong to one department.

```text
Department 1 ──── * Employee
```

### Employee → Role

Many employees may have the same role.

```text
Role 1 ─────────── * Employee
```

### Employee → Salary

The salary relationship is modeled as a one-to-one or optional relationship for the current domain.

```text
Employee 1 ─────── 0..1 Salary
```

---

## 9. Referential Integrity

Foreign-key relationships should prevent invalid organizational references.

The application uses explicit relation behavior to avoid accidentally deleting referenced organizational records.

For example, employee references to country, department, and role should not silently become invalid because a referenced record was removed.

---

## 10. Constraints

Important constraints include:

* Employee ID is unique
* Employee code is unique
* Email is unique
* Organizational foreign keys must reference valid records
* Salary must belong to a valid employee
* Status must use a supported enum value

Database constraints provide a second line of defense after API validation.

---

## 11. Indexing Strategy

The employee table is frequently queried.

Indexes are therefore appropriate for:

* `countryId`
* `departmentId`
* `roleId`
* `status`
* `createdAt`
* `(lastName, firstName)`
* `(departmentId, roleId)`
* `(countryId, departmentId)`

These indexes support common filtering and sorting operations.

Indexes should be added based on query patterns rather than indiscriminately.

---

## 12. Pagination

Employee pagination is handled by the backend.

Conceptually:

```text
page = 1
pageSize = 25

offset = (page - 1) * pageSize
```

The database returns only the records required for the requested page.

This prevents the API from transferring all employee records to the browser.

---

## 13. Seed Data

The project includes deterministic seed data for development and demonstration.

The dataset is designed to provide approximately 10,000 employees.

Seed data includes:

* Countries
* Departments
* Roles
* Employees
* Salary information

Employee status is also represented in seed data so that both active and inactive workflows can be demonstrated.

---

## 14. Deterministic Data

Deterministic seed generation makes the development and assessment environment reproducible.

This provides:

* Repeatable tests
* Predictable demonstrations
* Easier debugging
* Consistent screenshots/video demonstrations

---

## 15. Migration Strategy

Database changes are represented through Prisma migrations.

Typical development workflow:

```bash
npx prisma migrate dev --name <migration-name>
npx prisma generate
npx prisma db seed
```

Migrations should be committed to source control.

Generated client artifacts should be regenerated as part of installation/build workflows rather than manually edited.

---

## 16. Production Database Consideration

SQLite is appropriate for the assessment because of its simplicity.

For a high-traffic production system, PostgreSQL would be a stronger choice because it provides:

* Better concurrent write behavior
* Horizontal infrastructure options
* Mature managed hosting
* Strong operational tooling
* Better fit for multi-user enterprise workloads

The application architecture intentionally minimizes the impact of this future migration.

---

## 17. Data Integrity

Integrity is protected through multiple layers:

```text
UI validation
      ↓
API validation
      ↓
Service rules
      ↓
Database constraints
```

No single layer is expected to provide complete protection by itself.

---

## 18. Sensitive Data Considerations

The current assessment dataset should use synthetic/non-sensitive employee information.

Real employee compensation data should not be committed to source control.

Production deployments would require additional controls including:

* Authentication
* Authorization
* Encryption
* Audit logging
* Data retention policies
* Access monitoring

---

## 19. Database Development Commands

Useful commands include:

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npx prisma studio
```

Database commands should be run using the project's configured environment.
