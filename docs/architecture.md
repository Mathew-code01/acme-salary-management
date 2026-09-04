# ACME Salary Management — System Architecture

## 1. Architecture Overview

ACME Salary Management follows a layered full-stack architecture.

```text
┌───────────────────────────────────────────────┐
│                   Browser                     │
│                                               │
│        React + TypeScript + Vite              │
│                                               │
│  Pages → Features → Components → API Client   │
└──────────────────────┬────────────────────────┘
                       │ HTTP/JSON
                       ▼
┌───────────────────────────────────────────────┐
│                 Express API                   │
│                                               │
│ Routes → Controllers → Services → Repositories│
│                                               │
│ Validation / Middleware / Error Handling      │
└──────────────────────┬────────────────────────┘
                       │ Prisma
                       ▼
┌───────────────────────────────────────────────┐
│                    Prisma                     │
│                                               │
│              Data Access Layer                │
└──────────────────────┬────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────┐
│                    SQLite                     │
│                                               │
│        Employee / Salary / Reference Data     │
└───────────────────────────────────────────────┘
```

---

## 2. Frontend Architecture

The frontend is implemented using:

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Vitest

The client follows a feature-oriented structure.

```text
client/src/
├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── pages/
├── types/
└── test/
```

---

## 3. Application Layer

The `app` directory contains application-level configuration.

Responsibilities include:

* Application bootstrap
* Providers
* Routing
* Route configuration
* Error boundaries

Application configuration should not contain domain-specific business logic.

---

## 4. Feature Layer

Domain functionality is grouped by feature.

```text
features/
├── dashboard/
├── employees/
├── salary/
└── analytics/
```

This makes domain functionality easier to locate and maintain.

---

## 5. Component Layer

Reusable UI components are separated from domain-specific features.

Examples:

```text
components/
├── ui/
├── layout/
├── navigation/
├── feedback/
└── data-display/
```

This prevents pages from becoming collections of duplicated UI logic.

---

## 6. Backend Architecture

The backend follows a layered architecture.

```text
HTTP Request
     │
     ▼
Middleware
     │
     ▼
Route
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
```

---

## 7. Routes

Routes define the HTTP interface.

Their responsibilities should remain limited to:

* HTTP method
* URL path
* Middleware
* Controller invocation

Routes should not contain database queries.

---

## 8. Controllers

Controllers translate HTTP requests into application operations.

Controllers are responsible for:

* Reading request parameters
* Calling services
* Returning HTTP responses

Controllers should avoid implementing complex business rules.

---

## 9. Services

Services contain business logic.

Examples:

* Employee service
* Salary service
* Analytics service

The service layer is intentionally independent of Express request/response objects where possible.

This makes business logic easier to test.

---

## 10. Repositories

Repositories encapsulate persistence operations.

They are responsible for:

* Prisma queries
* Filtering
* Pagination
* Relations
* Persistence operations

The service layer should not need to know how the database query is implemented.

---

## 11. Validation

Validation occurs at the API boundary.

Schemas validate:

* Query parameters
* Request bodies
* IDs
* Enumerated values
* Numeric ranges

Invalid requests should not reach business logic.

---

## 12. Middleware

Backend middleware provides cross-cutting concerns such as:

* Security headers
* CORS
* Request limits
* Error handling
* Request logging
* Validation support

Cross-cutting behavior should remain centralized rather than duplicated across routes.

---

## 13. Error Architecture

Errors are normalized at the API boundary.

The general flow is:

```text
Database / Service Error
        ↓
Application Error
        ↓
Global Error Middleware
        ↓
HTTP Response
```

The API should return consistent error shapes.

---

## 14. Database Architecture

Prisma provides the data-access abstraction.

The database contains:

```text
Country
Department
Role
Employee
Salary
```

Relationships are represented through foreign keys.

The employee entity references organizational dimensions and may have a salary record.

---

## 15. Request Flow Example

For an employee list request:

```text
GET /api/v1/employees?page=1&pageSize=25
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
          Employee Service
                │
                ▼
        Employee Repository
                │
                ▼
             Prisma
                │
                ▼
             SQLite
                │
                ▼
        Repository Result
                │
                ▼
        Service Mapping
                │
                ▼
          JSON Response
```

---

## 16. API Versioning

The backend uses:

```text
/api/v1
```

Versioning allows future API changes without immediately breaking existing consumers.

---

## 17. Separation of Concerns

The architecture intentionally separates:

| Layer      | Responsibility                    |
| ---------- | --------------------------------- |
| UI         | Rendering and interaction         |
| Feature    | Domain-specific frontend behavior |
| Route      | HTTP routing                      |
| Controller | HTTP translation                  |
| Service    | Business logic                    |
| Repository | Persistence                       |
| Prisma     | ORM/database access               |
| Database   | Data storage                      |

This separation improves testability and maintainability.

---

## 18. Scalability Considerations

The architecture is designed so that database technology can change without requiring a complete application rewrite.

For example:

```text
Current:
SQLite → Prisma → Repository

Potential production:
PostgreSQL → Prisma → Repository
```

The service and controller layers can remain largely unchanged.

---

## 19. Reliability

Reliability is supported through:

* Input validation
* Centralized error handling
* Automated tests
* Database constraints
* Explicit relation behavior
* Controlled pagination
* Defensive API validation

---

## 20. Architectural Boundaries

The following rules are intentionally maintained:

1. React components should not directly execute database operations.
2. Routes should not contain business logic.
3. Controllers should not contain complex Prisma queries.
4. Services should not depend unnecessarily on Express.
5. Repositories should own persistence implementation.
6. Validation should happen before business logic.
7. Shared UI should remain reusable.

---

## 21. Testing Architecture

Testing exists at multiple levels:

```text
Unit
  ↓
Service behavior

Integration
  ↓
API + application behavior

E2E
  ↓
Real user workflows
```

Each layer has a different purpose and should not attempt to replace the others.
