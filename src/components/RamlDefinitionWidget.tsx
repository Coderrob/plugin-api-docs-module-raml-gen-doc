import { Progress } from "@backstage/core-components";
import { useRamlToOpenApi } from "../hooks/useRamlToOpenApi";

export type RamlDefinitionWidgetProps = {
  definition: string;
  component: (definition: string) => React.ReactElement;
};

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
