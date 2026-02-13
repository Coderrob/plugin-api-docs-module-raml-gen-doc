import { Progress, ErrorPanel } from "@backstage/core-components";
import { useRamlToOpenApi } from "../hooks/useRamlToOpenApi";
import type { FC, ReactElement } from "react";

export type RamlDefinitionWidgetProps = {
  definition: string;
  component: (definition: string) => ReactElement;
};

/**
 * A React component that renders a RAML API definition by converting it to OpenAPI and using the provided component.
 * @param props - The props for the component.
 * @param props.definition - The RAML definition string to be parsed and rendered.
 * @param props.component - A function that takes an OpenAPI definition string and returns a React element for rendering.
 * @returns A React element that displays the API definition or loading/error states.
 */
const RamlDefinitionWidget: FC<RamlDefinitionWidgetProps> = ({
  component,
  definition,
}) => {
  const { data: apiDef, isLoading, error } = useRamlToOpenApi(definition);

  if (isLoading) {
    return <Progress />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }

  return component(apiDef);
};

export default RamlDefinitionWidget;
