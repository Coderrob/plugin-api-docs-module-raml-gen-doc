# Agent Guidelines

## Overview

This document defines the standards, principles, and expectations for maintaining code quality in this codebase. All contributors and AI agents working on this project should follow these guidelines to ensure consistency, maintainability, and high-quality code.

## Core Principles

### 1. Less Code is the Best Code

- **Minimize complexity**: Write the simplest solution that solves the problem
- **Avoid over-engineering**: Don't add features or abstractions that aren't needed
- **Delete before adding**: Look for opportunities to remove code rather than add it
- **Prefer composition over inheritance**: Use simple, composable functions
- **Single Responsibility**: Each function/class should do one thing well

### 2. FAST Principle

- **Few**: Minimize the number of functions, classes, and dependencies
- **Adaptable**: Code should be easy to change and extend
- **Simple**: Prefer simple solutions over clever ones
- **Testable**: All code must be thoroughly testable

### 3. Clean Code Standards

#### Naming Conventions
- Use descriptive, self-documenting names
- Functions: `verbNoun` (e.g., `parseRaml`, `validateCoverage`)
- Classes: `PascalCase` (e.g., `RamlParser`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `RAML_WIDGET_TYPE`)
- Private members: prefix with underscore (e.g., `_cache`)

#### Function Guidelines
- Maximum 20 lines per function (excluding comments)
- Maximum 3 parameters (use objects for more)
- Cognitive complexity < 4 per function
- Pure functions preferred (no side effects when possible)
- Early returns for guard clauses

#### Error Handling
- Fail fast with clear error messages
- Use specific error types
- Document error conditions in function comments
- Validate inputs at function boundaries

#### Documentation
- Self-documenting code is preferred over comments
- Document "why" not "what"
- Use JSDoc for public APIs
- Include usage examples for complex functions

## Testing Standards

Comprehensive testing guidelines are documented in [src/AGENTS.md](src/AGENTS.md).

### Key Testing Principles

1. **100% Coverage Target**: Aim for 100% test coverage (minimum 95%)
2. **Test Structure**: Root `describe` per file, nested `describe` per function
3. **Setup/Teardown**: Use `beforeEach` for setup, `afterEach` for cleanup
4. **Mock Hygiene**: Clear mocks after each test to prevent test bleed
5. **Explicit Assertions**: Verify call counts and arguments explicitly

## Code Review Requirements

### Before Submitting

- [ ] All tests pass locally
- [ ] Linter passes with no warnings
- [ ] Test coverage meets threshold (≥95%)
- [ ] No console.log or debug statements
- [ ] Documentation updated if API changed
- [ ] Git history is clean (meaningful commits)

### Security Checks

- [ ] No secrets or credentials in code
- [ ] Dependencies checked for vulnerabilities
- [ ] Input validation on all external data
- [ ] Error messages don't leak sensitive info

## CI/CD Pipeline

### Workflow Steps

1. **Lint**: Code style and formatting check
2. **Test**: Run all tests with coverage
3. **Coverage Check**: Validate ≥95% coverage threshold
4. **Security Scan**: CodeQL and dependency checks

### Coverage Script

The coverage validation script (`scripts/check-coverage.sh`) follows bash best practices:
- Google Shell Style Guide compliant
- Comprehensive documentation (49% of code)
- ShellCheck compliant with zero warnings
- Defensive programming with proper error handling

## Best Practices by File Type

### TypeScript/React Files

- Use modern JSX transform (no default React imports)
- Prefer type imports: `import type { ... }`
- Use functional components with hooks
- Destructure props in function signature
- Extract custom hooks for complex logic

### Test Files

See [src/AGENTS.md](src/AGENTS.md) for detailed testing guidelines.

### Shell Scripts

- Use `#!/usr/bin/env bash` shebang
- Set strict mode: `set -euo pipefail`
- Document with header comments
- Use `readonly` for constants
- Use `local` for function variables
- Pass ShellCheck with no warnings

### GitHub Actions Workflows

- Use explicit permissions (principle of least privilege)
- Version pin actions (e.g., `@v4`)
- Include matrix builds for multiple versions
- Upload artifacts with unique names in matrix builds
- Use caching for dependencies

## Anti-Patterns to Avoid

### Code Smells

- ❌ Long functions (>20 lines)
- ❌ Deeply nested conditionals (>3 levels)
- ❌ Magic numbers/strings (use constants)
- ❌ Commented-out code (delete it)
- ❌ God classes (classes that do too much)
- ❌ Tight coupling between modules

### Testing Smells

- ❌ Tests without assertions
- ❌ Shared test state (test interdependence)
- ❌ Mock leaks between tests
- ❌ Testing implementation details
- ❌ Overly complex test setup
- ❌ Tests that test the framework

### Performance Pitfalls

- ❌ Unchecked mock implementations (can cause accidental service calls)
- ❌ Missing call count assertions (overhead from repeated mocks)
- ❌ Unmocked dependencies (unintended external calls)
- ❌ Synchronous operations in async code
- ❌ Memory leaks from uncleared subscriptions

## Maintenance Guidelines

### Refactoring Checklist

- [ ] Tests still pass after changes
- [ ] Coverage hasn't decreased
- [ ] No new linter warnings
- [ ] Documentation updated
- [ ] Breaking changes documented in CHANGELOG

### Dependency Management

- Use caret ranges for flexibility: `^1.2.3`
- Pin exact versions only when necessary (document why)
- Check for vulnerabilities: `yarn audit`
- Keep dependencies up to date quarterly
- Remove unused dependencies

### Performance Monitoring

- Monitor test execution time
- Identify slow tests and optimize
- Use `mockOnce` for one-time mocks
- Verify mock call counts to prevent overhead
- Profile coverage script execution

## References

- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- [Backstage Best Practices](https://backstage.io/docs/plugins/best-practices)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Clean Code Principles](https://github.com/ryanmcdermott/clean-code-javascript)

## Questions or Concerns?

Open an issue or reach out to the maintainers for clarification on any guidelines.
