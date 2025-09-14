import { Raml08Parser } from "./raml-08.parser";
import { Raml10Parser } from "./raml-10.parser";

export interface ParserConfig {
  version: "0.8" | "1.0";
  outputFormat: "oas20";
}

export interface ParserStrategy {
  parse(definition: string): Promise<string>;
}

/**
 * A parser class for converting RAML definitions to OpenAPI 2.0 format.
 * Supports RAML versions 0.8 and 1.0 with caching for performance.
 */
export class RamlParser {
  private cache = new Map<string, string>();
  private strategies: Record<string, ParserStrategy> = {
    "0.8": new Raml08Parser(),
    "1.0": new Raml10Parser(),
  };

  /**
   * Parses a RAML definition to OpenAPI 2.0 based on the provided configuration.
   * Uses caching to avoid re-parsing identical definitions.
   * @param definition - The RAML definition string to parse.
   * @param config - The parser configuration including version and output format.
   * @returns A promise that resolves to the OpenAPI 2.0 string.
   * @throws Error if the RAML version is unsupported.
   */
  async parse(definition: string, config: ParserConfig): Promise<string> {
    const cacheKey = `${config.version}-${definition}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const strategy = this.strategies[config.version];
    if (!strategy) {
      throw new Error(`Unsupported RAML version: ${config.version}`);
    }

    const result = await strategy.parse(definition);
    this.cache.set(cacheKey, result);
    return result;
  }

  /**
   * Clears the internal cache of parsed definitions.
   */
  clearCache(): void {
    this.cache.clear();
  }
}
