# ACME Salary Management

> Enterprise-oriented employee, salary, and compensation analytics platform built for HR management workflows.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Vitest](https://img.shields.io/badge/Vitest-Testing-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)

---

## Overview

ACME Salary Management is a full-stack HR application designed to help an HR manager manage employee records, compensation information, and organizational salary analytics.

The application is designed around a realistic organization containing **10,000 employee records**, with server-side search, filtering, sorting, and pagination so that large datasets do not need to be transferred to the browser unnecessarily.

The project was developed as an engineering assessment with an emphasis on:

- clean architecture
- maintainability
- type safety
- validation
- performance
- accessibility
- automated testing
- documented engineering decisions
- responsible AI-assisted development
- production-oriented engineering practices

---

## Product Goal

The goal is to provide HR managers with a focused workspace for answering common employee and compensation questions quickly.

For example:

- How many employees are in the organization?
- Which employees belong to a particular department?
- Which employees are based in a particular country?
- What role does an employee have?
- What is an employee's current compensation?
- How is salary distributed across departments?
- How does compensation vary across countries and roles?
- How can an HR manager quickly find a specific employee?

---

## Core Features

### Employee Management

The employee workspace supports:

- employee listing
- employee search
- employee filtering
- server-side pagination
- sorting
- employee details
- employee creation
- employee updates
- employee deletion
- employee status

Supported organizational dimensions include:

- country
- department
- role

---

### Compensation Management

The salary domain supports:

- employee salary records
- salary amount management
- currency information
- effective salary dates
- salary validation
- compensation summaries

Salary data is modeled separately from employee identity data so that the domain remains extensible.

---

### Compensation Analytics

The application provides compensation-focused analytics including:

- total employees
- payroll summaries
- average salary
- salary distribution
- country-level compensation analysis
- department-level compensation analysis
- role-level compensation analysis

The analytics layer is designed to perform aggregation at the backend/database boundary rather than transferring the entire employee dataset to the browser.

---

### Enterprise Application Shell

The frontend provides:

- responsive sidebar navigation
- mobile navigation
- application header
- reusable page containers
- page headers
- loading states
- error states
- empty states
- confirmation dialogs
- reusable data-display components
- responsive layouts
- accessible interaction states

---

## Architecture

The application follows a modular full-stack architecture.

```text
┌───────────────────────────────────────────────┐
│                  React Client                 │
│                                               │
│  Pages → Features → Hooks → API Client       │
└───────────────────────┬───────────────────────┘
                        │
                        │ HTTP / JSON
                        ▼
┌───────────────────────────────────────────────┐
│                 Express API                   │
│                                               │
│ Routes → Controllers → Services → Repositories│
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│                    Prisma                     │
│                                               │
│          Type-safe database access            │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│                    SQLite                     │
│                                               │
│ Country / Department / Role / Employee /      │
│ Salary                                        │
└───────────────────────────────────────────────┘


Backend Request Flow
HTTP Request
     │
     ▼
Route
     │
     ▼
Validation
     │
     ▼
Controller
     │
     ▼
Service
     │
     ▼
Repository
     │
     ▼
Prisma
     │
     ▼
SQLite

This separation keeps HTTP concerns, business logic, and persistence logic independently testable.

Technology Stack
Frontend
Technology	Purpose
React	UI framework
TypeScript	Static typing
Vite	Frontend tooling and development server
React Router	Client-side routing
TanStack Query	Server-state management
Tailwind CSS	UI styling
Vitest	Frontend testing
Testing Library	Component testing
Backend
Technology	Purpose
Node.js	Runtime
Express	HTTP API
TypeScript	Static typing
Zod	Request validation
Prisma	ORM and database access
Database
Technology	Purpose
SQLite	Relational database
Prisma Migrate	Schema migrations
Prisma Seed	Deterministic development dataset
Testing
Technology	Purpose
Vitest	Unit and integration testing
Testing Library	UI testing
Playwright	End-to-end testing
Data Model

The current domain consists of five primary entities.

Country
   │
   │
   ▼
Employee ───────────────► Department
   │
   │
   ├────────────────────► Role
   │
   │
   └────────────────────► Salary
Country

Represents the employee's country.

Department

Represents an organizational department.

Role

Represents the employee's organizational role.

Employee

Contains employee identity and organizational information.

Key fields include:

employee code
first name
last name
email
country
department
role
status
Salary

Contains compensation information associated with an employee.

Key fields include:

salary amount
currency
effective date
Dataset

The development environment contains a deterministic dataset of:

10 Countries
10 Departments
12 Roles
10,000 Employees
10,000 Salary Records

The seed process is deterministic so that the development environment can be recreated consistently.

The application is intentionally designed to demonstrate correct handling of a dataset of at least 10,000 employees.

Performance Strategy

Large employee datasets are handled using server-side operations.

Server-Side Pagination

The frontend requests only the records needed for the current page.

Example:

GET /api/v1/employees?page=1&pageSize=50

The browser does not need to download all 10,000 employees to render the first page.

Server-Side Filtering

Filters are applied through the API and database layer.

Supported filters include:

country
department
role
Search

Employee searches are processed by the backend rather than filtering the complete dataset in the browser.

Database Indexing

Indexes are applied to frequently queried fields and relationships to support employee lookup and filtering.

Frontend Optimization

The frontend uses:

debounced search
server-state caching
controlled data fetching
reusable components
pagination
focused API payloads
API

The API is versioned under:

/api/v1
Employees
GET    /api/v1/employees
GET    /api/v1/employees/:id
POST   /api/v1/employees
PATCH  /api/v1/employees/:id
DELETE /api/v1/employees/:id
Salary
GET   /api/v1/employees/:id/salary
PATCH /api/v1/employees/:id/salary
Analytics
GET /api/v1/analytics/overview
GET /api/v1/analytics/distribution
GET /api/v1/analytics/countries
GET /api/v1/analytics/departments
GET /api/v1/analytics/roles
Reference Data
GET /api/v1/countries
GET /api/v1/departments
GET /api/v1/roles
Health
GET /health
Repository Structure
acme-salary-management/
│
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
│
├── client/
│   ├── public/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── features/
│       │   ├── dashboard/
│       │   ├── employees/
│       │   ├── salary/
│       │   └── analytics/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       ├── test/
│       ├── types/
│       └── main.tsx
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── types/
│   │   ├── lib/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── fixtures/
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── e2e/
│   ├── fixtures/
│   ├── dashboard.spec.ts
│   ├── employees.spec.ts
│   ├── employee-details.spec.ts
│   ├── analytics.spec.ts
│   └── playwright.config.ts
│
├── docs/
│   ├── requirements.md
│   ├── product-design.md
│   ├── architecture.md
│   ├── architecture-diagram.svg
│   ├── api.md
│   ├── database.md
│   ├── decisions.md
│   ├── performance.md
│   ├── testing.md
│   ├── security.md
│   ├── deployment.md
│   ├── ai-development.md
│   ├── trade-offs.md
│   └── future-improvements.md
│
├── scripts/
├── .env.example
├── CONTRIBUTING.md
├── LICENSE
├── package.json
├── npm-workspace.yaml
└── README.md
Local Development
Prerequisites

Install:

Node.js 22+
npm
Git

Verify:

node --version
npm --version
git --version
Installation

Clone the repository:

git clone https://github.com/Mathew-code01/acme-salary-management.git

Enter the project:

cd acme-salary-management

Install dependencies:

npm install
Environment Configuration

Create the required environment files from the provided examples.

cp .env.example .env

On Windows PowerShell:

Copy-Item .env.example .env

Do not commit real environment variables or secrets.

Database Setup

Generate the Prisma client:

npm prisma generate

Apply database migrations:

npm prisma migrate dev

Seed the development database:

npm prisma db seed

The deterministic seed creates the expected organizational reference data and 10,000 employees.

Running the Application
Development

Start the frontend:

npm --filter client dev

Start the backend:

npm --filter server dev

The local development environment uses separate frontend and backend processes.

Typical local addresses:

Frontend
http://127.0.0.1:5173

Backend
http://127.0.0.1:5000
Testing
Unit Tests
npm test
Integration Tests
npm test
End-to-End Tests
npm test:e2e
Build Verification
npm build
Type Checking
npm typecheck
Linting
npm lint
Engineering Quality

The project uses multiple levels of verification.

Unit Tests
    │
    ▼
Integration Tests
    │
    ▼
Frontend Tests
    │
    ▼
End-to-End Tests
    │
    ▼
Build Verification
    │
    ▼
CI

The goal is to verify both isolated business logic and complete user workflows.

Accessibility

The frontend follows accessible UI practices including:

semantic HTML
keyboard navigation
visible focus states
accessible labels
accessible buttons
responsive navigation
loading feedback
error feedback
empty states
confirmation for destructive actions

Accessibility is treated as part of the product rather than as a final polishing step.

Security Considerations

The application includes security-oriented boundaries such as:

environment-based configuration
request validation
CORS configuration
controlled error handling
security middleware
avoidance of secret values in source control
separation between API and persistence layers

Security-related decisions are documented under:

docs/security.md
AI-Assisted Development

AI was used as a development assistant throughout the project.

The development process follows:

Requirement
     ↓
Design
     ↓
AI Assistance
     ↓
Human Review
     ↓
Implementation
     ↓
Testing
     ↓
Refactoring
     ↓
Commit

AI assistance may be used for:

requirements exploration
architectural alternatives
implementation scaffolding
test case generation
edge-case identification
code review
documentation

AI-generated output is not accepted automatically.

Generated solutions are reviewed for:

correctness
security
maintainability
performance
type safety
architectural consistency

Relevant AI development artifacts are documented under:

docs/ai-development.md
docs/ai-prompts/
Architectural Decisions
SQLite

SQLite is used for the assessment implementation because it provides:

minimal infrastructure
simple local development
deterministic testing
straightforward setup

The architecture intentionally keeps database access behind Prisma and repository boundaries so that a future PostgreSQL migration can be introduced without redesigning the entire application.

REST

REST was selected because the application's resources and workflows map naturally to HTTP endpoints.

Modular Monolith

The backend uses a modular monolithic architecture instead of microservices.

This keeps the system:

easier to develop
easier to test
easier to deploy
easier to reason about

without introducing unnecessary distributed-system complexity.

Server-Side Pagination

Server-side pagination was selected because the application must support at least 10,000 employees.

Documentation

Detailed engineering documentation is available in:

docs/

Important documents include:

Document	Purpose
requirements.md	Product and functional requirements
product-design.md	Product and UX decisions
architecture.md	System architecture
database.md	Database design
api.md	API contract
performance.md	Performance strategy
security.md	Security considerations
testing.md	Testing strategy
deployment.md	Deployment architecture
decisions.md	Architectural decisions
trade-offs.md	Engineering trade-offs
ai-development.md	AI-assisted development process
future-improvements.md	Potential future enhancements
Known Scope Boundaries

The current application intentionally does not attempt to implement a complete enterprise payroll system.

Out of scope for the assessment implementation:

payroll execution
tax calculation
bank transfers
benefits administration
recruitment
attendance management
performance management
employee self-service
enterprise SSO
complex RBAC
multi-tenancy
microservices
Kubernetes
distributed event streaming

These capabilities can be considered if the product evolves beyond the assessment scope.

Future Improvements

Potential future enhancements include:

authentication and authorization
role-based access control
PostgreSQL production deployment
audit logging
salary history
bulk employee operations
CSV import/export
advanced compensation reporting
scheduled reports
richer analytics
notifications
SSO
multi-tenant architecture
infrastructure observability

These are intentionally separated from the current assessment scope to keep the implementation focused.

Project Status

The application has progressed beyond the initial repository foundation and includes the core full-stack structure, database domain, employee management workflows, testing infrastructure, documentation, and enterprise application shell.

Current development focus:

Production verification
        ↓
Deployment preparation
        ↓
Hosting
        ↓
Final assessment verification
Assessment Focus

This project demonstrates:

full-stack TypeScript development
React application architecture
Express API design
relational data modeling
Prisma ORM usage
SQLite database management
server-side pagination
search and filtering
compensation analytics
automated testing
E2E testing
responsive UI architecture
accessibility considerations
performance considerations
security boundaries
engineering documentation
incremental Git development
responsible AI-assisted development
License

This project is licensed under the MIT License.

See LICENSE for details.

Author

Mathew Okikiola Oloyede

GitHub:

https://github.com/Mathew-code01

Repository

Source code and engineering documentation:

https://github.com/Mathew-code01/acme-salary-management