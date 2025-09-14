import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RamlDefinitionWidget, {
  RamlDefinitionWidgetProps,
} from "./RamlDefinitionWidget";
import { useRamlToOpenApi } from "../hooks/useRamlToOpenApi";

// Mock dependencies
jest.mock("@backstage/core-components", () => ({
  Progress: () => <div data-testid="progress" />,
  ErrorPanel: ({ error }: { error: Error }) => (
    <div data-testid="error">{error.message}</div>
  ),
}));
jest.mock("../hooks/useRamlToOpenApi");

const mockUseRamlToOpenApi = useRamlToOpenApi as jest.MockedFunction<
  typeof useRamlToOpenApi
>;

const mockComponent = (definition: string) => (
  <div data-testid="custom-component">{definition}</div>
);

const defaultProps: RamlDefinitionWidgetProps = {
  definition: "raml-definition",
  component: mockComponent,
};

describe("RamlDefinitionWidget", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders Progress while loading", () => {
    mockUseRamlToOpenApi.mockReturnValue({
      data: "",
      isLoading: true,
      error: undefined,
    });

    render(<RamlDefinitionWidget {...defaultProps} />);
    expect(screen.getByTestId("progress")).toBeInTheDocument();
  });

  it("renders ErrorPanel on error", () => {
    const error = new Error("Conversion failed");
    mockUseRamlToOpenApi.mockReturnValue({
      data: "",
      isLoading: false,
      error,
    });

    render(<RamlDefinitionWidget {...defaultProps} />);
    expect(screen.getByTestId("error")).toHaveTextContent("Conversion failed");
  });

  it("renders the provided component with converted definition", () => {
    mockUseRamlToOpenApi.mockReturnValue({
      data: "openapi-definition",
      isLoading: false,
      error: undefined,
    });

    render(<RamlDefinitionWidget {...defaultProps} />);
    expect(screen.getByTestId("custom-component")).toHaveTextContent(
      "openapi-definition"
    );
  });
});
