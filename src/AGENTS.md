# Testing Guidelines for Agents

## Overview

This document defines the testing standards and best practices for this codebase. All tests must follow these guidelines to ensure quality, maintainability, and prevent common testing pitfalls.

## Core Testing Principles

### 1. Test Structure

#### File Organization
- **One test file per source file**: `component.tsx` → `component.test.tsx`
- **Co-located with source**: Tests live next to the code they test
- **Naming convention**: `*.test.ts` or `*.test.tsx`

#### Test Hierarchy
```typescript
// Root describe block - one per file
describe('ComponentName or functionName', () => {
  
  // Nested describe block - one per function/method
  describe('functionName', () => {
    
    // Individual test cases
    it('should handle positive case', () => {
      // Test implementation
    });
    
    it('should handle negative case', () => {
      // Test implementation
    });
    
    it('should throw error on invalid input', () => {
      // Test implementation
    });
  });
  
  describe('anotherFunction', () => {
    // More tests...
  });
});
```

### 2. Setup and Teardown

#### beforeEach - Initialize Test Variables and Mocks

Use `beforeEach` to set up a clean state for each test:

```typescript
describe('RamlParser', () => {
  let parser: RamlParser;
  let mockWebApiParser: jest.Mocked<typeof WebApiParser>;
  
  beforeEach(() => {
    // Initialize test subjects
    parser = new RamlParser();
    
    // Set up mocks
    mockWebApiParser = {
      raml08: { parse: jest.fn() },
      raml10: { parse: jest.fn() },
      oas20: { generateString: jest.fn() }
    };
  });
  
  // Tests...
});
```

**Benefits:**
- ✅ Fresh state for each test
- ✅ No shared state between tests
- ✅ Tests can run in any order
- ✅ Parallel test execution safe

#### afterEach - Cleanup and Clear Mocks

Use `afterEach` to clean up after tests:

```typescript
describe('Component', () => {
  afterEach(() => {
    // Clear all mocks to prevent test bleed
    jest.clearAllMocks();
    
    // Restore any spies or replaced implementations
    jest.restoreAllMocks();
    
    // Clean up any subscriptions or timers
    jest.clearAllTimers();
  });
  
  // Tests...
});
```

**Critical for preventing:**
- ❌ Test bleed (one test affecting another)
- ❌ Mock pollution across tests
- ❌ Memory leaks from uncleaned resources
- ❌ False positives/negatives

### 3. Mock Hygiene - Preventing Test Bleed

#### The Problem: Mock Pollution

```typescript
// ❌ BAD - Mock persists across tests
describe('Bad Example', () => {
  it('test 1', () => {
    mockFunction.mockReturnValue('value1');
    // Test uses mock
  });
  
  it('test 2', () => {
    // Unexpectedly still returns 'value1'!
    // This is test bleed
  });
});
```

#### The Solution: Use mockOnce and Clear Mocks

```typescript
// ✅ GOOD - Explicit, scoped mocks
describe('Good Example', () => {
  beforeEach(() => {
    mockFunction = jest.fn();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('test 1', () => {
    mockFunction.mockReturnValueOnce('value1');
    // Mock only applies to this test
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
  
  it('test 2', () => {
    mockFunction.mockReturnValueOnce('value2');
    // Fresh mock, no pollution
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
});
```

### 4. Explicit Mock Assertions

#### Always Verify Call Counts

```typescript
// ❌ BAD - Doesn't verify call count
it('should parse RAML', async () => {
  mockParser.parse.mockResolvedValue(result);
  await service.parseRaml(input);
  expect(mockParser.parse).toHaveBeenCalled();
});

// ✅ GOOD - Explicitly verifies call count
it('should parse RAML', async () => {
  mockParser.parse.mockResolvedValueOnce(result);
  await service.parseRaml(input);
  expect(mockParser.parse).toHaveBeenCalledTimes(1);
  expect(mockParser.parse).toHaveBeenCalledWith(input);
});
```

#### Verify Nth Call Arguments

When a function is called multiple times, verify each call:

```typescript
it('should call parser for each definition', async () => {
  const def1 = 'definition1';
  const def2 = 'definition2';
  
  mockParser.parse
    .mockResolvedValueOnce('result1')
    .mockResolvedValueOnce('result2');
  
  await service.parseMultiple([def1, def2]);
  
  // Verify total calls
  expect(mockParser.parse).toHaveBeenCalledTimes(2);
  
  // Verify 1st call
  expect(mockParser.parse).toHaveBeenNthCalledWith(1, def1);
  
  // Verify 2nd call
  expect(mockParser.parse).toHaveBeenNthCalledWith(2, def2);
});
```

### 5. Complete Test Coverage

#### Positive Test Cases

Test the happy path and expected behavior:

```typescript
describe('calculatePercentage', () => {
  it('should calculate percentage correctly', () => {
    const result = calculatePercentage(75, 100);
    expect(result).toBe(75);
  });
  
  it('should handle 100% coverage', () => {
    const result = calculatePercentage(100, 100);
    expect(result).toBe(100);
  });
  
  it('should handle 0% coverage', () => {
    const result = calculatePercentage(0, 100);
    expect(result).toBe(0);
  });
});
```

#### Negative Test Cases

Test error conditions and edge cases:

```typescript
describe('calculatePercentage', () => {
  it('should throw error on division by zero', () => {
    expect(() => calculatePercentage(50, 0))
      .toThrow('Division by zero');
  });
  
  it('should throw error on negative values', () => {
    expect(() => calculatePercentage(-10, 100))
      .toThrow('Negative values not allowed');
  });
  
  it('should throw error when hit exceeds found', () => {
    expect(() => calculatePercentage(150, 100))
      .toThrow('Hit count cannot exceed found count');
  });
});
```

#### Edge Cases

Test boundary conditions:

```typescript
describe('validateThreshold', () => {
  it('should accept threshold at exactly 95%', () => {
    expect(validateThreshold(95, 95)).toBe(true);
  });
  
  it('should reject threshold at 94.99%', () => {
    expect(validateThreshold(94.99, 95)).toBe(false);
  });
  
  it('should handle null values', () => {
    expect(() => validateThreshold(null, 95))
      .toThrow('Threshold cannot be null');
  });
  
  it('should handle undefined values', () => {
    expect(() => validateThreshold(undefined, 95))
      .toThrow('Threshold cannot be undefined');
  });
});
```

## Advanced Patterns

### 6. Async Testing

#### Always Use async/await or return Promise

```typescript
// ✅ GOOD - Using async/await
it('should fetch data', async () => {
  const result = await service.fetchData();
  expect(result).toBeDefined();
});

// ✅ GOOD - Returning promise
it('should fetch data', () => {
  return service.fetchData().then(result => {
    expect(result).toBeDefined();
  });
});

// ❌ BAD - Missing await/return
it('should fetch data', () => {
  service.fetchData().then(result => {
    expect(result).toBeDefined(); // May not execute!
  });
});
```

### 7. React Component Testing

#### Testing Library Best Practices

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('LoginForm', () => {
  let mockOnSubmit: jest.Mock;
  
  beforeEach(() => {
    mockOnSubmit = jest.fn();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should render form fields', () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });
  
  it('should call onSubmit with form data', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText('Username'), 'testuser');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Login' }));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123'
      });
    });
  });
});
```

### 8. Hook Testing

```typescript
import { renderHook, waitFor } from '@testing-library/react';

describe('useRamlToOpenApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should return loading state initially', () => {
    const { result } = renderHook(() => useRamlToOpenApi('raml-def'));
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe('');
    expect(result.current.error).toBeUndefined();
  });
  
  it('should return data after successful parse', async () => {
    mockParser.mockResolvedValueOnce('openapi-spec');
    
    const { result } = renderHook(() => useRamlToOpenApi('raml-def'));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.data).toBe('openapi-spec');
    expect(result.current.error).toBeUndefined();
  });
});
```

## Common Pitfalls and Solutions

### Pitfall 1: Unmocked Dependencies

**Problem:** Unmocked dependencies can cause real API calls, database queries, or file system access.

```typescript
// ❌ BAD - Real dependency used
import { apiClient } from './api';

it('should fetch user', async () => {
  const user = await apiClient.getUser(123); // Real API call!
  expect(user.name).toBe('John');
});
```

**Solution:** Mock all external dependencies.

```typescript
// ✅ GOOD - Dependency mocked
jest.mock('./api');
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

it('should fetch user', async () => {
  mockApiClient.getUser.mockResolvedValueOnce({ id: 123, name: 'John' });
  
  const user = await apiClient.getUser(123);
  
  expect(user.name).toBe('John');
  expect(mockApiClient.getUser).toHaveBeenCalledTimes(1);
});
```

### Pitfall 2: Accidental Service Calls

**Problem:** Missing `mockOnce` or call count assertions can lead to unintended service calls.

```typescript
// ❌ BAD - Mock persists, could be called multiple times
it('test suite', () => {
  mockService.call.mockResolvedValue(data);
  // If another test calls this, it will execute again
});
```

**Solution:** Use `mockOnce` and verify call counts.

```typescript
// ✅ GOOD - Explicit, scoped mock
it('should call service once', async () => {
  mockService.call.mockResolvedValueOnce(data);
  
  await handler.process();
  
  expect(mockService.call).toHaveBeenCalledTimes(1);
});
```

### Pitfall 3: Test Interdependence

**Problem:** Tests that depend on order or shared state.

```typescript
// ❌ BAD - Tests share state
describe('Counter', () => {
  let counter = 0; // Shared across tests!
  
  it('increments', () => {
    counter++;
    expect(counter).toBe(1);
  });
  
  it('increments again', () => {
    counter++;
    expect(counter).toBe(2); // Depends on previous test!
  });
});
```

**Solution:** Initialize fresh state in `beforeEach`.

```typescript
// ✅ GOOD - Independent tests
describe('Counter', () => {
  let counter: number;
  
  beforeEach(() => {
    counter = 0; // Fresh for each test
  });
  
  it('increments', () => {
    counter++;
    expect(counter).toBe(1);
  });
  
  it('increments again', () => {
    counter++;
    expect(counter).toBe(1); // Independent!
  });
});
```

## Performance Considerations

### Mock Overhead

Every mock call has overhead. Unchecked mocks can accumulate:

```typescript
// ❌ BAD - Mock called many times unnecessarily
it('should process items', () => {
  mockLogger.log.mockImplementation(() => {}); // Called 1000x in loop!
  processor.processItems(items); // Logs each item
});

// ✅ GOOD - Verify and limit calls
it('should process items', () => {
  mockLogger.log.mockImplementation(() => {});
  processor.processItems(items);
  
  // Verify it's not called excessively
  expect(mockLogger.log).toHaveBeenCalledTimes(items.length);
});
```

### Test Execution Speed

- Keep tests fast (< 100ms each)
- Mock expensive operations (API, DB, file I/O)
- Use `jest.setTimeout()` sparingly
- Parallelize independent test suites

## Test Checklist

Before submitting tests, verify:

- [ ] Root `describe` block for component/module
- [ ] Nested `describe` blocks for each function
- [ ] `beforeEach` initializes all test variables
- [ ] `afterEach` clears all mocks
- [ ] All mocks use `mockOnce` where appropriate
- [ ] Call counts explicitly verified with `toHaveBeenCalledTimes`
- [ ] Arguments verified with `toHaveBeenCalledWith` or `toHaveBeenNthCalledWith`
- [ ] Positive test cases cover happy paths
- [ ] Negative test cases cover error conditions
- [ ] Edge cases tested (null, undefined, boundaries)
- [ ] All async tests use `async/await` or return promises
- [ ] No test interdependencies (tests can run in any order)
- [ ] Test coverage ≥ 95% (aim for 100%)

## Example: Complete Test File

```typescript
import { RamlParser, ParserConfig } from './raml.parser';

// Mock dependencies
jest.mock('webapi-parser', () => ({
  WebApiParser: {
    raml08: { parse: jest.fn() },
    raml10: { parse: jest.fn() },
    oas20: { generateString: jest.fn() }
  }
}));

const mockWebApiParser = require('webapi-parser').WebApiParser;

// Root describe - one per file
describe('RamlParser', () => {
  let parser: RamlParser;
  
  // Initialize before each test
  beforeEach(() => {
    parser = new RamlParser();
  });
  
  // Cleanup after each test
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  // Nested describe per function
  describe('parse', () => {
    // Positive cases
    it('should parse RAML 0.8 correctly', async () => {
      const definition = '#%RAML 0.8\ntitle: Test API';
      const config: ParserConfig = { version: '0.8', outputFormat: 'oas20' };
      const mockModel = {};
      const mockOutput = '{"openapi": "3.0.0"}';
      
      mockWebApiParser.raml08.parse.mockResolvedValueOnce(mockModel);
      mockWebApiParser.oas20.generateString.mockResolvedValueOnce(mockOutput);
      
      const result = await parser.parse(definition, config);
      
      expect(result).toBe(mockOutput);
      expect(mockWebApiParser.raml08.parse).toHaveBeenCalledTimes(1);
      expect(mockWebApiParser.raml08.parse).toHaveBeenCalledWith(definition);
      expect(mockWebApiParser.oas20.generateString).toHaveBeenCalledTimes(1);
      expect(mockWebApiParser.oas20.generateString).toHaveBeenCalledWith(mockModel);
    });
    
    // Negative cases
    it('should throw error for unsupported version', async () => {
      const definition = 'title: Test API';
      const config: ParserConfig = {
        version: '2.0' as any,
        outputFormat: 'oas20'
      };
      
      await expect(parser.parse(definition, config))
        .rejects.toThrow('Unsupported RAML version: 2.0');
    });
    
    // Edge cases
    it('should handle empty definition', async () => {
      const definition = '';
      const config: ParserConfig = { version: '1.0', outputFormat: 'oas20' };
      
      await expect(parser.parse(definition, config))
        .rejects.toThrow('Definition cannot be empty');
    });
  });
  
  describe('clearCache', () => {
    it('should clear cached results', async () => {
      const definition = '#%RAML 1.0\ntitle: Test API';
      const config: ParserConfig = { version: '1.0', outputFormat: 'oas20' };
      const mockOutput = '{"openapi": "3.0.0"}';
      
      mockWebApiParser.raml10.parse.mockResolvedValueOnce({});
      mockWebApiParser.oas20.generateString.mockResolvedValueOnce(mockOutput);
      
      // First call - should parse
      await parser.parse(definition, config);
      expect(mockWebApiParser.raml10.parse).toHaveBeenCalledTimes(1);
      
      // Second call - should use cache
      await parser.parse(definition, config);
      expect(mockWebApiParser.raml10.parse).toHaveBeenCalledTimes(1);
      
      // Clear cache
      parser.clearCache();
      
      // Third call - should parse again
      mockWebApiParser.raml10.parse.mockResolvedValueOnce({});
      mockWebApiParser.oas20.generateString.mockResolvedValueOnce(mockOutput);
      await parser.parse(definition, config);
      expect(mockWebApiParser.raml10.parse).toHaveBeenCalledTimes(2);
    });
  });
});
```

## Summary

Following these testing guidelines will:
- ✅ Prevent test bleed and flaky tests
- ✅ Ensure predictable, reliable test suites
- ✅ Catch bugs through comprehensive coverage
- ✅ Maintain high performance in test execution
- ✅ Make tests maintainable and easy to understand
- ✅ Prevent accidental service calls and mock pollution

Remember: **The best tests are explicit, isolated, and fast.**
