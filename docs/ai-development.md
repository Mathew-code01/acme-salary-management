# ACME Salary Management — AI-Assisted Development

## 1. Purpose

AI tools were used as development assistants during the project.

AI was treated as a productivity and reasoning tool rather than as an autonomous source of truth.

All generated suggestions were reviewed, adapted, tested, and integrated into the application deliberately.

---

## 2. Areas Where AI Assisted

AI assistance was used for activities including:

* Architecture exploration
* Folder structure design
* API design discussion
* Database modeling
* TypeScript implementation
* Test generation
* Error analysis
* Refactoring
* Documentation
* UX iteration
* Performance considerations
* Security review

---

## 3. AI Development Workflow

The development process generally followed:

```text
Requirement
    ↓
Design / Reasoning
    ↓
AI-assisted exploration
    ↓
Implementation
    ↓
Human review
    ↓
Tests
    ↓
Manual verification
    ↓
Refinement
    ↓
Commit
```

AI output was not automatically accepted.

---

## 4. Example Prompt Categories

### Architecture

Questions were used to explore:

* How should frontend and backend responsibilities be separated?
* Where should business logic live?
* How should repositories interact with services?
* How should the application scale to 10,000 employees?

### Database

AI assistance was used to explore:

* Employee relationships
* Salary relationships
* Indexing
* Pagination
* Referential integrity
* Seed-data strategies

### API

Prompts explored:

* REST endpoint organization
* Validation
* Pagination contracts
* Error responses
* HTTP status codes

### Testing

Prompts explored:

* Unit-test boundaries
* Integration workflows
* E2E scenarios
* Regression coverage
* Negative cases

### UX

AI assistance was used to review:

* Navigation structure
* Enterprise application layout
* Empty states
* Loading states
* Error states
* Responsive behavior

---

## 5. AI Code Review Process

Generated code was reviewed against:

* Existing architecture
* TypeScript compiler errors
* Lint rules
* Existing tests
* Database schema
* API contracts
* Security requirements
* Actual product requirements

Code was modified when AI suggestions conflicted with the project.

---

## 6. Verification

AI-generated or AI-assisted implementation was verified using:

* TypeScript compilation
* Unit tests
* Integration tests
* E2E tests
* Local API testing
* Browser testing
* Production builds

A suggestion was not considered complete simply because it looked syntactically correct.

---

## 7. Example Development Incident

During development, employee status was introduced as an enum.

The feature required coordinated changes across:

```text
Prisma schema
      ↓
Migration
      ↓
Seed data
      ↓
Repository
      ↓
Service mapping
      ↓
API
      ↓
Frontend
      ↓
Tests
```

This illustrates why AI-generated changes must be reviewed across the complete dependency chain.

---

## 8. AI Limitations

AI can produce:

* Incorrect APIs
* Outdated library usage
* Invalid assumptions
* Inconsistent architecture
* Missing edge cases
* Security weaknesses
* Code that compiles but does not meet requirements

Therefore, AI output was treated as a proposal rather than a final implementation.

---

## 9. Human Responsibility

The developer remains responsible for:

* Technical decisions
* Requirement interpretation
* Security
* Testing
* Code quality
* Final implementation
* Deployment configuration

AI does not replace engineering judgment.

---

## 10. Prompt Documentation

Project-specific AI prompts are maintained under:

```text
docs/ai-prompts/
```

Prompts are organized around meaningful development activities rather than recording every conversational interaction.

---

## 11. AI and Testing

AI-generated tests were reviewed to ensure that they tested behavior rather than implementation details.

Particular attention was given to:

* Edge cases
* Negative paths
* Regression scenarios
* Business rules

---

## 12. AI and Security

Security-related AI suggestions were treated cautiously.

Security recommendations were reviewed against:

* Actual application architecture
* Existing middleware
* Deployment environment
* Authentication model
* Data sensitivity

No AI suggestion was considered a substitute for security review.

---

## 13. AI-Assisted Engineering Principle

The project follows this principle:

> AI accelerates engineering work; it does not remove engineering responsibility.

The final codebase represents reviewed and verified engineering decisions rather than unreviewed AI output.
