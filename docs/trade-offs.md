# Engineering Trade-offs

This document records important architectural and implementation decisions made during development.

The purpose is not to claim that one technology is universally better than another.

The purpose is to explain why a particular option is appropriate for this project.

---

# 1. Modular Monolith vs Microservices

## Decision

Use a modular monolithic backend.

## Reason

The current application does not require independently deployed services.

A modular monolith provides:

* clear application boundaries
* simple deployment
* simple local development
* straightforward testing
* low operational overhead

The internal architecture still separates:

```text
Routes
Controllers
Services
Repositories
```

This allows future extraction of services if actual requirements justify it.

## Alternative

Microservices.

## Why Not

Microservices would introduce additional complexity:

* service discovery
* distributed deployment
* network failures
* inter-service communication
* distributed logging
* distributed testing
* additional infrastructure

There is currently no requirement that justifies this complexity.

---

# 2. SQLite vs PostgreSQL

## Decision

Use SQLite for the assessment implementation.

## Reason

The application needs a reliable relational database while keeping local development simple.

SQLite provides:

* zero database-server setup
* deterministic development
* easy testing
* low operational overhead
* relational querying

The architecture should keep database access behind repositories so that the persistence layer can be changed later.

## Trade-off

SQLite is not the ideal choice for every production workload.

High-concurrency, distributed production systems may be better served by PostgreSQL or another server-based relational database.

## Future Direction

If production requirements expand, PostgreSQL would be a strong migration candidate.

---

# 3. Prisma vs Direct SQL

## Decision

Use Prisma as the primary database access layer.

## Reason

Prisma provides:

* type-safe database access
* schema management
* migrations
* generated client types
* predictable developer experience

It also integrates naturally with TypeScript.

## Trade-off

Direct SQL can provide more control over highly specialized queries.

For complex analytical operations, optimized queries may still be introduced where justified by measured performance.

---

# 4. REST vs GraphQL

## Decision

Use REST.

## Reason

The application's domain is resource-oriented.

The main resources are:

* employees
* salaries
* analytics

REST provides:

* straightforward HTTP semantics
* predictable URLs
* simple testing
* easy caching
* low conceptual overhead

## Trade-off

GraphQL could provide clients with more flexible data selection.

However, that flexibility is not necessary for the current application and would introduce additional schema and operational complexity.

---

# 5. Server-Side Pagination vs Client-Side Pagination

## Decision

Use server-side pagination.

## Reason

The dataset is expected to contain at least 10,000 employees.

Downloading all employees to the browser would:

* increase network payloads
* increase memory usage
* increase rendering work
* make search/filter operations more expensive

Instead:

```text
Browser
   ↓
GET /employees?page=1&pageSize=50
   ↓
Server
   ↓
Database
   ↓
50 employees
```

Only the required records are returned.

---

# 6. Server-Side Search vs Client-Side Search

## Decision

Use server-side search.

## Reason

The same scalability argument applies to search.

The browser should not need the complete employee dataset to find one employee.

Search should be performed through database-backed queries.

---

# 7. Feature-Based Frontend vs Layer-Only Organization

## Decision

Use feature-oriented frontend organization combined with shared UI primitives.

## Structure

```text
features/
  employees/
  salary/
  analytics/
  dashboard/

components/
  ui/
  layout/
  navigation/
  feedback/
```

## Reason

Business logic stays close to the feature that owns it.

Generic components remain reusable.

This avoids both:

* a completely flat component directory
* a giant global components directory containing unrelated business logic

---

# 8. TanStack Query vs Manual Fetch State

## Decision

Use TanStack Query for server state.

## Reason

The application has many server-driven states:

* employees
* employee details
* salary information
* analytics

A dedicated server-state library can provide:

* caching
* request deduplication
* loading states
* error states
* invalidation
* refetching

This avoids repeatedly implementing asynchronous state management manually.

---

# 9. Zod vs Manual Validation

## Decision

Use Zod for request validation.

## Reason

The backend receives untrusted external input.

Schemas provide a centralized definition of expected input.

They can validate:

* query parameters
* path parameters
* request bodies
* pagination
* salary values

The validation layer also makes invalid requests easier to handle consistently.

---

# 10. TypeScript Throughout

## Decision

Use TypeScript for both client and server.

## Reason

A shared type-safe ecosystem reduces the number of runtime mistakes caused by mismatched assumptions.

TypeScript helps with:

* API models
* function contracts
* component props
* service interfaces
* database interactions

## Trade-off

TypeScript introduces compilation and type-system complexity.

The benefits outweigh the additional complexity for this project.

---

# 11. Vitest vs Jest

## Decision

Use Vitest.

## Reason

The project uses Vite on the frontend.

Vitest provides:

* fast execution
* TypeScript support
* Vite-compatible configuration
* familiar Jest-style APIs
* convenient watch mode

The same testing technology can also be used for backend unit and integration tests.

---

# 12. Playwright vs Cypress

## Decision

Use Playwright for E2E testing.

## Reason

Playwright provides:

* browser automation
* Chromium support
* Firefox support
* WebKit support
* reliable locator APIs
* test isolation
* parallel execution

It is appropriate for validating complete user workflows.

---

# 13. REST Versioning

## Decision

Use:

```text
/api/v1
```

## Reason

Versioning establishes a stable API boundary.

If a future version introduces breaking changes, a new version can be introduced without immediately invalidating existing clients.

---

# 14. Repository Pattern

## Decision

Use repositories between services and Prisma.

## Reason

The repository layer creates a persistence boundary.

For example:

```text
EmployeeService
       ↓
EmployeeRepository
       ↓
Prisma
```

This keeps business logic from becoming tightly coupled to database implementation details.

## Trade-off

For a very small application, repositories may appear unnecessary.

However, the project intentionally demonstrates separation of concerns and needs a clear path toward database migration or optimization.

---

# 15. Centralized Error Handling

## Decision

Use centralized Express error handling.

## Reason

Individual routes should not each implement unrelated error-response logic.

Centralized handling allows the API to provide consistent:

* status codes
* error codes
* messages
* request identifiers

It also prevents accidental stack-trace exposure.

---

# 16. Structured Logging

## Decision

Use structured server-side logging.

## Reason

Logs should be useful to both humans and future observability systems.

Structured logs can include:

* timestamp
* level
* request ID
* event
* duration
* error information

Sensitive information must not be logged.

---

# 17. Authentication

## Decision

Authentication is intentionally outside the first core implementation unless the assessment requirements explicitly require it.

## Reason

The primary engineering challenge is employee and salary management.

Adding an authentication platform without a requirement would increase implementation complexity.

## Future Direction

Authentication and authorization can be introduced as a separate security boundary if required.

---

# 18. Complex RBAC

## Decision

Do not initially implement complex role-based access control.

## Reason

The current product defines an HR-oriented user without requiring multiple permission tiers.

A future authorization model can distinguish capabilities such as:

```text
HR Administrator
HR Manager
Read-only Analyst
```

if product requirements justify it.

---

# 19. Caching

## Decision

Use caching selectively.

## Reason

Not every query benefits equally from caching.

Good candidates may include:

* metadata lists
* dashboard analytics
* frequently requested employee details

Highly mutable data should have carefully managed invalidation.

Caching will be introduced where it provides measurable value.

---

# 20. Premature Optimization

## Decision

Optimize based on evidence.

## Reason

Adding complex optimization before measuring actual behavior can:

* increase code complexity
* make debugging harder
* introduce unnecessary dependencies
* obscure business logic

The initial implementation will establish correct behavior first, followed by measurement and targeted optimization.

---

# 21. AI-Assisted Development

## Decision

Use AI as an engineering assistant.

## Reason

AI can accelerate:

* documentation
* exploration
* boilerplate
* testing ideas
* edge-case discovery
* code review

However, AI output is not considered authoritative.

All generated output must be reviewed and validated.

---

# 22. Git History

## Decision

Develop in focused batches and commits.

## Reason

A clear Git history makes the engineering process understandable.

Examples:

```text
docs: define product requirements
chore: initialize monorepo
feat: add employee repository
feat: implement employee search
test: add employee service tests
feat: add employee management UI
test: add employee e2e workflow
perf: optimize employee listing
```

This is preferable to one enormous commit containing the entire application.

---

# 23. Overall Decision Principle

The project follows this rule:

> Prefer the simplest solution that satisfies the requirement while preserving a clear path for future growth.

Technology should solve a problem.

Technology should not be added merely because it is popular.
