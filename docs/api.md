# ACME Salary Management — API Contract

## 1. API Overview

The backend exposes a versioned REST API.

Base path:

```text
/api/v1
```

Responses use JSON.

---

## 2. General Response Principles

Successful responses should:

* Return appropriate HTTP status codes
* Return JSON
* Use predictable field names
* Avoid exposing database implementation details unnecessarily

Errors should return:

* HTTP status
* Machine-readable error information where appropriate
* Human-readable message
* Validation details when applicable

---

# 3. Employee API

## GET `/api/v1/employees`

Returns a paginated list of employees.

### Query parameters

```text
page
pageSize
search
status
countryId
departmentId
roleId
```

Example:

```text
GET /api/v1/employees?page=1&pageSize=25
```

---

## Employee List Response

Conceptually:

```json
{
  "items": [
    {
      "id": 1,
      "employeeCode": "EMP-00001",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "status": "ACTIVE",
      "countryId": 1,
      "countryName": "South Africa",
      "departmentId": 1,
      "departmentName": "Engineering",
      "roleId": 1,
      "roleName": "Software Engineer",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 25,
    "total": 10000,
    "totalPages": 400
  }
}
```

The exact response wrapper should follow the implementation in the current server package.

---

# 4. Employee Details

## GET `/api/v1/employees/:id`

Returns a specific employee.

Example:

```text
GET /api/v1/employees/1
```

A successful response contains:

* Employee identity
* Organization information
* Status
* Salary information where available

If the employee does not exist:

```text
404 Not Found
```

---

# 5. Employee Creation

## POST `/api/v1/employees`

Creates an employee.

The request must contain the required employee fields.

Example conceptual request:

```json
{
  "employeeCode": "EMP-10001",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "countryId": 1,
  "departmentId": 2,
  "roleId": 3,
  "status": "ACTIVE"
}
```

Validation must reject:

* Missing required fields
* Invalid IDs
* Invalid email addresses
* Invalid status values
* Duplicate employee codes
* Duplicate email addresses

---

# 6. Employee Update

## PATCH `/api/v1/employees/:id`

Updates employee information.

Only supported fields should be accepted.

The service layer remains responsible for business rules.

---

# 7. Salary API

Salary endpoints provide compensation-related workflows.

The salary API should support:

* Retrieving salary information
* Creating salary information where appropriate
* Updating salary information
* Validating salary input

---

## Salary Validation

Salary requests should validate:

* Employee ID
* Amount
* Currency
* Effective date

Salary amount must be a valid positive numeric value.

---

# 8. Analytics API

Analytics endpoints provide aggregated information.

Examples include:

```text
/api/v1/analytics
/api/v1/analytics/salary
/api/v1/analytics/departments
/api/v1/analytics/countries
```

The exact endpoint set should remain synchronized with the implemented route configuration.

Analytics responses should contain aggregated values rather than requiring the frontend to process the entire employee dataset.

---

# 9. Pagination Contract

Pagination parameters should be validated.

Example:

```text
?page=1&pageSize=25
```

Rules:

* `page` must be a positive integer
* `pageSize` must be a positive integer
* Maximum page size should be enforced

This prevents accidentally expensive requests.

---

# 10. Filtering Contract

Filters should use explicit query parameters.

For example:

```text
?status=ACTIVE
```

Unsupported enum values should produce a validation error.

---

# 11. Error Contract

A validation error should conceptually resemble:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters.",
    "details": []
  }
}
```

A missing resource should return:

```text
404 Not Found
```

Unexpected failures should return:

```text
500 Internal Server Error
```

without exposing internal stack traces.

---

# 12. HTTP Status Codes

Common status codes:

| Status | Meaning                                  |
| ------ | ---------------------------------------- |
| 200    | Successful request                       |
| 201    | Resource created                         |
| 204    | Successful request without response body |
| 400    | Invalid request                          |
| 404    | Resource not found                       |
| 409    | Conflict                                 |
| 429    | Too many requests                        |
| 500    | Unexpected server error                  |

---

# 13. API Design Principles

The API follows these principles:

1. Version endpoints.
2. Validate input at the boundary.
3. Use meaningful HTTP status codes.
4. Keep controllers thin.
5. Keep business logic in services.
6. Keep database operations in repositories.
7. Avoid leaking database errors.
8. Keep responses predictable.
9. Paginate large collections.
10. Return only the data required by the consumer where practical.

---

# 14. Example Request Flow

```text
HTTP Request
     ↓
Route
     ↓
Validation
     ↓
Controller
     ↓
Service
     ↓
Repository
     ↓
Prisma
     ↓
Database
```

---

# 15. API Evolution

Future breaking changes should be introduced through a new API version.

For example:

```text
/api/v1
/api/v2
```

rather than silently changing the meaning of an existing endpoint.
