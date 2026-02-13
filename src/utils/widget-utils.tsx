import { ApiDefinitionWidget } from "@backstage/plugin-api-docs";
import { RAML_WIDGET_TYPE, RAML_WIDGET_TITLE } from "../constants";
import RamlDefinitionWidget from "../components/RamlDefinitionWidget";

/**
 * Backstage Api Definition Widget array filter by definition type.
 * @param type the api definition widget type (e.g: openapi, raml)
 * @returns A function that checks if a widget's type matches the specified type.
 */
export function byType(type: string) {
  return (widget: ApiDefinitionWidget) => widget.type === type;
}

/**
 * Creates a RAML Api Definition widget using the provided OpenApi widget.
 * @param openapiWidget the OpenApi widget to wrap
 * @returns the RAML widget
 */
export function createRamlWidget(
  openapiWidget: ApiDefinitionWidget
): ApiDefinitionWidget {
  return {
    type: RAML_WIDGET_TYPE,
    title: RAML_WIDGET_TITLE,
    component: (definition: string) => (
      <RamlDefinitionWidget
        component={openapiWidget.component}
        definition={definition}
      />
    ),
  };
}
