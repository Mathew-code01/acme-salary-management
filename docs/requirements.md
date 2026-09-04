# ACME Salary Management — Requirements

## 1. Overview

ACME Salary Management is an enterprise-oriented employee and compensation management application designed to help HR and management teams browse employee records, review compensation information, perform salary updates, and understand compensation patterns through analytics.

The application is designed around a dataset of approximately 10,000 employees and demonstrates how a salary-management workflow can remain responsive and maintainable as the dataset grows.

The project is implemented as a full-stack TypeScript application:

* React + TypeScript + Vite for the frontend
* Node.js + Express + TypeScript for the backend
* Prisma ORM for database access
* SQLite for the assessment environment
* Vitest for unit and integration testing
* Playwright for end-to-end testing

The system focuses on employee and compensation management. It does **not** implement payroll processing, tax calculation, benefits administration, or payment execution.

---

## 2. Product Goals

The primary goals are:

1. Provide a clear employee management experience.
2. Make employee records easy to search, filter, and navigate.
3. Provide salary information in a structured and understandable format.
4. Allow authorized application workflows to update salary information.
5. Provide meaningful compensation analytics.
6. Remain responsive with approximately 10,000 employee records.
7. Demonstrate clean separation between presentation, business logic, persistence, and API layers.
8. Provide automated tests covering critical business workflows.
9. Provide engineering documentation explaining architecture, trade-offs, security, performance, and deployment decisions.

---

## 3. Functional Requirements

### 3.1 Dashboard

The dashboard should provide a high-level overview of the salary-management system.

The dashboard should display relevant aggregate information such as:

* Total employees
* Active employees
* Inactive employees
* Compensation-related summary metrics
* Salary distribution information
* Department-level information
* Country-level information

Dashboard information should be retrieved from backend APIs rather than calculated exclusively from the currently displayed employee page.

---

### 3.2 Employee Management

The system must support employee record management.

Each employee should contain:

* Internal ID
* Employee code
* First name
* Last name
* Full name
* Email
* Country
* Department
* Role
* Employment status
* Creation timestamp
* Last update timestamp

Supported employment statuses include:

* `ACTIVE`
* `INACTIVE`

Employee codes and email addresses must be unique.

---

### 3.3 Employee Listing

The employee list must support:

* Pagination
* Search
* Filtering
* Sorting where supported by the API
* Loading states
* Empty states
* Error states
* Responsive presentation

Pagination must be performed server-side.

The frontend must not load all 10,000 employees simply to display a single page.

---

### 3.4 Employee Search

Users should be able to search employee records using relevant employee information.

Search may include:

* Employee code
* First name
* Last name
* Email

Search parameters must be validated by the backend.

---

### 3.5 Employee Filtering

The employee list should support filtering by relevant dimensions such as:

* Employment status
* Country
* Department
* Role

Filters should be represented as API query parameters.

The backend remains responsible for applying the filtering logic.

---

### 3.6 Employee Details

The application should provide an employee detail experience containing:

* Personal information
* Organizational information
* Employment status
* Current compensation information
* Relevant timestamps

The detail view should clearly distinguish employee information from salary information.

---

## 4. Salary Requirements

### 4.1 Salary Information

Salary records should contain relevant compensation information, including:

* Employee relationship
* Base salary
* Currency
* Effective date
* Creation timestamp
* Last update timestamp

The database should maintain a clear relationship between an employee and their salary record.

---

### 4.2 Salary Updates

The application should support salary updates through a controlled API workflow.

Salary updates must:

* Validate the request body
* Validate numeric salary values
* Validate currency information
* Validate effective dates where applicable
* Return a clear success response
* Return structured validation errors when invalid input is provided

Business logic should remain in the service layer rather than inside route handlers.

---

## 5. Analytics Requirements

The analytics section should provide useful compensation insights.

Analytics may include:

* Average salary
* Minimum salary
* Maximum salary
* Salary distribution
* Department-level salary comparisons
* Country-level salary comparisons
* Employee count by department
* Employee count by country

Analytics calculations should be performed by the backend where possible so that the frontend does not need to retrieve the entire dataset.

---

## 6. API Requirements

The backend API must:

* Use versioned API routes
* Return JSON responses
* Validate request parameters
* Validate request bodies
* Return consistent error responses
* Separate routing from controllers
* Separate controllers from services
* Separate services from repositories
* Avoid leaking database-specific implementation details unnecessarily

The current API namespace is:

`/api/v1`

---

## 7. Validation Requirements

Input validation must occur at the API boundary.

Invalid input should result in:

* HTTP `400 Bad Request`
* A structured error response
* A useful validation message

Validation should cover:

* Pagination values
* Search parameters
* Filter values
* Salary values
* IDs
* Enumerated values
* Required fields

---

## 8. Error Handling Requirements

The application must gracefully handle:

* Invalid API requests
* Missing records
* Database failures
* Unexpected server errors
* Network failures
* Empty search results
* Invalid form submissions

The frontend should provide user-friendly error states.

The backend should not expose stack traces or sensitive internal information in production responses.

---

## 9. Performance Requirements

The application should remain usable with approximately 10,000 employees.

The system should:

* Use server-side pagination
* Avoid unnecessary full-table queries
* Use database indexes for frequently queried fields
* Retrieve only required relational information
* Avoid N+1 query patterns
* Keep frontend rendering scoped to visible data
* Avoid unnecessary API requests

---

## 10. Accessibility Requirements

The UI should follow accessible application practices including:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Appropriate button labels
* Form labels
* Accessible loading and error states
* Sufficient text contrast
* Responsive layouts

Accessibility is treated as part of product quality rather than a separate feature.

---

## 11. Responsive Requirements

The application must support:

* Desktop screens
* Tablet layouts
* Smaller screens

The navigation system should adapt to available screen width.

Tables and dense data views should remain usable on smaller screens without breaking the overall application layout.

---

## 12. Testing Requirements

The application should have automated coverage for critical functionality.

Testing layers include:

### Unit tests

Business logic should be tested independently.

Examples:

* Employee service
* Salary service
* Analytics service

### Integration/API tests

API workflows should be tested against the application/backend.

Examples:

* Employee listing
* Employee filtering
* Salary operations
* Analytics endpoints

### End-to-end tests

Critical user journeys should be tested through the application UI.

Examples:

* Opening the dashboard
* Navigating to employees
* Searching employees
* Viewing employee details
* Performing salary workflows
* Viewing analytics

---

## 13. Non-Functional Requirements

### Maintainability

The system should use clear module boundaries and predictable naming.

### Scalability

The architecture should make it possible to replace SQLite with a production database such as PostgreSQL without rewriting the application layers.

### Reliability

API failures should be handled consistently.

### Security

The system should validate input, protect HTTP responses, avoid exposing secrets, and apply sensible request protections.

### Observability

Backend failures should be logged with sufficient context to support troubleshooting without exposing sensitive data.

---

## 14. Out of Scope

The following functionality is intentionally outside the current assessment scope:

* Payroll processing
* Tax calculation
* Employee benefits management
* Bank/payment processing
* Timesheets
* Leave management
* Recruitment
* Performance reviews
* Authentication/authorization implementation
* Multi-tenant organization management
* External HRIS synchronization
* Real-time collaboration

These may be considered future improvements.

---

## 15. Acceptance Criteria

The application is considered functionally complete when:

1. Employees can be listed through the UI.
2. Employee pagination works correctly.
3. Employee search works correctly.
4. Employee filters work correctly.
5. Employee status is displayed correctly.
6. Employee details can be inspected.
7. Salary information can be viewed.
8. Salary workflows validate invalid input.
9. Analytics return meaningful aggregated information.
10. The UI handles loading, empty, and error states.
11. Automated tests cover critical workflows.
12. The application can run locally using the documented setup.
13. The architecture and engineering decisions are documented.
14. The application can be built successfully for deployment.

---

## 16. Success Criteria

The project should demonstrate more than functional CRUD.

Success means the implementation demonstrates:

* Thoughtful architecture
* Strong TypeScript usage
* Appropriate database design
* Server-side data handling
* Input validation
* Automated testing
* Responsive UX
* Performance awareness
* Security awareness
* Clear engineering trade-offs
* Maintainable documentation
* Incremental development through meaningful Git commits
