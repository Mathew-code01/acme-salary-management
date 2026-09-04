# ACME Salary Management — Architectural Decisions

## ADR-001 — Use TypeScript Across the Application

### Status

Accepted

### Decision

Use TypeScript for both frontend and backend code.

### Rationale

The application contains multiple domain models and API contracts.

TypeScript provides:

* Static type checking
* Better refactoring
* Shared conceptual models
* Improved editor tooling
* Reduced runtime mistakes

Using TypeScript consistently also reduces context switching between frontend and backend development.

---

# ADR-002 — Use React + Vite for the Frontend

### Status

Accepted

### Decision

Use React with Vite.

### Rationale

The application is primarily an interactive data-management interface.

React provides component-based UI development while Vite provides a fast development server and production build pipeline.

---

# ADR-003 — Use Express for the API

### Status

Accepted

### Decision

Use Express with TypeScript.

### Rationale

Express provides a small and predictable HTTP abstraction.

It works well with:

* Middleware
* Validation
* REST APIs
* Layered architecture
* TypeScript

The assessment does not require a more opinionated backend framework.

---

# ADR-004 — Use Prisma

### Status

Accepted

### Decision

Use Prisma as the database access layer.

### Rationale

Prisma provides:

* Type-safe database queries
* Schema-driven development
* Migrations
* Generated client
* Strong TypeScript integration

It also makes a future database migration easier.

---

# ADR-005 — Use SQLite for the Assessment

### Status

Accepted

### Decision

Use SQLite during assessment development.

### Rationale

SQLite provides a low-friction development environment.

It avoids requiring:

* External database installation
* Cloud database credentials
* Network access
* Additional infrastructure

The trade-off is reduced suitability for high-concurrency production workloads.

---

# ADR-006 — Use Repository Separation

### Status

Accepted

### Decision

Database operations should be isolated inside repositories.

### Rationale

This separates persistence implementation from business logic.

Benefits include:

* Easier testing
* Cleaner services
* Easier database migration
* Reduced coupling

---

# ADR-007 — Use Service Layer for Business Logic

### Status

Accepted

### Decision

Business rules should live in services rather than controllers.

### Rationale

Controllers should primarily translate HTTP requests and responses.

Keeping business logic in services makes it easier to:

* Test
* Reuse
* Refactor
* Understand

---

# ADR-008 — Server-Side Pagination

### Status

Accepted

### Decision

Employee pagination is performed by the backend.

### Rationale

The application targets approximately 10,000 employees.

Sending the complete dataset to the browser would increase:

* Network usage
* Memory usage
* Rendering cost

Server-side pagination keeps the client workload bounded.

---

# ADR-009 — Version the API

### Status

Accepted

### Decision

Use `/api/v1`.

### Rationale

Versioning creates a stable contract and provides a path for future breaking changes.

---

# ADR-010 — Validate API Input

### Status

Accepted

### Decision

Validate external input before business logic executes.

### Rationale

The browser cannot be trusted as the only validation layer.

Backend validation protects the API from malformed requests regardless of the client.

---

# ADR-011 — Centralize Error Handling

### Status

Accepted

### Decision

Use centralized backend error handling.

### Rationale

Centralization produces consistent API responses and prevents every controller from implementing its own error formatting.

---

# ADR-012 — Use Deterministic Seed Data

### Status

Accepted

### Decision

Generate repeatable seed data.

### Rationale

The assessment requires a realistic employee dataset and reliable demonstrations.

Deterministic data improves:

* Debugging
* Testing
* Demonstrations
* Reproducibility

---

# ADR-013 — Separate Feature and Shared UI Components

### Status

Accepted

### Decision

Use feature-specific modules together with reusable UI components.

### Rationale

This balances domain ownership with reuse.

Features remain easy to locate while common UI behavior is centralized.

---

# ADR-014 — Use Layered Testing

### Status

Accepted

### Decision

Use unit, integration, and E2E tests.

### Rationale

No single testing layer provides sufficient confidence.

Unit tests are fast.

Integration tests verify application boundaries.

E2E tests verify real user workflows.

---

# ADR-015 — Do Not Implement Payroll Processing

### Status

Accepted

### Decision

Keep the domain focused on employee and salary management.

### Rationale

Payroll introduces substantially different concerns including:

* Tax calculations
* Payment processing
* Deductions
* Benefits
* Compliance
* Banking integrations

These are outside the assessment scope and would increase complexity without improving the core demonstration.
