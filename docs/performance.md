# ACME Salary Management — Performance Strategy

## 1. Performance Objective

The application is designed to remain responsive while managing approximately 10,000 employees.

The main performance risk is not the raw size of 10,000 records but inefficient access patterns such as:

* Loading the complete dataset into the browser
* Unbounded queries
* Repeated database requests
* N+1 relation queries
* Excessive frontend rendering
* Unnecessary API requests

---

## 2. Server-Side Pagination

Employee records are paginated on the server.

Instead of:

```text
Database → 10,000 records → Browser
```

the application uses:

```text
Database → requested page → API → Browser
```

This reduces:

* Network payload
* Browser memory usage
* Rendering work
* Initial page load cost

---

## 3. Query Validation

Pagination parameters are validated before reaching the database.

This prevents requests such as:

```text
?page=1&pageSize=1000000
```

from creating unnecessarily large queries.

---

## 4. Database Indexes

Indexes support frequent employee queries.

Relevant indexes include:

* Status
* Country
* Department
* Role
* Creation date
* Name
* Common organizational combinations

Indexes should be evaluated against real query patterns.

---

## 5. Relation Loading

Employee queries require organizational information such as:

* Country
* Department
* Role

The repository retrieves required relations as part of the database operation instead of triggering separate queries for every employee.

This reduces the risk of N+1 query behavior.

---

## 6. Response Mapping

Database entities are mapped into API-facing objects.

This provides two benefits:

1. The API does not expose the internal Prisma shape directly.
2. The frontend receives a predictable data model.

---

## 7. Frontend Rendering

The frontend should render only the data needed for the current screen.

For employee lists, this means:

* Current page only
* Stable keys
* Reusable components
* Controlled updates
* Avoiding unnecessary state changes

---

## 8. API Request Efficiency

The frontend should avoid duplicate requests.

Examples:

* Do not request the same employee list repeatedly without a state change.
* Debounce text search where appropriate.
* Keep pagination state synchronized with the current query.
* Cancel or ignore stale requests where appropriate.

---

## 9. Analytics

Analytics calculations should be performed as close to the data source as practical.

Instead of:

```text
Database
   ↓
All employees
   ↓
API
   ↓
Browser
   ↓
Calculate statistics
```

prefer:

```text
Database
   ↓
Aggregate query
   ↓
API
   ↓
Browser
```

This reduces transfer and frontend processing.

---

## 10. Payload Size

API responses should not contain unnecessary fields.

Large collection responses should contain only the fields required by the current consumer.

Detailed employee information can be retrieved separately when necessary.

---

## 11. Frontend Build Optimization

The Vite production build provides:

* Bundling
* Minification
* Asset optimization
* Static asset handling

Large features should be candidates for route-level code splitting as the application grows.

---

## 12. Database Scalability

SQLite is suitable for the assessment workload.

For higher concurrency and production enterprise usage, PostgreSQL would provide a stronger persistence layer.

The repository abstraction reduces the migration impact.

---

## 13. Performance Risks

Known potential bottlenecks include:

### Large analytics queries

Complex aggregations may become expensive as the dataset grows.

### Unindexed search

Search across large text fields can become slower without appropriate indexing/search infrastructure.

### High concurrent writes

SQLite has limitations for concurrent write-heavy workloads.

### Large client bundles

As more functionality is added, bundle size should be monitored.

---

## 14. Future Performance Improvements

Potential improvements include:

* PostgreSQL
* Redis caching
* Query result caching
* Background analytics processing
* Full-text search
* Materialized analytics views
* Virtualized large tables
* CDN-backed static assets
* Horizontal API scaling

These are intentionally not required for the current assessment scope.

---

## 15. Performance Philosophy

The project prioritizes appropriate performance engineering rather than premature optimization.

The primary strategy is:

```text
Good data access
+
Good pagination
+
Good database design
+
Controlled rendering
+
Measured optimization
```

rather than adding infrastructure before it is necessary.
