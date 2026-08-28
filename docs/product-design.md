# ACME Salary Management — Product Design

## 1. Product Vision

ACME Salary Management should feel like a professional internal enterprise application rather than a prototype.

The interface should prioritize:

* clarity
* information hierarchy
* efficient workflows
* readable data
* predictable interactions
* accessibility
* responsive behavior

The product should help an HR user understand compensation without requiring unnecessary navigation or technical knowledge.

---

# 2. Primary User

The primary user is an HR manager or HR administrator.

The interface should therefore optimize for:

* frequent data lookup
* rapid employee search
* structured filtering
* comparison
* data interpretation
* controlled editing

---

# 3. Information Architecture

The application has three primary areas:

```text
Dashboard
Employees
Analytics
```

Secondary pages include:

```text
Employee Details
Not Found
Application Error
```

---

# 4. Global Application Layout

The desktop application will use:

```text
┌───────────────────────────────────────────────────────────┐
│ Header                                                    │
├────────────────┬──────────────────────────────────────────┤
│                │                                          │
│ Sidebar        │ Main Content                             │
│                │                                          │
│ Dashboard      │                                          │
│ Employees      │                                          │
│ Analytics      │                                          │
│                │                                          │
│                │                                          │
└────────────────┴──────────────────────────────────────────┘
```

The layout should maintain a consistent navigation model across all pages.

---

# 5. Navigation

## Dashboard

Provides a high-level compensation overview.

## Employees

Provides access to the searchable employee dataset.

## Analytics

Provides detailed compensation analysis.

---

# 6. Dashboard

The dashboard is the first screen users should see.

Its purpose is to answer:

> "What does compensation look like across the organization?"

---

## 6.1 Dashboard Header

The header should contain:

* page title
* short contextual description
* optional date or data freshness information

Example:

```text
Compensation Overview

Understand salary distribution and payroll across the organization.
```

---

## 6.2 KPI Cards

The dashboard should provide four primary metrics:

```text
┌────────────────┐ ┌────────────────┐
│ Employees      │ │ Total Payroll  │
│ 10,000         │ │ $850M          │
└────────────────┘ └────────────────┘

┌────────────────┐ ┌────────────────┐
│ Average Salary │ │ Median Salary  │
│ $85,000        │ │ $78,000        │
└────────────────┘ └────────────────┘
```

The actual values are determined from the database.

---

# 7. Dashboard Visualizations

The dashboard should contain a limited number of high-value visualizations.

Recommended visualizations:

1. Salary Distribution
2. Salary by Country
3. Salary by Department

Charts should communicate information rather than exist purely as decoration.

---

# 8. Employees Page

The Employees page is the primary operational workspace.

It should contain:

```text
Employee Management

[ Search employees... ]

[ Country ▼ ] [ Department ▼ ] [ Role ▼ ]

┌─────────────────────────────────────────────────────────────┐
│ Employee │ Department │ Role │ Country │ Salary │ Actions  │
├─────────────────────────────────────────────────────────────┤
│ ...                                                         │
└─────────────────────────────────────────────────────────────┘

                 < 1 2 3 4 5 >
```

---

# 9. Employee Search

Search should be prominent and easy to access.

Users should be able to search by:

* employee ID
* name
* email

Search should use a debounce mechanism to prevent excessive API requests while typing.

---

# 10. Employee Filters

Filters should be displayed near the search control.

Primary filters:

* country
* department
* role

Filters should work together.

The active filter state should be visible to the user.

---

# 11. Employee Table

The table should provide enough information to identify an employee quickly.

Recommended columns:

```text
Employee
Email
Department
Role
Country
Salary
Actions
```

The employee identifier may be displayed within the employee identity cell rather than requiring a separate column.

---

# 12. Employee Row

Each row should provide:

* employee identity
* organizational information
* salary
* navigation to details
* available actions

Actions should not overwhelm the table.

---

# 13. Employee Details

The employee details page should organize information into clear sections.

```text
Employee Details

[ Back to Employees ]

┌──────────────────────────────────────┐
│ Employee Information                │
│                                      │
│ Name                                 │
│ Email                                │
│ Employee ID                          │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Organization                         │
│                                      │
│ Department                           │
│ Role                                 │
│ Country                              │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Compensation                         │
│                                      │
│ Salary                               │
│ Currency                             │
│ Compensation Context                 │
│                                      │
│ [ Edit Salary ]                      │
└──────────────────────────────────────┘
```

---

# 14. Editing

Editing should be explicit.

Forms should:

* display current values
* clearly identify editable fields
* validate input
* display validation errors
* provide save and cancel actions
* prevent accidental loss of changes

---

# 15. Delete Interaction

Deleting an employee is destructive.

The interface should require confirmation.

Example:

```text
Delete employee?

This action cannot be undone.

[Cancel] [Delete employee]
```

The confirmation should clearly identify the employee being deleted.

---

# 16. Analytics Page

The Analytics page should provide deeper analysis than the dashboard.

Sections:

```text
Analytics

Summary
Salary Distribution
Country Analysis
Department Analysis
Role Analysis
```

---

# 17. Analytics Filters

Analytics should support relevant filters where meaningful.

Potential filters:

* country
* department
* role

The filtering model should remain simple and should not introduce unnecessary complexity.

---

# 18. Salary Distribution

The salary distribution visualization should show how employees are distributed across salary ranges.

Example:

```text
Employees

2500 ┤
2000 ┤ ███
1500 ┤ █████
1000 ┤ ███████
 500 ┤ █████
   0 └────────────────────────
       Salary Range
```

The final implementation may use a charting library appropriate for the project.

---

# 19. Country Analysis

Country analysis should allow users to compare compensation across countries.

Potential displayed metrics:

* employees
* average salary
* total payroll

The UI should make comparisons easy to understand.

---

# 20. Department Analysis

Department analysis should provide similar information:

* employee count
* average salary
* total payroll

---

# 21. Role Analysis

Role analysis should allow users to understand compensation by role.

Potential information:

* employee count
* average salary
* total payroll

---

# 22. Loading States

Every asynchronous page should have a useful loading state.

Examples:

* skeleton cards
* skeleton table rows
* chart placeholders

Loading states should preserve the approximate layout of the final content where practical.

---

# 23. Empty States

Empty states should explain the situation.

Example:

```text
No employees found

Try adjusting your search or filters.
```

Empty states should not look like application errors.

---

# 24. Error States

Errors should communicate:

1. what happened
2. whether the user needs to act
3. whether retrying is possible

Example:

```text
Unable to load employees

Something went wrong while retrieving employee data.

[ Try again ]
```

Technical stack traces should never be shown to normal users.

---

# 25. Responsive Design

Desktop is the primary experience.

Tablet and mobile layouts should remain functional.

On smaller screens:

* sidebar becomes mobile navigation
* filters may collapse
* cards stack
* tables may scroll horizontally
* page headers adapt
* actions remain accessible

---

# 26. Accessibility

The interface should follow accessible interaction patterns.

Important requirements include:

* semantic HTML
* keyboard navigation
* visible focus indicators
* labels for form controls
* accessible dialog behavior
* accessible buttons
* meaningful link names
* sufficient contrast
* clear validation errors
* appropriate ARIA only where necessary

---

# 27. Visual Design Direction

The visual language should be:

* professional
* restrained
* clean
* data-focused
* modern
* enterprise-oriented

Avoid excessive:

* gradients
* decorative animations
* oversized typography
* glassmorphism
* visual noise

The goal is to make important information easy to scan.

---

# 28. Component Design

Reusable primitives should be separated from feature-specific components.

### Shared UI

Examples:

```text
Button
Input
Select
Dialog
Dropdown
Badge
Card
Table
Skeleton
Tooltip
Pagination
```

### Layout

Examples:

```text
AppShell
PageContainer
PageHeader
ContentArea
```

### Feature Components

Examples:

```text
EmployeeTable
EmployeeSearch
SalaryCard
AnalyticsSummary
SalaryDistribution
```

This prevents business-specific behavior from leaking into generic UI primitives.

---

# 29. Interaction Principles

## Predictability

Actions should behave consistently across the application.

## Feedback

Every meaningful asynchronous action should provide feedback.

## Reversibility

Non-destructive actions should be easy to cancel.

## Confirmation

Destructive actions should require deliberate confirmation.

## Visibility

Important application state should be visible without requiring users to inspect technical details.

---

# 30. Performance UX

The UI should:

* debounce search
* paginate large datasets
* avoid unnecessary API requests
* cache appropriate queries
* avoid rendering thousands of rows
* provide immediate loading feedback

---

# 31. Product Quality Standard

The final product should feel like a real internal HR tool.

A user should not need to understand:

* React
* TypeScript
* APIs
* databases
* Prisma
* HTTP

to use the application effectively.

Technical complexity belongs behind a simple user experience.
