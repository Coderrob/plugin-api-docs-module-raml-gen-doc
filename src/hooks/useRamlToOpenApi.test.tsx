import { renderHook } from '@testing-library/react-hooks';
import { useRamlToOpenApi } from './useRamlToOpenApi';

describe('useRamlToOpenApi', () => {
  const ramlInput = 'valid raml definition';

  it.each([
    // Add expected outcomes based on valid and invalid inputs
    [ramlInput, true],
    ['', false],
  ])('should return %s for raml definition %s', (input, expected) => {
    const { result } = renderHook(() => useRamlToOpenApi(input));
    expect(result.current.isLoading).toBe(expected);
  });
});
