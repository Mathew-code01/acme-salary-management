# ACME Salary Management — Testing Strategy

## 1. Testing Philosophy

Testing is organized around risk.

The goal is not to maximize the number of tests but to ensure that important behavior remains reliable as the codebase evolves.

The project uses multiple testing levels:

```text
Unit Tests
    ↓
Integration/API Tests
    ↓
End-to-End Tests
```

Each level provides different confidence.

---

## 2. Unit Testing

Unit tests isolate business logic.

Primary targets include:

* Employee service
* Salary service
* Analytics service

Unit tests should cover:

* Valid input
* Invalid input
* Missing records
* Boundary conditions
* Business rules
* Error conditions

---

## 3. Employee Service Tests

Important scenarios include:

* List employees
* Paginate employees
* Search employees
* Filter employees
* Retrieve an employee
* Handle missing employees
* Map relational data correctly
* Preserve employee status

---

## 4. Salary Service Tests

Important scenarios include:

* Retrieve salary
* Create salary
* Update salary
* Reject invalid salary amounts
* Reject invalid employee references
* Validate currency
* Validate effective dates

---

## 5. Analytics Service Tests

Analytics tests should verify:

* Aggregate calculations
* Empty datasets
* Department aggregation
* Country aggregation
* Salary distribution
* Expected numeric results

---

## 6. Integration Testing

Integration tests verify multiple layers together.

Examples:

```text
HTTP Request
    ↓
Route
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Integration tests provide confidence that the application layers work together.

---

## 7. API Tests

API tests cover:

* HTTP status codes
* Request validation
* Response shape
* Pagination
* Filtering
* Resource lookup
* Error handling

---

## 8. End-to-End Testing

End-to-end tests use the real application workflow.

Critical journeys include:

### Employee workflow

```text
Open application
    ↓
Navigate to Employees
    ↓
Search employee
    ↓
Apply filter
    ↓
Open employee
    ↓
Review information
```

### Salary workflow

```text
Open employee
    ↓
Review salary
    ↓
Update salary
    ↓
Validate result
```

### Analytics workflow

```text
Open Analytics
    ↓
Load metrics
    ↓
Review charts/data
```

---

## 9. Test Isolation

Tests should avoid depending on one another.

Each test should establish the state it requires.

This prevents:

```text
Test A passes
↓
Test B only passes because Test A ran first
```

---

## 10. Deterministic Data

The seed system provides repeatable development data.

This improves:

* E2E consistency
* Debugging
* Demo reliability
* Local reproduction

---

## 11. Negative Testing

Tests should deliberately exercise invalid scenarios.

Examples:

* Invalid page
* Invalid page size
* Invalid status
* Unknown employee
* Invalid salary
* Missing required field
* Duplicate employee information

---

## 12. Regression Testing

When a bug is fixed, a regression test should be added where practical.

For example, if employee status previously caused a Prisma query failure, the relevant API/service workflow should have a test that verifies status is correctly returned.

---

## 13. Test Coverage Philosophy

Coverage percentage is useful but should not be treated as the primary success metric.

A smaller set of meaningful tests is preferable to large numbers of low-value assertions.

---

## 14. CI Testing

Continuous integration should run appropriate checks such as:

```text
Install
  ↓
Lint
  ↓
Typecheck
  ↓
Unit tests
  ↓
Integration tests
  ↓
Build
```

E2E tests can be included in CI where the environment supports the required browser/runtime dependencies.

---

## 15. Test Naming

Tests should describe behavior rather than implementation.

Prefer:

```text
returns paginated active employees
```

over:

```text
calls prisma.findMany
```

This keeps tests aligned with requirements.

---

## 16. Test Locations

The repository organizes tests approximately as:

```text
server/tests/
├── unit/
├── integration/
└── ...

client/src/test/

e2e/
```

The exact placement should follow the implementation's current test configuration.

---

## 17. Testing Tools

The project uses:

* Vitest
* Testing Library where applicable
* Playwright for E2E testing

These tools provide fast feedback during development and realistic browser workflow testing.

---

## 18. Definition of Done

A feature is considered complete when:

* The implementation works
* Invalid input is handled
* Unit coverage exists for important business logic
* API behavior is covered where appropriate
* Critical UI flows are covered
* TypeScript checks pass
* The application builds successfully
* Documentation is updated where the architecture or behavior changed
