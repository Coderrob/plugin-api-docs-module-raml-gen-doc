import { render, screen } from '@testing-library/react';
import RamlDefinitionWidget from './RamlDefinitionWidget';
import { useRamlToOpenApi } from '../../hooks/useRamlToOpenApi';

jest.mock('../../hooks/useRamlToOpenApi');

describe('RamlDefinitionWidget', () => {
  const mockComponent = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ['valid definition', 'mock definition'],
    ['another valid definition', 'another mock definition'],
  ])('renders component correctly for %s', (def, expected) => {
    // Mock the hook to return the expected data when isLoading is false
    (useRamlToOpenApi as jest.Mock).mockReturnValue({ data: expected, isLoading: false });

    render(<RamlDefinitionWidget component={mockComponent} definition={def} />);
    expect(mockComponent).toHaveBeenCalledWith(expected);
  });

  it('shows loading indicator when isLoading is true', () => {
    // Mock the hook to return loading state
    (useRamlToOpenApi as jest.Mock).mockReturnValue({ data: '', isLoading: true });

    render(<RamlDefinitionWidget component={mockComponent} definition="" />);
    expect(screen.getByText(/loading/i)).toBeDefined(); // Assumes loading state has "loading" text
  });
});
