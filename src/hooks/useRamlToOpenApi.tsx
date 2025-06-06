import { useState, useEffect } from "react";
import { WebApiParser as parser } from "webapi-parser";
import { HookResponse } from "../types";

/**
 * Parses a RAML api definition to OpenApi 2.0 specification
 * @param definition
 * @returns
 */
export function useRamlToOpenApi(definition: string): HookResponse<string> {
  const [state, setState] = useState<{
    data: string;
    isLoading: boolean;
    error?: Error;
  }>({
    data: "",
    isLoading: true,
  });

  useEffect(() => {
    let cancelled = false;
    (async function () {
      try {
        const ramlParser = definition.startsWith("#%RAML 0.8")
          ? parser.raml08
          : parser.raml10;

        const openApiDef = await ramlParser
          .parse(definition)
          .then(parser.oas20.generateString);

        if (!cancelled) {
          setState({ data: openApiDef, isLoading: false });
        }
      } catch (error) {
        if (!cancelled) {
          setState({ data: "", isLoading: false, error });
        }
      }
      return () => {
        cancelled = true;
      };
    })();
  }, [definition]);

  return state;
}
