# ACME Salary Management — Engineering Trade-offs

## 1. SQLite vs PostgreSQL

### Decision

SQLite was selected for the assessment.

### Benefits

* Minimal setup
* Easy local development
* No external service
* Reproducible environment

### Costs

* Limited concurrent write scalability
* File-based persistence
* Less suitable for multi-instance deployment

### Future

Move to PostgreSQL for production enterprise deployment.

---

## 2. Layered Architecture vs Simpler CRUD

### Decision

Use routes, controllers, services, and repositories.

### Benefits

* Better separation of concerns
* Easier testing
* Easier future expansion
* Clear ownership

### Costs

* More files
* More abstraction
* Slightly slower initial development

For an assessment demonstrating engineering maturity, the additional structure is justified.

---

## 3. Server-Side Pagination vs Client-Side Pagination

### Decision

Use server-side pagination.

### Benefits

* Smaller API payloads
* Lower browser memory usage
* Better scalability
* Better fit for 10,000 records

### Costs

* More API state
* More complex pagination handling
* Additional query parameters

The scalability benefits outweigh the additional complexity.

---

## 4. Separate Analytics API vs Frontend Calculation

### Decision

Perform meaningful aggregation on the backend.

### Benefits

* Smaller responses
* Less browser computation
* Centralized business logic
* Better future scalability

### Costs

* Additional backend endpoints
* More backend tests

---

## 5. Feature-Based Frontend vs Page-Only Structure

### Decision

Organize frontend functionality by domain features.

### Benefits

* Easier feature ownership
* Better scalability
* Less duplication
* Easier navigation through the codebase

### Costs

* More directories
* Requires consistent conventions

---

## 6. TypeScript Everywhere

### Decision

Use TypeScript on both sides of the application.

### Benefits

* Consistent language
* Strong typing
* Better refactoring
* Better IDE support

### Costs

* Additional type definitions
* Compilation/type-checking overhead

The benefits are significant for a multi-layer application.

---

## 7. Comprehensive Testing vs Maximum Coverage

### Decision

Prioritize meaningful tests over arbitrary coverage targets.

### Benefits

* Tests reflect actual risk
* Less brittle test suite
* Faster maintenance

### Costs

* Some low-risk code may have limited direct coverage

The goal is confidence rather than a misleading coverage number.

---

## 8. Custom UI Components vs UI Framework

### Decision

Use reusable application-level UI components.

### Benefits

* Consistent visual language
* Greater design control
* Reduced dependency on a large component framework

### Costs

* More implementation work
* Accessibility must be handled carefully

---

## 9. Simplicity vs Enterprise Infrastructure

### Decision

Avoid infrastructure that is not required by the assessment.

Examples intentionally avoided:

* Redis
* Message queues
* Kubernetes
* Microservices
* Distributed caching

These could be valuable in larger systems but would add operational complexity without solving a current requirement.

---

## 10. REST vs GraphQL

### Decision

Use REST.

### Rationale

The application's data requirements are straightforward and resource-oriented.

REST provides:

* Simple endpoints
* Familiar HTTP semantics
* Easy testing
* Straightforward caching opportunities

GraphQL would introduce additional infrastructure and complexity without a strong current need.

---

## 11. Monolith vs Microservices

### Decision

Use a modular monolith.

### Benefits

* Simple deployment
* Easier local development
* Lower operational overhead
* Strong module boundaries

### Costs

* Backend modules share one deployment unit
* Independent scaling is limited

The current workload does not justify microservices.

---

## 12. What Was Intentionally Not Optimized

The project does not prematurely introduce:

* Distributed caching
* Search infrastructure
* Event-driven processing
* Background workers
* Horizontal database sharding

These are future considerations rather than current requirements.

---

## 13. Overall Trade-off Philosophy

The project favors:

```text
Simple enough to understand
+
Structured enough to scale
+
Testable enough to trust
+
Documented enough to maintain
```

The architecture intentionally avoids complexity that does not solve an identified problem.
