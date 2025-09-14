import { ApiDefinitionWidget } from "@backstage/plugin-api-docs";
import { OPENAPI_WIDGET_TYPE } from "./constants";
import { byType, createRamlWidget } from "./utils/widget-utils";

/**
 * Adds the RAML Api Definition Widget to the list
 * of widgets. The widget will only be added if the
 * OpenApi widget is present in the list of widgets.
 *
 * The RAML definition is parsed to OpenApi 2.0 spec
 * and passed through the OpenApi Api Definition Widget
 * for rendering in Api Docs.
 * @param widgets the default or custom widgets
 * @returns the widgets with the raml widget added if
 * the openapi widget was available.
 */
export function addRamlDefinitionWidget(
  widgets: ApiDefinitionWidget[]
): ApiDefinitionWidget[] {
  if (!Array.isArray(widgets)) {
    return [];
  }

  /**
   * Find the OpenApi widget if its available
   */
  const openapiWidget = widgets.find(byType(OPENAPI_WIDGET_TYPE));

  /**
   * If the OpenApi widget is not available
   * we can't wrap it to render the RAML.
   */
  if (!openapiWidget) {
    return widgets;
  }

  /**
   * Add the RAML Api Definition widget using the
   * OpenApi widget to handle the parsed RAML.
   */
  return widgets.concat(createRamlWidget(openapiWidget));
}
