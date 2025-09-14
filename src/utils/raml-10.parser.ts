import { WebApiParser as parser } from "webapi-parser";
import { ParserStrategy } from "./raml.parser";

/**
 * Parser strategy for RAML 1.0 definitions.
 */
export class Raml10Parser implements ParserStrategy {
  /**
   * Parses a RAML 1.0 definition and generates an OpenAPI 2.0 string.
   * @param definition - The RAML 1.0 definition string.
   * @returns A promise that resolves to the OpenAPI 2.0 string.
   */
  async parse(definition: string): Promise<string> {
    const model = await parser.raml10.parse(definition);
    return parser.oas20.generateString(model);
  }
}
