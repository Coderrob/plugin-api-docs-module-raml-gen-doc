import { WebApiParser as parser } from "webapi-parser";
import { ParserStrategy } from "./raml.parser";

/**
 * Parser strategy for RAML 0.8 definitions.
 */
export class Raml08Parser implements ParserStrategy {
  /**
   * Parses a RAML 0.8 definition and generates an OpenAPI 2.0 string.
   * @param definition - The RAML 0.8 definition string.
   * @returns A promise that resolves to the OpenAPI 2.0 string.
   */
  async parse(definition: string): Promise<string> {
    const model = await parser.raml08.parse(definition);
    return parser.oas20.generateString(model);
  }
}
