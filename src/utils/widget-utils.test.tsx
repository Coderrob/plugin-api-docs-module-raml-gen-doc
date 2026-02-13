import { byType, createRamlWidget } from "./widget-utils";
import { RAML_WIDGET_TYPE, RAML_WIDGET_TITLE } from "../constants";
import { ApiDefinitionWidget } from "@backstage/plugin-api-docs";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("../components/RamlDefinitionWidget", () => ({
  __esModule: true,
  default: ({ component, definition }: any) => (
    <div data-testid="raml-widget">
      {definition}
      {component && <span data-testid="component-present" />}
    </div>
  ),
}));

describe("widget-utils", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("byType", () => {
    it("returns a function that matches widget type", () => {
      const widget: ApiDefinitionWidget = {
        type: "openapi",
        title: "OpenAPI",
        component: jest.fn(),
      };
      expect(byType("openapi")(widget)).toBe(true);
      expect(byType("raml")(widget)).toBe(false);
    });
  });

  describe("createRamlWidget", () => {
    const openapiWidget: ApiDefinitionWidget = {
      type: "openapi",
      title: "OpenAPI",
      component: jest.fn(),
    };

    it("returns a widget with RAML type and title", () => {
      const ramlWidget = createRamlWidget(openapiWidget);
      expect(ramlWidget.type).toBe(RAML_WIDGET_TYPE);
      expect(ramlWidget.title).toBe(RAML_WIDGET_TITLE);
      expect(typeof ramlWidget.component).toBe("function");
    });

    it("renders RamlDefinitionWidget with correct props", () => {
      const ramlWidget = createRamlWidget(openapiWidget);
      const { getByTestId, getByText } = render(
        ramlWidget.component("raml-definition")
      );
      expect(getByTestId("raml-widget")).toBeInTheDocument();
      expect(getByText("raml-definition")).toBeInTheDocument();
      expect(getByTestId("component-present")).toBeInTheDocument();
    });
  });
});
