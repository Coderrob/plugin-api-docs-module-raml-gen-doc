import { RamlParser, ParserConfig } from "./raml.parser";

jest.mock("webapi-parser", () => ({
  WebApiParser: {
    raml08: {
      parse: jest.fn(),
    },
    raml10: {
      parse: jest.fn(),
    },
    oas20: {
      generateString: jest.fn(),
    },
  },
}));

const mockWebApiParser = require("webapi-parser").WebApiParser;

describe("RamlParser", () => {
  let parser: RamlParser;

  beforeEach(() => {
    parser = new RamlParser();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should parse RAML 0.8 correctly", async () => {
    const definition = "#%RAML 0.8\ntitle: Test API";
    const config: ParserConfig = { version: "0.8", outputFormat: "oas20" };
    const mockModel = {};
    const mockOutput = '{"openapi": "3.0.0"}';

    mockWebApiParser.raml08.parse.mockResolvedValue(mockModel);
    mockWebApiParser.oas20.generateString.mockResolvedValue(mockOutput);

    const result = await parser.parse(definition, config);

    expect(result).toBe(mockOutput);
    expect(mockWebApiParser.raml08.parse).toHaveBeenCalledWith(definition);
    expect(mockWebApiParser.oas20.generateString).toHaveBeenCalledWith(
      mockModel
    );
  });

  it("should cache results", async () => {
    const definition = "#%RAML 1.0\ntitle: Test API";
    const config: ParserConfig = { version: "1.0", outputFormat: "oas20" };
    const mockOutput = '{"openapi": "3.0.0"}';

    mockWebApiParser.raml10.parse.mockResolvedValue({});
    mockWebApiParser.oas20.generateString.mockResolvedValue(mockOutput);

    await parser.parse(definition, config);
    await parser.parse(definition, config); // Should use cache

    expect(mockWebApiParser.raml10.parse).toHaveBeenCalledTimes(1);
  });

  it("should throw error for unsupported version", async () => {
    const definition = "title: Test API";
    const config: ParserConfig = {
      version: "2.0" as any,
      outputFormat: "oas20",
    };

    await expect(parser.parse(definition, config)).rejects.toThrow(
      "Unsupported RAML version: 2.0"
    );
  });
});
