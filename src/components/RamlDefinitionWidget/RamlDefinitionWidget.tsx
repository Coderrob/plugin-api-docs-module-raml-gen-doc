import { Progress } from '@backstage/core-components';
import { useRamlToOpenApi } from '../../hooks/useRamlToOpenApi';

/**
 * Props for RamlDefinitionWidget component.
 * @param definition - RAML definition string.
 * @param component - Render prop function that takes the API definition as a parameter.
 */
export type RamlDefinitionWidgetProps = {
  definition: string;
  component: (definition: string) => React.ReactElement;
};

/**
 * Renders a widget based on a RAML definition.
 * @param props - RamlDefinitionWidgetProps
 * @returns React.ReactElement
 */
export default function RamlDefinitionWidget({
  component,
  definition,
}: Readonly<RamlDefinitionWidgetProps>): React.ReactElement {
  const { data: apiDef, isLoading } = useRamlToOpenApi(definition);

  if (isLoading) {
    return <Progress />;
  }

  return component(apiDef);
}
