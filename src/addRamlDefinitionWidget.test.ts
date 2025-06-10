import { ApiDefinitionWidget } from '@backstage/plugin-api-docs';
import { addRamlDefinitionWidget } from './addRamlDefinitionWidget';
import { OPENAPI_WIDGET_TYPE } from './constants';

describe('addRamlDefinitionWidget', () => {
  const openApiWidget: Readonly<ApiDefinitionWidget> = Object.freeze({
    type: OPENAPI_WIDGET_TYPE,
    component: jest.fn(),
    title: '',
  });

  it.each([
    [[openApiWidget], 2], // Test with OpenAPI widget available
    [[], 0], // Test with empty widget array
    [[{ type: 'other' }], 1], // No OpenAPI widget
  ])('returns correct length of widgets array', (input, expectedLength) =>
    expect(addRamlDefinitionWidget(input as ApiDefinitionWidget[])).toHaveLength(expectedLength)
  );
});
