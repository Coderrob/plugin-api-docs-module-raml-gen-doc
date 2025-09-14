import { renderHook, waitFor } from "@testing-library/react";
import { useRamlToOpenApi } from "./useRamlToOpenApi";

jest.mock("../utils/raml.parser");

const mockRamlParser = require("../utils/raml.parser").RamlParser;

describe("useRamlToOpenApi", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should parse RAML 0.8 definition", async () => {
    const definition = "#%RAML 0.8\ntitle: Test API";
    const mockOutput = '{"openapi": "3.0.0"}';

    mockRamlParser.prototype.parse.mockResolvedValue(mockOutput);

    const { result } = renderHook(() => useRamlToOpenApi(definition));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBe(mockOutput);
    expect(result.current.error).toBeUndefined();
  });

  it("should handle errors", async () => {
    const definition = "invalid raml";
    const mockError = new Error("Parse error");

    mockRamlParser.prototype.parse.mockRejectedValue(mockError);

    const { result } = renderHook(() => useRamlToOpenApi(definition));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBe("");
  });
});
