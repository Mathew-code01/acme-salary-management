# Contributing

## Development Philosophy

ACME Salary Management is developed incrementally with an emphasis
on maintainability, correctness, testing, and clear architectural
boundaries.

## Workflow

1. Understand the requirement.
2. Identify the affected architectural boundary.
3. Implement the smallest appropriate change.
4. Add or update tests.
5. Validate the implementation.
6. Update documentation where necessary.
7. Commit the change with a focused message.

## Commit Style

Commits should follow a conventional style.

Examples:

- `feat(api): add employee search`
- `fix(ui): correct employee pagination`
- `test(api): cover salary validation`
- `perf(db): add employee search index`
- `docs: explain analytics architecture`

## Pull Requests

Pull requests should explain:

- what changed
- why it changed
- how it was tested
- any risks or trade-offs

## Code Quality

All production code should prioritize:

- type safety
- readable names
- small cohesive functions
- explicit error handling
- appropriate validation
- testability
- minimal unnecessary abstraction