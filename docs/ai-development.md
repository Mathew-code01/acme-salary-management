# AI-Assisted Development

## 1. Purpose

Artificial intelligence may be used throughout the development of ACME Salary Management as an engineering assistant.

The purpose is to improve development efficiency while retaining human ownership of:

* requirements
* architecture
* implementation decisions
* validation
* security
* testing
* final code quality

AI is not treated as an autonomous software engineer.

---

# 2. Development Philosophy

The project follows this general workflow:

```text
Requirement
     ↓
Problem Analysis
     ↓
Design
     ↓
AI Assistance
     ↓
Human Review
     ↓
Implementation
     ↓
Testing
     ↓
Refactoring
     ↓
Verification
     ↓
Commit
```

AI assistance is therefore one part of the development process rather than the complete process.

---

# 3. Appropriate AI Usage

AI may be used for the following activities.

## Requirements

AI can assist with:

* identifying ambiguous requirements
* identifying missing edge cases
* restructuring requirements
* proposing acceptance criteria
* reviewing scope

Human review remains responsible for deciding which requirements are actually valid.

---

# 4. Product Design

AI can assist with:

* information architecture
* interface alternatives
* UX flows
* accessibility considerations
* empty states
* loading states
* error states

The final product design should be evaluated against actual user needs.

---

# 5. Architecture

AI may be used to:

* compare architectural options
* identify potential coupling
* identify scalability concerns
* suggest boundaries
* review folder structures
* identify potential failure points

Architecture decisions must remain deliberate and documented.

---

# 6. Database Design

AI may assist with:

* schema design
* identifying relationships
* suggesting indexes
* identifying query patterns
* designing deterministic seed data
* generating sample records

Database designs must be validated against actual requirements and query behavior.

---

# 7. Backend Development

AI may assist with:

* route scaffolding
* controller structure
* service structure
* repository structure
* validation schemas
* error handling
* test cases

Generated backend code must be reviewed for:

* correctness
* security
* input validation
* error handling
* performance
* type safety

---

# 8. Frontend Development

AI may assist with:

* component scaffolding
* TypeScript types
* hooks
* API integration
* UI states
* accessibility suggestions
* test generation

Generated UI code must be reviewed for:

* usability
* accessibility
* responsiveness
* unnecessary rendering
* state management
* visual consistency

---

# 9. Testing

AI may be used to identify:

* missing test cases
* boundary conditions
* invalid inputs
* failure scenarios
* regression scenarios

For example, when implementing employee search, AI may suggest testing:

```text
empty search
short search
case differences
unknown employee
large result set
combined filters
pagination after filtering
invalid page
invalid page size
```

The development team remains responsible for deciding which tests are relevant.

---

# 10. Code Review

AI can perform an additional review pass to identify potential issues such as:

* duplicated logic
* missing validation
* poor error handling
* accessibility problems
* unnecessary complexity
* missing tests

AI review is supplementary.

It does not replace human code review.

---

# 11. Documentation

AI can assist with:

* improving technical writing
* identifying missing documentation
* converting notes into structured documents
* reviewing consistency
* generating documentation outlines

Technical claims must still be verified.

---

# 12. AI Prompt Artifacts

Meaningful prompts should be retained under:

```text
docs/ai-prompts/
```

The prompt documentation will correspond to actual engineering activities.

Planned prompt categories include:

```text
01-requirements.md
02-product-design.md
03-architecture.md
04-database.md
05-backend.md
06-frontend.md
07-testing.md
08-code-review.md
```

These artifacts should document useful development interactions rather than artificially created conversations.

---

# 13. Prompt Quality

Effective prompts should provide:

* relevant context
* explicit constraints
* expected output
* technical requirements
* known limitations

A useful development prompt should explain the problem rather than simply asking AI to "write code."

---

# 14. Example Development Prompt Structure

A development prompt may follow:

```text
Context

Describe the current application architecture.

Problem

Describe the specific engineering problem.

Requirements

List the expected behavior.

Constraints

List architectural or technical constraints.

Expected Output

Describe exactly what should be produced.

Validation

Describe how the result should be verified.
```

This encourages AI output that is aligned with the project rather than generic code generation.

---

# 15. Human Review Checklist

AI-generated code should be reviewed for:

### Correctness

Does the code actually satisfy the requirement?

### Security

Does it introduce vulnerabilities or expose sensitive information?

### Performance

Does it create unnecessary database queries, network requests, or rendering work?

### Maintainability

Is the implementation understandable?

### Type Safety

Are types accurate and meaningful?

### Architecture

Does the implementation follow the project's boundaries?

### Testing

Is important behavior covered?

### Accessibility

Does the UI remain accessible?

---

# 16. Validation Pipeline

AI-generated implementation should pass the same validation pipeline as manually written code.

Expected checks include:

```text
TypeScript
   ↓
Lint
   ↓
Unit Tests
   ↓
Integration Tests
   ↓
E2E Tests
   ↓
Build
   ↓
Manual Verification
```

AI-generated code does not receive relaxed validation requirements.

---

# 17. AI Limitations

AI may:

* misunderstand requirements
* invent APIs
* use outdated package behavior
* generate insecure code
* introduce unnecessary abstractions
* make incorrect architectural assumptions
* miss edge cases
* produce code that compiles but behaves incorrectly
* incorrectly interpret existing code

These limitations are expected.

---

# 18. Avoiding Blind Copy/Paste

Generated code should not be copied into the project without understanding its purpose.

Before accepting generated code, the developer should be able to explain:

* what the code does
* why it is needed
* what assumptions it makes
* what could fail
* how it is tested
* how it fits the architecture

---

# 19. AI and Security

AI prompts must not contain:

* passwords
* API keys
* private tokens
* production credentials
* private employee information
* database credentials
* secrets stored in environment files

Sensitive information should be replaced with safe placeholders.

---

# 20. AI and Project Ownership

The developer remains responsible for the final implementation.

AI assistance does not transfer responsibility for:

* bugs
* security vulnerabilities
* architectural mistakes
* incorrect requirements
* failing tests
* deployment problems

The final repository represents the developer's engineering decisions.

---

# 21. AI Usage Principle

The project follows this principle:

> AI accelerates engineering work; it does not replace engineering judgment.

The strongest use of AI is therefore not simply generating more code.

It is using AI to:

1. explore possibilities
2. challenge assumptions
3. identify edge cases
4. accelerate repetitive work
5. improve documentation
6. improve test coverage
7. review implementation quality

while keeping humans responsible for the final result.
