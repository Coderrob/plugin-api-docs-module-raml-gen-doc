import { addRamlDefinitionWidget } from "./addRamlDefinitionWidget";
import { ApiDefinitionWidget } from "@backstage/plugin-api-docs";
import { OPENAPI_WIDGET_TYPE } from "./constants";
import { createRamlWidget, byType } from "./utils/widget-utils";
import { createElement } from "react";

jest.mock("./utils/widget-utils", () => ({
  ...jest.requireActual("./utils/widget-utils"),
  createRamlWidget: jest.fn(),
}));

describe("addRamlDefinitionWidget", () => {
  const openApiWidget: ApiDefinitionWidget = {
    type: OPENAPI_WIDGET_TYPE,
    title: "OpenAPI",
    component: () => createElement("div"),
  };

  const otherWidget: ApiDefinitionWidget = {
    type: "other",
    title: "Other",
    component: () => createElement("div"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns empty array if widgets is not an array", () => {
    // @ts-expect-error
    expect(addRamlDefinitionWidget(undefined)).toEqual([]);
    // @ts-expect-error
    expect(addRamlDefinitionWidget(null)).toEqual([]);
    // @ts-expect-error
    expect(addRamlDefinitionWidget({})).toEqual([]);
  });

  it("returns original widgets if OpenApi widget is not present", () => {
    const widgets = [otherWidget];
    expect(addRamlDefinitionWidget(widgets)).toBe(widgets);
  });

  it("adds RAML widget if OpenApi widget is present", () => {
    const widgets = [otherWidget, openApiWidget];
    const ramlWidget: ApiDefinitionWidget = {
      type: "raml",
      title: "RAML",
      component: () => createElement("div"),
    };

    (createRamlWidget as jest.Mock).mockReturnValue(ramlWidget);

    const result = addRamlDefinitionWidget(widgets);

    expect(createRamlWidget).toHaveBeenCalledWith(openApiWidget);
    expect(result).toEqual([...widgets, ramlWidget]);
  });

  it("does not add RAML widget if OpenApi widget is not present", () => {
    const widgets = [otherWidget];
    const result = addRamlDefinitionWidget(widgets);
    expect(createRamlWidget).not.toHaveBeenCalled();
    expect(result).toBe(widgets);
  });
});
