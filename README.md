# ACME Salary Management

> A production-oriented employee salary management and compensation analytics platform for ACME's HR team, built as an AI-assisted engineering assessment.

[![Status](https://img.shields.io/badge/status-in%20development-yellow)](#development-status)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## Overview

**ACME Salary Management** is an internal HR-focused application designed to help organizations manage employee compensation data and understand salary patterns across their workforce.

The platform is being developed with a strong emphasis on:

* maintainable architecture
* type safety
* performance
* accessibility
* validation
* automated testing
* security
* clear separation of concerns
* production-oriented engineering practices
* responsible AI-assisted development

The application is designed to operate with a dataset of **at least 10,000 employees** while keeping employee search, filtering, pagination, salary management, and analytics responsive.

---

## Problem

Managing compensation information becomes increasingly difficult as employee datasets grow.

HR teams need a centralized way to:

* find employees quickly
* inspect employee information
* manage compensation data
* search and filter large employee datasets
* understand salary distributions
* compare compensation across departments
* compare compensation across countries
* analyze compensation across roles

ACME Salary Management addresses these workflows through a structured web application backed by a typed API and relational database.

---

## Product Goals

The primary goals of the project are to:

1. Provide a clear HR-oriented employee management experience.
2. Support at least 10,000 employee records.
3. Provide efficient server-side search and filtering.
4. Provide server-side pagination for large datasets.
5. Allow employee information to be managed safely.
6. Allow employee compensation to be viewed and updated.
7. Provide useful compensation analytics.
8. Maintain clear frontend/backend boundaries.
9. Provide comprehensive automated testing.
10. Demonstrate practical engineering judgment.
11. Document architectural and implementation decisions.
12. Demonstrate responsible use of AI during software development.

---

## Core Features

### Employee Management

The employee workspace is designed to support:

* employee listing
* employee search
* employee filtering
* server-side pagination
* employee details
* employee creation
* employee updates
* employee deletion

### Salary Management

The compensation workflow is designed to support:

* salary display
* salary editing
* currency information
* salary validation
* compensation context

### Compensation Analytics

The analytics experience is designed to provide:

* total employee count
* total payroll
* average salary
* median salary where appropriate
* salary distribution
* country-level analysis
* department-level analysis
* role-level analysis

---

## Architecture

The planned architecture is a modular full-stack application:

```text
┌─────────────────────────────────────────────┐
│                  React Client               │
│                                             │
│  Dashboard │ Employees │ Details │ Analytics│
└──────────────────────┬──────────────────────┘
                       │
                       │ HTTP / JSON
                       ▼
┌─────────────────────────────────────────────┐
│               Express API                   │
│                                             │
│ Routes → Controllers → Services → Repos     │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                  Prisma                     │
│                                             │
│              Type-safe ORM                  │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                   SQLite                    │
│                                             │
│       Employee & Compensation Data          │
└─────────────────────────────────────────────┘
```

The backend follows a layered architecture:

```text
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
Database
```

This keeps HTTP concerns, business logic, and persistence concerns separated.

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* TanStack Query
* Tailwind CSS
* Vitest
* Testing Library

### Backend

* Node.js
* Express
* TypeScript
* Zod
* Prisma

### Database

* SQLite

SQLite is being used for the assessment implementation because it provides a simple, deterministic development and testing environment without requiring external database infrastructure.

The application architecture is intentionally designed so that migration to PostgreSQL or another production relational database can be considered later if deployment requirements demand it.

### Testing

* Vitest
* Testing Library
* Playwright

### Tooling

* pnpm
* ESLint
* Prettier
* GitHub Actions

---

## Repository Structure

```text
acme-salary-management/
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── deploy.yml
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── pull_request_template.md
│
├── client/
│   ├── public/
│   └── src/
│       ├── app/
│       ├── assets/
│       ├── components/
│       │   ├── ui/
│       │   ├── layout/
│       │   ├── navigation/
│       │   ├── feedback/
│       │   └── data-display/
│       ├── features/
│       │   ├── dashboard/
│       │   ├── employees/
│       │   ├── salary/
│       │   └── analytics/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       ├── types/
│       └── test/
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
│   ├── future-improvements.md
│   └── ai-prompts/
│
├── scripts/
│   ├── setup.ts
│   ├── verify.ts
│   └── health-check.ts
│
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc
├── CONTRIBUTING.md
├── LICENSE
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

> The repository is being implemented incrementally. Some directories and files shown above are planned architecture and may not yet exist in the current development milestone.

---

## API Design

The API is planned around the `/api/v1` namespace.

### Employees

```http
GET    /api/v1/employees
GET    /api/v1/employees/:id
POST   /api/v1/employees
PATCH  /api/v1/employees/:id
DELETE /api/v1/employees/:id
```

### Salary

```http
GET   /api/v1/employees/:id/salary
PATCH /api/v1/employees/:id/salary
```

### Analytics

```http
GET /api/v1/analytics/overview
GET /api/v1/analytics/distribution
GET /api/v1/analytics/countries
GET /api/v1/analytics/departments
GET /api/v1/analytics/roles
```

### Metadata

```http
GET /api/v1/countries
GET /api/v1/departments
GET /api/v1/roles
```

### Health

```http
GET /health
```

Detailed API documentation will be maintained in:

`docs/api.md`

---

## Large Dataset Strategy

The application is designed around a minimum dataset of:

**10,000 employees**

The employee table will not download the entire dataset to the browser.

Instead, the API will handle:

* pagination
* filtering
* search
* sorting where required

For example:

```http
GET /api/v1/employees?page=1&pageSize=50
```

Search and filtering will be performed at the database/API layer.

This approach reduces:

* network payload size
* browser memory usage
* unnecessary rendering
* client-side processing

---

## Performance Principles

Performance considerations include:

* database indexes
* server-side pagination
* efficient filtering
* controlled API payloads
* debounced search
* query caching where appropriate
* avoiding unnecessary React renders
* efficient aggregate queries

Performance decisions and measurements will be documented in:

`docs/performance.md`

---

## Testing Strategy

The project uses multiple testing levels.

### Unit Tests

Business logic will be tested independently.

```text
Services
Utilities
Formatters
Validation
```

### Integration Tests

The API will be tested across its major layers:

```text
HTTP
 ↓
Routes
 ↓
Controllers
 ↓
Services
 ↓
Repositories
 ↓
Database
```

### Frontend Tests

The frontend will test:

* components
* user interactions
* loading states
* error states
* forms
* filtering
* pagination

### End-to-End Tests

Playwright will cover critical workflows such as:

```text
Dashboard
   ↓
Employees
   ↓
Search
   ↓
Filter
   ↓
Employee Details
   ↓
Salary Update
   ↓
Analytics
```

---

## Security

Security considerations include:

* environment-based configuration
* input validation
* controlled CORS
* secure HTTP middleware
* structured error handling
* avoiding sensitive information in responses
* avoiding secrets in source control
* request identifiers
* controlled logging

Security documentation will be maintained in:

`docs/security.md`

---

## Accessibility

The interface will prioritize accessibility through:

* semantic HTML
* keyboard navigation
* visible focus states
* accessible labels
* appropriate contrast
* meaningful loading states
* meaningful error states
* accessible forms
* responsive layouts

---

## Development Approach

The project is intentionally being built in controlled batches rather than generated as one large implementation.

Each development batch follows:

```text
Requirement
     ↓
Design
     ↓
Implementation
     ↓
Validation
     ↓
Testing
     ↓
Review
     ↓
Documentation
     ↓
Git Commit
```

This approach keeps changes:

* understandable
* reviewable
* testable
* reversible
* traceable

---

## AI-Assisted Development

AI is used as an engineering assistant throughout the project.

AI may assist with:

* requirements exploration
* architectural alternatives
* implementation scaffolding
* test generation
* edge-case identification
* code review
* documentation
* refactoring suggestions

AI-generated output is **not considered correct by default**.

All generated code is subject to human review and validation through:

* TypeScript
* ESLint
* automated tests
* integration tests
* E2E tests
* manual verification
* production build verification

The AI-assisted development process is documented in:

`docs/ai-development.md`

Meaningful prompts will be maintained under:

`docs/ai-prompts/`

---

## Engineering Trade-offs

The project intentionally favors a modular monolith over microservices.

### Why?

The assessment does not require distributed services.

A modular monolith provides:

* simpler deployment
* simpler debugging
* fewer infrastructure dependencies
* easier local development
* clear domain boundaries

without introducing unnecessary distributed-system complexity.

Additional architectural decisions will be documented in:

`docs/trade-offs.md`

and:

`docs/decisions.md`

---

## Non-Goals

The initial version does not attempt to implement a complete enterprise HR platform.

The following are outside the current scope:

* payroll processing
* tax calculation
* bank transfers
* benefits administration
* recruitment
* attendance management
* performance management
* employee self-service
* enterprise SSO
* complex RBAC
* multi-tenancy
* microservices
* Kubernetes
* event streaming infrastructure

These may be considered future improvements if product requirements expand.

---

## Development Status

| Milestone                | Status         |
| ------------------------ | -------------- |
| Product requirements     | 🟡 In progress |
| Product design           | 🟡 In progress |
| Repository foundation    | 🟡 In progress |
| React foundation         | ⚪ Planned      |
| Backend foundation       | ⚪ Planned      |
| Database                 | ⚪ Planned      |
| Employee API             | ⚪ Planned      |
| Salary API               | ⚪ Planned      |
| Analytics API            | ⚪ Planned      |
| Backend testing          | ⚪ Planned      |
| Dashboard                | ⚪ Planned      |
| Employee workspace       | ⚪ Planned      |
| Salary management UI     | ⚪ Planned      |
| Analytics UI             | ⚪ Planned      |
| Frontend testing         | ⚪ Planned      |
| E2E testing              | ⚪ Planned      |
| Performance optimization | ⚪ Planned      |
| Security hardening       | ⚪ Planned      |
| CI/CD                    | ⚪ Planned      |
| Documentation            | ⚪ Planned      |
| Deployment               | ⚪ Planned      |
| Final verification       | ⚪ Planned      |

---

## Local Development

> Development instructions will be finalized as the repository foundation and application services are implemented.

The planned workflow is:

```bash
git clone <repository-url>

cd acme-salary-management

pnpm install

pnpm dev
```

Database setup will use Prisma.

The expected workflow will include:

```bash
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma db seed
```

Exact scripts will be documented once the workspace configuration is implemented.

---

## Environment Variables

Environment-specific configuration will be provided through environment variables.

A template will be maintained at:

```text
.env.example
```

Secrets must never be committed to Git.

---

## Documentation

Technical documentation is maintained under:

```text
docs/
```

Important documents include:

| Document                 | Purpose                             |
| ------------------------ | ----------------------------------- |
| `requirements.md`        | Product and functional requirements |
| `product-design.md`      | UX and product decisions            |
| `architecture.md`        | System architecture                 |
| `api.md`                 | API contract                        |
| `database.md`            | Database design                     |
| `decisions.md`           | Architecture decision record        |
| `performance.md`         | Performance strategy                |
| `testing.md`             | Testing strategy                    |
| `security.md`            | Security model                      |
| `deployment.md`          | Deployment architecture             |
| `ai-development.md`      | AI-assisted development             |
| `trade-offs.md`          | Engineering trade-offs              |
| `future-improvements.md` | Future roadmap                      |

---

## Contributing

Contributions should follow the project's engineering standards.

Please read:

[`CONTRIBUTING.md`](CONTRIBUTING.md)

before submitting changes.

---

## License

This project is licensed under the MIT License.

See [`LICENSE`](LICENSE) for details.

---

## Assessment Context

This repository is being developed as an engineering assessment project.

The implementation focuses not only on delivering functionality, but also on demonstrating:

* architectural reasoning
* clean code
* maintainability
* testing discipline
* performance awareness
* security awareness
* documentation
* responsible AI-assisted development
* incremental Git-based development

The goal is to demonstrate the engineering process behind the software, not simply the final interface.
